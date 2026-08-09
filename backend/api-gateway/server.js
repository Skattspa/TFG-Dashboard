const express = require('express');
const cors = require('cors');
const amqp = require('amqplib');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint que consumirá Angular
app.get('/api/weather', async (req, res) => {
    // Si no enviamos coordenadas, usamos San Francisco por defecto
    const lat = req.query.lat || 37.763283;
    const lon = req.query.lon || -122.41286;

    try {
        const conexion = await amqp.connect('amqp://localhost');
        const canal = await conexion.createChannel();
        
        // Cola de peticiones donde escucha el microservicio
        const colaPeticiones = 'peticiones_clima';
        
        // Cola temporal y exclusiva para recibir la respuesta de esta petición en concreto
        const q = await canal.assertQueue('', { exclusive: true });
        
        // Un identificador único para saber que la respuesta es para esta petición
        const correlationId = Date.now().toString();

        console.log(`[Gateway] Solicitando clima para lat:${lat}, lon:${lon}`);

        // Escuchamos la respuesta del microservicio
        canal.consume(q.queue, (msg) => {
            if (msg.properties.correlationId === correlationId) {
                const datos = JSON.parse(msg.content.toString());
                res.json(datos); // Enviamos el JSON limpio al Frontend
                
                // Limpiamos la conexión
                setTimeout(() => { conexion.close(); }, 500);
            }
        }, { noAck: true });

        // Enviamos la petición a la cola general
        const peticion = { lat, lon };
        canal.sendToQueue(colaPeticiones, Buffer.from(JSON.stringify(peticion)), {
            correlationId: correlationId,
            replyTo: q.queue
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor RabbitMQ' });
    }
});

// Arrancamos el servidor en el puerto 3000
const PUERTO = 3000;
app.listen(PUERTO, () => console.log(`[Gateway] Escuchando peticiones HTTP en http://localhost:${PUERTO}`));