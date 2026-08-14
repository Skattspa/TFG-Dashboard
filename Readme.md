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
| **Message Broker** | RabbitMQ | Gestor de colas para orquestar la comunicación asíncrona y dotar al sistema de resiliencia. |
| **Contenedores** | Docker, Docker Compose | Orquestación, aislamiento y empaquetado de toda la infraestructura Backend. |
| **Fuente de Datos** | Open-Meteo API | Proveedor externo de datos meteorológicos. |

---

## 📂 Estructura del Repositorio (Monorepo)

El proyecto está organizado en módulos principales completamente independientes:

* **`/backend/api-gateway`**: Contiene el servidor web que recibe las peticiones HTTP del cliente y actúa como productor de mensajes.
* **`/backend/microservicio`**: Contiene el *worker* que consume los mensajes de la cola, realiza las llamadas a la API externa y devuelve la información procesada.
* **`/frontend-dashboard`**: Contiene la aplicación web cliente construida aplicando principios Clean Code y diseño atómico.
* **`docker-compose.yml`**: Archivo de orquestación para construir y levantar toda la infraestructura del Backend (RabbitMQ, Gateway y Microservicio) de forma unificada.

---

## 🚀 Guía de Instalación y Ejecución

Para evaluar el proyecto, es necesario arrancar los componentes siguiendo estos pasos. Al estar el backend completamente contenerizado, su ejecución automatizada requiere un solo comando.

### Requisitos previos
* **Docker Desktop** (con WSL 2 habilitado en Windows) en ejecución.
* **Node.js** (versión 18 o superior).
* **Angular CLI** instalado globalmente (`npm install -g @angular/cli`).

### Paso 1: Levantar la Infraestructura Backend (Docker)
Desde la raíz del repositorio, abre una terminal y ejecuta el siguiente comando. Esto construirá las imágenes del API Gateway y el Microservicio, y levantará toda la orquestación junto con RabbitMQ en segundo plano:
```bash
docker compose up -d --build
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