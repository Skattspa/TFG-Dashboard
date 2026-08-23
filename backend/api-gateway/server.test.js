const request = require("supertest");
const app = require("./server");
const amqp = require("amqplib");

jest.mock("amqplib");

describe("API Gateway - /api/weather", () => {
  let mockChannel;

  beforeEach(() => {
    jest.clearAllMocks();

    // Creamos funciones falsas para el canal de RabbitMQ
    mockChannel = {
      assertQueue: jest.fn().mockResolvedValue({ queue: "cola_temporal" }),
      sendToQueue: jest.fn(),
      consume: jest.fn(),
      close: jest.fn(),
    };

    amqp.connect.mockResolvedValue({
      createChannel: jest.fn().mockResolvedValue(mockChannel),
      close: jest.fn(),
    });
  });

  it("Debería responder con datos del clima al enviar una ciudad", async () => {
    // 1. CONGELAMOS EL TIEMPO ANTES de hacer nada
    jest.spyOn(Date, "now").mockReturnValue(12345);

    mockChannel.consume.mockImplementation((queue, callback) => {
      // 2. Usamos el mismo ID que ahora generará el servidor (12345)
      const fakeMsg = {
        properties: { correlationId: "12345" },
        content: Buffer.from(
          JSON.stringify({ temperatura: 25, ciudad: "Madrid" }),
        ),
      };

      callback(fakeMsg);
    });

    // 3. Hacemos la petición
    const res = await request(app).get("/api/weather?ciudad=Madrid");

    // 4. Restauramos la fecha real para no afectar a otros tests
    jest.restoreAllMocks();

    expect(res.statusCode).toBe(200);
    expect(res.body.ciudad).toBe("Madrid");
    expect(res.body.temperatura).toBe(25);
  });
  it("Debería solicitar el clima usando las coordenadas por defecto si no se envía ciudad", async () => {
    jest.spyOn(Date, "now").mockReturnValue(99999);

    mockChannel.consume.mockImplementation((queue, callback) => {
      const fakeMsg = {
        properties: { correlationId: "99999" },
        content: Buffer.from(
          JSON.stringify({ temperatura: 15, ciudad: "San Francisco" }),
        ),
      };
      callback(fakeMsg);
    });

    // Supertest hace la petición a la raíz, sin query params
    const res = await request(app).get("/api/weather");

    jest.restoreAllMocks();

    expect(res.statusCode).toBe(200);
    expect(res.body.ciudad).toBe("San Francisco");
  });
  it("Debería responder con error 500 si el microservicio devuelve un error HTTP 500", async () => {
    jest.spyOn(Date, "now").mockReturnValue(77777);

    mockChannel.consume.mockImplementation((queue, callback) => {
      const fakeMsg = {
        properties: { correlationId: "77777" },
        // Simulamos el mensaje de error que envía el microservicio
        content: Buffer.from(JSON.stringify({ error: "HTTP 500" })),
      };
      callback(fakeMsg);
    });

    const res = await request(app).get("/api/weather?ciudad=Inexistente");

    jest.restoreAllMocks();

    // Supertest comprueba que tu Express devuelve el status correcto
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe(
      "Límite de peticiones excedido o error en la API externa.",
    );
  });
});
