const amqp = require('amqplib');

async function iniciarMicroservicio() {
    try {
        const conexion = await amqp.connect('amqp://localhost');
        const canal = await conexion.createChannel();
        const colaPeticiones = 'peticiones_clima';

        await canal.assertQueue(colaPeticiones, { durable: false });
        console.log('[Microservicio] Listo y esperando peticiones...');

        // Escuchamos peticiones
        canal.consume(colaPeticiones, async (msg) => {
            const datosPeticion = JSON.parse(msg.content.toString());
            console.log(`\n[Microservicio] Procesando lat: ${datosPeticion.lat}, lon: ${datosPeticion.lon}`);

            try {
                // Llamada a Open-Meteo
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${datosPeticion.lat}&longitude=${datosPeticion.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;
                const respuesta = await fetch(url);
                const datosClima = await respuesta.json();

                const datosLimpios = {
                    temperatura: datosClima.current.temperature_2m,
                    humedad: datosClima.current.relative_humidity_2m,
                    viento: datosClima.current.wind_speed_10m
                };

                // Enviamos la respuesta a la cola temporal que creó el Gateway
                canal.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(datosLimpios)), {
                    correlationId: msg.properties.correlationId
                });
                
                console.log(`[Microservicio] Datos enviados de vuelta al Gateway.`);
                
                // Confirmamos a RabbitMQ que el trabajo está terminado
                canal.ack(msg); 
                
            } catch (error) {
                console.error("[Microservicio] Falló la petición a la API externa.", error);
                canal.nack(msg); // Si falla, lo devolvemos a la cola
            }
            
        }, { noAck: false }); // Usamos confirmación manual (ack) por seguridad

    } catch (error) {
        console.error("Error en microservicio:", error);
    }
}

iniciarMicroservicio();