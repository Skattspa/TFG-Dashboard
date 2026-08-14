const amqp = require("amqplib");

async function iniciarMicroservicio() {
  try {
    // Conexión a RabbitMQ usando el nombre del contenedor
    const conexion = await amqp.connect("amqp://rabbitmq");
    const canal = await conexion.createChannel();
    const colaPeticiones = "peticiones_clima";

    await canal.assertQueue(colaPeticiones, { durable: false });
    console.log("[Microservicio] Listo y esperando peticiones...");

    canal.consume(
      colaPeticiones,
      async (msg) => {
        const datosPeticion = JSON.parse(msg.content.toString());
        console.log(`\n[Microservicio] Petición recibida:`, datosPeticion);

        try {
          let lat = datosPeticion.lat;
          let lon = datosPeticion.lon;
          let nombreCiudad = "Ubicación actual";

          // 1. Geocoding: Si nos envían el nombre de una ciudad, buscamos sus coordenadas
          if (datosPeticion.ciudad) {
            console.log(
              `[Microservicio] Buscando coordenadas para: ${datosPeticion.ciudad}`,
            );
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(datosPeticion.ciudad)}&count=1&language=es&format=json`;
            const geoRespuesta = await fetch(geoUrl);
            const geoDatos = await geoRespuesta.json();

            // Si la API no encuentra la ciudad, lanzamos un error
            if (!geoDatos.results || geoDatos.results.length === 0) {
              throw new Error(
                `No se encontró la ciudad: ${datosPeticion.ciudad}`,
              );
            }

            // Extraemos las coordenadas y formateamos el nombre (Ej. "Madrid, Spain")
            lat = geoDatos.results[0].latitude;
            lon = geoDatos.results[0].longitude;
            nombreCiudad = `${geoDatos.results[0].name}${geoDatos.results[0].country ? ", " + geoDatos.results[0].country : ""}`;
          }

          // Si no hay coordenadas a este punto, la petición es inválida
          if (!lat || !lon) {
            throw new Error(
              "No se proporcionaron coordenadas ni ciudad válida.",
            );
          }

          // 2. Llamada a Open-Meteo (Clima) con las coordenadas definitivas
          console.log(
            `[Microservicio] Consultando clima para lat: ${lat}, lon:${lon}`,
          );
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;
          const respuesta = await fetch(url);
          const datosClima = await respuesta.json();

          const horas = datosClima.hourly.time.slice(0, 24);
          const temperaturasPorHora = datosClima.hourly.temperature_2m.slice(
            0,
            24,
          );
          const humedadesPorHora = datosClima.hourly.relative_humidity_2m.slice(
            0,
            24,
          );
          const vientosPorHora = datosClima.hourly.wind_speed_10m.slice(0, 24);

          // 3. Estructuramos el nuevo objeto añadiendo el nombre de la ciudad
          const datosLimpios = {
            ciudad: nombreCiudad, // Añadimos esto para el Frontend
            temperatura: datosClima.current.temperature_2m,
            humedad: datosClima.current.relative_humidity_2m,
            viento: datosClima.current.wind_speed_10m,
            pronostico24h: {
              horas: horas,
              temperaturas: temperaturasPorHora,
              humedades: humedadesPorHora,
              vientos: vientosPorHora,
            },
          };

          // Enviamos la respuesta exitosa al Gateway
          canal.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(JSON.stringify(datosLimpios)),
            {
              correlationId: msg.properties.correlationId,
            },
          );

          console.log(
            `[Microservicio] Datos de ${nombreCiudad} enviados con éxito.`,
          );
          canal.ack(msg);
        } catch (error) {
          console.error("[Microservicio] Falló la petición:", error.message);

          // Novedad: Enviamos un JSON con el error al Gateway en lugar de quedarnos callados
          const errorPayload = { error: error.message };
          canal.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(JSON.stringify(errorPayload)),
            {
              correlationId: msg.properties.correlationId,
            },
          );
          // Damos el mensaje por procesado (aunque haya fallado) para no atascar la cola
          canal.ack(msg);
        }
      },
      { noAck: false },
    );
  } catch (error) {
    console.error("Error en microservicio:", error);
  }
}

iniciarMicroservicio();
