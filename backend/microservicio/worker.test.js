const {
  validarDatosPeticion,
  validarCoordenadas,
  transformarClima,
} = require("./worker");

describe("Microservicio - Validaciones Unitarias", () => {
  describe("validarDatosPeticion()", () => {
    it("Debería lanzar un error si la ciudad está vacía", () => {
      const peticion = { ciudad: "   " };
      expect(() => validarDatosPeticion(peticion)).toThrow(
        "La ciudad no puede estar vacía.",
      );
    });

    it("Debería lanzar un error si no hay ciudad ni coordenadas", () => {
      const peticion = {};
      expect(() => validarDatosPeticion(peticion)).toThrow("Petición inválida");
    });
    it("Debería lanzar un error si la ciudad no es una cadena de texto", () => {
      const peticion = { ciudad: 12345 }; // Simulamos un número en lugar de string
      expect(() => validarDatosPeticion(peticion)).toThrow(
        "La ciudad debe ser una cadena.",
      );
    });

    it("Debería lanzar un error si la ciudad tiene más de 100 caracteres", () => {
      const ciudadLarga = "A".repeat(101);
      const peticion = { ciudad: ciudadLarga };
      expect(() => validarDatosPeticion(peticion)).toThrow(
        "Nombre de ciudad demasiado largo.",
      );
    });
  });

  describe("validarCoordenadas()", () => {
    it("Debería lanzar un error si latitud es mayor de 90", () => {
      expect(() => validarCoordenadas(100, -122)).toThrow(
        "Latitud fuera de rango",
      );
    });

    it("No debería lanzar error con coordenadas válidas", () => {
      expect(() => validarCoordenadas(37.77, -122.41)).not.toThrow();
    });

    it("Debería lanzar un error si faltan las coordenadas", () => {
      expect(() => validarCoordenadas(null, undefined)).toThrow(
        "No se proporcionaron coordenadas válidas.",
      );
    });

    it("Debería lanzar un error si las coordenadas contienen letras", () => {
      expect(() => validarCoordenadas("letras", -122.41)).toThrow(
        "Latitud inválida",
      );
    });
  });

  describe("transformarClima()", () => {
    it("Debería estructurar correctamente el objeto de salida", () => {
      const fakeDatosClima = {
        current: {
          temperature_2m: 20,
          relative_humidity_2m: 50,
          wind_speed_10m: 15,
        },
        hourly: {
          time: ["10:00"],
          temperature_2m: [21],
          relative_humidity_2m: [45],
          wind_speed_10m: [10],
        },
      };

      const resultado = transformarClima(fakeDatosClima, "Londres");

      expect(resultado.ciudad).toBe("Londres");
      expect(resultado.temperatura).toBe(20);
      expect(resultado.humedad).toBe(50);
      expect(resultado.pronostico24h.horas).toEqual(["10:00"]);
    });
  });
});
