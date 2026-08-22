const express = require("express");
const cors = require("cors");
const amqp = require("amqplib");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // limite o timeout de 15 minutos
  max: 150, // limite maximo de usuarios por ventana de tiempo
  message: {
    error: "Demasiadas peticiones. Inténtelo de nuevo más tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(cors());
app.use(express.json());
app.use(limiter);

// Endpoint que consumirá Angular
app.get("/api/weather", async (req, res) => {
  // Si no enviamos coordenadas, usamos San Francisco por defecto

  const datosPeticion = {
    ciudad: req.query.ciudad, // Añadimos la captura del nombre de la ciudad
    lat: req.query.lat || 37.763283,
    lon: req.query.lon || -122.41286,
  };

  try {
    const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq";
    const conexion = await amqp.connect(RABBITMQ_URL);
    const canal = await conexion.createChannel();

    // Cola de peticiones donde escucha el microservicio
    const colaPeticiones = "peticiones_clima";

    // Cola temporal y exclusiva para recibir la respuesta de esta petición en concreto
    const q = await canal.assertQueue("", { exclusive: true });

    // Un identificador único para saber que la respuesta es para esta petición
    const correlationId = Date.now().toString();

    console.log(
      `[Gateway] Solicitando clima para lat:${datosPeticion.lat}, lon:${datosPeticion.lon}`,
    );

    // Escuchamos la respuesta del microservicio
    canal.consume(
      q.queue,
      (msg) => {
        if (msg.properties.correlationId === correlationId) {
          const datos = JSON.parse(msg.content.toString());
          if (datos.error) {
            // Extraemos el código HTTP del mensaje de error del microservicio
            const match = datos.error.match(/HTTP (\d{3})/);

            if (match) {
              const statusCode = parseInt(match[1], 10);
              res.status(statusCode).json({
                error:
                  "Límite de peticiones excedido o error en la API externa.",
              });
            } else {
              res.status(400).json(datos);
            }
          } else {
            res.json(datos);
          }
          setTimeout(() => {
            conexion.close();
          }, 500);
        }
      },
      { noAck: true },
    );

    // Enviamos la petición a la cola general
    const peticion = {
      ciudad: datosPeticion.ciudad,
      lat: datosPeticion.lat,
      lon: datosPeticion.lon,
    };
    canal.sendToQueue(colaPeticiones, Buffer.from(JSON.stringify(peticion)), {
      correlationId: correlationId,
      replyTo: q.queue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor RabbitMQ" });
  }
});

// Arrancamos el servidor en el puerto 3000
const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () =>
  console.log(
    `[Gateway] Escuchando peticiones HTTP en http://localhost:${PUERTO}`,
  ),
);
