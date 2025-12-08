# DermoScan AI 🔬

> Sistema de análisis preliminar de imágenes dermatológicas impulsado por Inteligencia Artificial y Arquitectura de Microservicios.

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📋 Descripción

**DermoScan AI** es una aplicación Full Stack diseñada para demostrar la implementación de una arquitectura moderna y escalable. Utiliza **Transfer Learning** (MobileNetV2) para clasificar lesiones cutáneas en tiempo real, orquestando la comunicación entre un frontend reactivo y servicios de backend robustos.

## 🏗️ Arquitectura del Sistema

El proyecto sigue una arquitectura de microservicios contenerizada:

*   **🧠 IA Service (Python/FastAPI):**
    *   Modelo: MobileNetV2 (TensorFlow/Keras) pre-entrenado y adaptado.
    *   API: FastAPI para inferencia de alta velocidad.
    *   Librerías: NumPy, Pillow, Python-Multipart.

*   **🛡️ API Gateway (Java/Spring Boot):**
    *   Rol: Orquestador y punto de entrada seguro.
    *   Tecnología: Spring Web, RestTemplate, Lombok.
    *   Patrón: Controller-Service-DTO.

*   **✨ UI Client (React/Vite):**
    *   Diseño: Tailwind CSS + Framer Motion para una experiencia Premium.
    *   Infraestructura: Servido mediante Nginx en producción.

## 🚀 Instalación y Despliegue

La aplicación está totalmente dockerizada para un despliegue sencillo.

### Pre-requisitos
*   Docker Desktop instalado y corriendo.
*   Git.

### Pasos
1.  Clonar el repositorio:
    ```bash
    git clone https://github.com/eduardoospino5562001/dermoscan-ai.git
    cd dermoscan-ai
    ```

2.  Ejecutar con Docker Compose:
    ```bash
    docker-compose up --build
    ```

3.  Acceder a la aplicación:
    Abrir navegador en `http://localhost:5173`

## 📂 Estructura del Proyecto

```bash
dermoscan-ai/
├── ia-service/      # Microservicio de ML (Python)
├── api-gateway/     # Backend Manager (Java Spring Boot)
├── ui-client/       # Frontend (React + Vite)
└── docker-compose.yml

---
Desarrollado por Eduardo Ospino como proyecto de arquitectura de software.