const amqp = require("amqplib");

async function iniciarMicroservicio() {
  try {
    // Conexión a RabbitMQ usando el nombre del contenedor
    const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq";
    const conexion = await amqp.connect(RABBITMQ_URL);
    const canal = await conexion.createChannel();
    await canal.prefetch(10); // Limitar a 10 peticiones simultáneas para evitar saturar el microservicio
    const colaPeticiones = "peticiones_clima";

    await canal.assertQueue(colaPeticiones, { durable: false });
    console.log("[Microservicio] Listo y esperando peticiones...");

    canal.consume(
      colaPeticiones,
      async (msg) => {
        try {
          if (!msg?.content) {
            throw new Error("Mensaje RabbitMQ vacío");
          }

          const datosPeticion = JSON.parse(msg.content.toString());

          validarDatosPeticion(datosPeticion);

          console.log(`\n[Microservicio] Petición recibida:`, datosPeticion);

          let lat = datosPeticion.lat;
          let lon = datosPeticion.lon;
          let nombreCiudad = "Ubicación actual";

          // 1. Geocoding: Si nos envían el nombre de una ciudad, buscamos sus coordenadas
          if (datosPeticion.ciudad) {
            const ubicacion = await obtenerCoordenadas(datosPeticion.ciudad);

            lat = ubicacion.lat;
            lon = ubicacion.lon;
            nombreCiudad = ubicacion.nombre;
          }

          validarCoordenadas(lat, lon);

          console.log(
            `[Microservicio] Consultando clima para lat:${lat}, lon:${lon}`,
          );

          const datosClima = await obtenerClima(lat, lon);

          // 3. Estructuramos el nuevo objeto añadiendo el nombre de la ciudad
          const datosLimpios = transformarClima(datosClima, nombreCiudad);

          if (!msg.properties.replyTo) {
            throw new Error("ReplyTo ausente");
          }

          if (!msg.properties.correlationId) {
            throw new Error("CorrelationId ausente");
          }

          canal.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(JSON.stringify(datosLimpios)),
            {
              correlationId: msg.properties.correlationId,
            },
          );

          console.log(
            JSON.stringify({
              servicio: "worker-clima",
              ciudad: nombreCiudad,
              fecha: new Date().toISOString(),
            }),
          );
          canal.ack(msg);
        } catch (error) {
          console.error("[Microservicio] Falló la petición:", error.message);

          if (msg?.properties?.replyTo && msg?.properties?.correlationId) {
            const errorPayload = {
              error: error.message,
            };

            canal.sendToQueue(
              msg.properties.replyTo,
              Buffer.from(JSON.stringify(errorPayload)),
              {
                correlationId: msg.properties.correlationId,
              },
            );
          }

          canal.ack(msg);
        }
      },
      { noAck: false },
    );
  } catch (error) {
    console.error("Error en microservicio:", error);
  }
}

function validarDatosPeticion(datosPeticion) {
  if (datosPeticion.ciudad && typeof datosPeticion.ciudad !== "string") {
    throw new Error("La ciudad debe ser una cadena.");
  }

  if (datosPeticion.ciudad && datosPeticion.ciudad.trim().length === 0) {
    throw new Error("La ciudad no puede estar vacía.");
  }
  if (datosPeticion.ciudad && datosPeticion.ciudad.length > 100) {
    throw new Error("Nombre de ciudad demasiado largo.");
  }
  if (
    !datosPeticion ||
    (!datosPeticion.ciudad &&
      (datosPeticion.lat == null || datosPeticion.lon == null))
  ) {
    throw new Error(
      "Petición inválida. Debe incluir una ciudad o coordenadas válidas.",
    );
  }
}

function validarCoordenadas(lat, lon) {
  if (lat === undefined || lat === null || lon === undefined || lon === null) {
    throw new Error("No se proporcionaron coordenadas válidas.");
  }

  lat = Number(lat);
  lon = Number(lon);

  if (Number.isNaN(lat)) {
    throw new Error("Latitud inválida");
  }

  if (Number.isNaN(lon)) {
    throw new Error("Longitud inválida");
  }
  if (lat < -90 || lat > 90) {
    throw new Error("Latitud fuera de rango");
  }

  if (lon < -180 || lon > 180) {
    throw new Error("Longitud fuera de rango");
  }
}

async function obtenerCoordenadas(ciudad) {
  const baseUrl =
    process.env.GEOCODING_API_URL ||
    "https://geocoding-api.open-meteo.com/v1/search";
  const geoUrl = `${baseUrl}?name=${encodeURIComponent(ciudad)}&count=1&language=es&format=json`;

  const controlador = new AbortController();
  const timeout = setTimeout(() => controlador.abort(), 5000);
  let respuesta;

  try {
    respuesta = await fetch(geoUrl, {
      signal: controlador.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!respuesta.ok) {
    throw new Error(`Error Geocoding API HTTP ${respuesta.status}`);
  }

  const datos = await respuesta.json();

  if (!datos?.results?.length) {
    throw new Error(`No se encontró la ciudad: ${ciudad}`);
  }

  return {
    lat: datos.results[0].latitude,
    lon: datos.results[0].longitude,
    nombre:
      `${datos.results[0].name}` +
      `${datos.results[0].country ? ", " + datos.results[0].country : ""}`,
  };
}

async function obtenerClima(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m` +
    `&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;

  const controlador = new AbortController();

  const timeout = setTimeout(() => controlador.abort(), 5000);
  const inicio = performance.now();
  let respuesta;
  try {
    respuesta = await fetch(url, {
      signal: controlador.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
  const fin = performance.now();

  console.log(`[Performance] Open-Meteo: ${(fin - inicio).toFixed(2)} ms`);

  if (!respuesta.ok) {
    throw new Error(`Open-Meteo HTTP ${respuesta.status}`);
  }

  const datos = await respuesta.json();

  if (datos.error) {
    throw new Error(datos.reason || "Error devuelto por Open-Meteo");
  }

  if (!datos?.current || !datos?.hourly || !Array.isArray(datos.hourly.time)) {
    throw new Error("Respuesta Open-Meteo inválida");
  }

  return datos;
}

function transformarClima(datosClima, ciudad) {
  return {
    ciudad,

    temperatura: datosClima.current.temperature_2m,

    humedad: datosClima.current.relative_humidity_2m,

    viento: datosClima.current.wind_speed_10m,

    pronostico24h: {
      horas: datosClima.hourly.time.slice(0, 24),

      temperaturas: datosClima.hourly.temperature_2m.slice(0, 24),

      humedades: datosClima.hourly.relative_humidity_2m.slice(0, 24),

      vientos: datosClima.hourly.wind_speed_10m.slice(0, 24),
    },
  };
}

iniciarMicroservicio();
