# TFG: Dashboard Analítico mediante Arquitectura Distribuida y Frontend Desacoplado

**Autor:** Juan Bautista Madrigal Vergel
**Grado:** Ingeniería Informática (Universidad Alfonso X el Sabio)
**Fecha:** Agosto 2026

---

## 📌 Descripción del Proyecto

Este repositorio contiene el Producto Mínimo Viable (MVP) desarrollado para el Trabajo de Fin de Grado. El proyecto demuestra la implementación de una arquitectura de software robusta y escalable, abandonando el paradigma monolítico en favor de un sistema distribuido. 

El sistema está compuesto por un Frontend desacoplado (Single Page Application) que consume datos de forma asíncrona a través de un API Gateway. Este Gateway delega la carga de trabajo mediante un gestor de colas de mensajería hacia microservicios *stateless*, los cuales procesan la información meteorológica desde una API externa (Open-Meteo) y la devuelven al cliente.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend SPA** | Angular 20, RxJS | Interfaz de usuario interactiva y reactiva basada en *Standalone Components*. |
| **API Gateway** | Node.js, Express | Punto único de entrada, enrutamiento y proxy inverso. |
| **Microservicio** | Node.js | Trabajador *stateless* encargado de procesar la lógica de negocio y las peticiones externas. |
| **Message Broker** | RabbitMQ (Docker) | Gestor de colas para orquestar la comunicación asíncrona y dotar al sistema de resiliencia. |
| **Fuente de Datos** | Open-Meteo API | Proveedor externo de datos meteorológicos. |

---

## 📂 Estructura del Repositorio (Monorepo)

El proyecto está organizado en tres módulos principales completamente independientes:

* **`/api-gateway`**: Contiene el servidor web que recibe las peticiones HTTP del cliente y actúa como productor de mensajes.
* **`/microservicio`**: Contiene el *worker* que consume los mensajes de la cola, realiza las llamadas a la API externa y devuelve la información procesada.
* **`/frontend-dashboard`**: Contiene la aplicación web cliente construida aplicando principios Clean Code y diseño atómico.
* **`docker-compose.yml`**: Archivo de configuración para levantar la infraestructura de mensajería.

---

## 🚀 Guía de Instalación y Ejecución

Para evaluar el proyecto, es necesario arrancar los distintos componentes en el orden descrito a continuación.

### Requisitos previos
* **Docker Desktop** (con WSL 2 habilitado en Windows).
* **Node.js** (versión 18 o superior).
* **Angular CLI** instalado globalmente (`npm install -g @angular/cli`).

### Paso 1: Levantar la Infraestructura (RabbitMQ) en local con Docker
Desde la raíz del repositorio, abre una terminal y ejecuta el siguiente comando para iniciar el contenedor de RabbitMQ en segundo plano:
```bash
docker compose up -d


### Paso 2: iniciar api-gateway
cd backend/api-gateway
npm install (solo la primera vez que instalas el proyecto)
node server.js

### Paso 3 Iniciar el microservicio consumidor
cd backend/microservicio
npm install (solo la primera vez que instalas el proyecto)
node worker.js

### Paso 4: Arrancar el Frontend (Angular)
cd frontend-dashboard
npm install (solo la primera vez que instalas el proyecto)
ng serve -o