# TFG: Dashboard Analítico mediante Arquitectura Distribuida y Frontend Desacoplado

**Autor:** Juan Bautista Madrigal Vergel
**Grado:** Ingeniería Informática (Universidad Alfonso X el Sabio)
**Fecha:** Agosto 2026

---

## 📌 Descripción del Proyecto

Este repositorio contiene el Producto Mínimo Viable (MVP) desarrollado para el Trabajo de Fin de Grado. El proyecto demuestra la implementación de una arquitectura de software robusta y escalable, abandonando el paradigma monolítico en favor de un sistema distribuido.

El sistema está compuesto por un Frontend desacoplado (Single Page Application) que consume datos de forma asíncrona a través de un API Gateway. Este Gateway delega la carga de trabajo mediante un gestor de colas de mensajería hacia microservicios _stateless_, los cuales procesan la información meteorológica desde una API externa (Open-Meteo) y la devuelven al cliente.

---

## 🛠️ Stack Tecnológico

| Componente          | Tecnología             | Propósito                                                                                    |
| :------------------ | :--------------------- | :------------------------------------------------------------------------------------------- |
| **Frontend SPA**    | Angular 20, RxJS       | Interfaz de usuario interactiva y reactiva basada en _Standalone Components_.                |
| **API Gateway**     | Node.js, Express       | Punto único de entrada, enrutamiento y proxy inverso.                                        |
| **Microservicio**   | Node.js                | Trabajador _stateless_ encargado de procesar la lógica de negocio y las peticiones externas. |
| **Message Broker**  | RabbitMQ               | Gestor de colas para orquestar la comunicación asíncrona y dotar al sistema de resiliencia.  |
| **Contenedores**    | Docker, Docker Compose | Orquestación, aislamiento y empaquetado de toda la infraestructura Backend.                  |
| **Fuente de Datos** | Open-Meteo API         | Proveedor externo de datos meteorológicos.                                                   |

---

## 📂 Estructura del Repositorio (Monorepo)

El proyecto está organizado en módulos principales completamente independientes:

- **`/backend/api-gateway`**: Contiene el servidor web que recibe las peticiones HTTP del cliente y actúa como productor de mensajes.
- **`/backend/microservicio`**: Contiene el _worker_ que consume los mensajes de la cola, realiza las llamadas a la API externa y devuelve la información procesada.
- **`/frontend-dashboard`**: Contiene la aplicación web cliente construida aplicando principios Clean Code y diseño atómico.
- **`docker-compose.yml`**: Archivo de orquestación para construir y levantar toda la infraestructura del Backend (RabbitMQ, Gateway y Microservicio) de forma unificada.

---

## 🚀 Guía de Instalación y Ejecución

Para evaluar el proyecto, es necesario arrancar los componentes siguiendo estos pasos. Al estar el backend completamente contenerizado, su ejecución automatizada requiere un solo comando.

### Requisitos previos

- **Docker Desktop** (con WSL 2 habilitado en Windows) en ejecución.
- **Node.js** (versión 18 o superior).
- **Angular CLI** instalado globalmente (`npm install -g @angular/cli`).

### Paso 1: Levantar la Infraestructura Backend (Docker)

Es necesario comprobar primero que el programa de Docker en local, o en la instancia necesaria esté ejecutandose.
Desde la raíz del repositorio, abre una terminal y ejecuta el siguiente comando. Esto construirá las imágenes del API Gateway y el Microservicio, y levantará toda la orquestación junto con RabbitMQ en segundo plano:

1. Para la primera instalacion

```bash
docker compose up -d --build
```

2. Para levantarlo si no se han hecho modificaciones en backend

```bash
   docker compose up -d
```

### Paso 2: Arrancar el Frontend (Angular)

cd frontend-dashboard
npm install (solo es necesario la primera vez que instalas el proyecto)
ng serve -o

### Para apagar todo el sistema de forma segura y liberar los puertos

en cada terminal, cancelar el proceso en ejecucion con crtl+c
apagar contenedores de backend ejecutando:

```bash
docker compose down
```

### FAQ Troubleshooting

1. Revisar logs para saber si se han levantado todos correctamente.
   docker compose logs -f rabbitmq worker-microservicio api-gateway
2. Si hay alguno que falle, reiniciar con este comando (terminado en el nombre del microservicio caido)
   docker compose restart worker-microservicio

### Unit testing: Jest

Los test están creados y configurados en github actions. En cada git push se ejecutan automaticamente.

#### e2e testing

Para ejecutarlos debe esta compilado primero tenemos que compilar el proyecto del directorio frontend-dashboard:

```bash
ng serve
docker compose up -d
```

ejecutar comando para ejecutar test e2e en el directorio frontend-dashboard:

```bash
npx cypress open
```

#### Pruebas de rendimiento y carga

1. Generar reporte de pruebas de cada propuesta de rendimiento

```bash
   K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=reporte-carga.html k6 run load-test-connection.js
```

```bash
   K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=reporte-pico.html k6 run load-test-connection-queue.js
```

```bash
   K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=reporte-estres.html k6 run load-test-connection-stress.js
```
