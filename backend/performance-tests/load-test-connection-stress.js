import http from "k6/http";
import { check, sleep } from "k6";

// Configuración de la prueba (Escenario)
export const options = {
  stages: [
    { duration: "30s", target: 20 }, // Carga normal
    { duration: "30s", target: 50 }, // Carga alta
    { duration: "30s", target: 100 }, // Carga extrema (buscando el punto de ruptura)
    { duration: "30s", target: 150 }, // Sobrecarga masiva
    { duration: "30s", target: 0 }, // Fase de recuperación
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
