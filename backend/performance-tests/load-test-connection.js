import http from "k6/http";
import { check, sleep } from "k6";

// Configuración de la prueba (Escenario)
export const options = {
  stages: [
    { duration: "10s", target: 20 }, // Rampa de subida
    { duration: "30s", target: 20 }, // Carga mantenida
    { duration: "10s", target: 0 }, // Rampa de bajada
  ],
};

export default function () {
  const url = "http://localhost:3000/api/weather?city=Madrid";

  const res = http.get(url);

  check(res, {
    "el estado HTTP es 200 (OK)": (r) => r.status === 200,
    "el tiempo de respuesta es < 500ms": (r) => r.timings.duration < 500,
  });

  if (res.status !== 200) {
    console.error(
      `❌ [ERROR] Estado HTTP: ${res.status} | Cuerpo de la respuesta: ${res.body}`,
    );
  }

  sleep(1);
}
