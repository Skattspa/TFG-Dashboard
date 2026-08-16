import http from "k6/http";
import { check, sleep } from "k6";

// Configuración de la prueba (Escenario)
export const options = {
  stages: [
    { duration: "10s", target: 10 }, // Calentamiento rápido
    { duration: "10s", target: 80 }, // PICO: Subida violenta a 80 usuarios concurrentes
    { duration: "30s", target: 80 }, // Mantenimiento del pico
    { duration: "10s", target: 10 }, // Caída brusca
    { duration: "10s", target: 0 }, // Recuperación total
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
