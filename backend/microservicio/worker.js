const amqp = require('amqplib');

async function iniciarMicroservicio() {
    try {
        const conexion = await amqp.connect('amqp://rabbitmq');
        const canal = await conexion.createChannel();
        const colaPeticiones = 'peticiones_clima';

        await canal.assertQueue(colaPeticiones, { durable: false });
        console.log('[Microservicio] Listo y esperando peticiones...');

        // Escuchamos peticiones
        canal.consume(colaPeticiones, async (msg) => {
            const datosPeticion = JSON.parse(msg.content.toString());
            console.log(`\n[Microservicio] Procesando lat: ${datosPeticion.lat}, lon: ${datosPeticion.lon}`);

            try {
                // 1. Llamada a Open-Meteo (Añadido &hourly=temperature_2m)
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${datosPeticion.lat}&longitude=${datosPeticion.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m`;
                const respuesta = await fetch(url);
                const datosClima = await respuesta.json();

                // 2. Extraemos las primeras 24 horas de tiempo y temperatura
                const horas = datosClima.hourly.time.slice(0, 24);
                const temperaturasPorHora = datosClima.hourly.temperature_2m.slice(0, 24);

                // 3. Estructuramos el nuevo objeto limpio
                const datosLimpios = {
                    temperatura: datosClima.current.temperature_2m,
                    humedad: datosClima.current.relative_humidity_2m,
                    viento: datosClima.current.wind_speed_10m,
                    pronostico24h: {
                        horas: horas,
                        temperaturas: temperaturasPorHora
                    }
                };

                // Enviamos la respuesta a la cola temporal que creó el Gateway
                canal.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(datosLimpios)), {
                    correlationId: msg.properties.correlationId
                });
                
                console.log(`[Microservicio] Datos actuales y pronóstico 24h enviados al Gateway.`);
                
                // Confirmamos a RabbitMQ que el trabajo está terminado
                canal.ack(msg); 
                
            } catch (error) {
                console.error("[Microservicio] Falló la petición a la API externa.", error);
                canal.nack(msg); // Si falla, lo devolvemos a la cola
            }
            
        }, { noAck: false }); 

    } catch (error) {
        console.error("Error en microservicio:", error);
    }
}

iniciarMicroservicio();