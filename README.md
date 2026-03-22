# Backend Project Break
## Marco Aguirre y Alesandro Quirós

URL API: https://tienda-dp-contact.onrender.com

Este proyecto backend ahora funciona en modo API-only (sin vistas SSR).

## Instalación
Primero es importante tener [Node.js](https://nodejs.org/en) instalado en local, ya que el proyecto funciona con Node.js. Una vez instalado, abrir una terminal e ir al directorio donde está el proyecto.

A partir de aquí, tenemos que empezar instalando las dependencias con el siguiente comando:
```bash
npm install
```
Esto puede que tarde un poco. Una vez tengamos las dependencias instaladas, podemos empezar el servidor con este comando:
```bash
npm start
```
Si todo va bien, el servidor estará en funcionamiento.

## Técnologias usadas
Las técnologias usadas son las siguientes:
- Node.js
- Express
- MongoDB y Mongoose
- Cors
- Dotenv

## Rutas y uso
Las rutas de la API son las siguientes:

### Auth
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

### Productos (públicas)
- GET /api
- GET /api/id/:id

### Productos (requieren sesión admin)
- POST /api/create
- PUT /api/id/:id
- DELETE /api/id/:id

## Variables de entorno
Debes definir al menos:

- MONGO_URI
- ADMINUSER
- ADMINPASS
- SESSION_SECRET
- FRONTEND_URL o FRONTEND_URLS

## Frontend
El frontend React (carpeta frontend-project-end) consume esta API en:

- http://localhost:3000/api

## Despliegue con Netlify
Si el frontend está en Netlify y el backend en Render, añade el dominio del frontend al backend:

```bash
FRONTEND_URL=https://tu-sitio.netlify.app
```

O varios dominios/previews:

```bash
FRONTEND_URLS=https://tu-sitio.netlify.app,https://tu-preview.netlify.app
```

En producción la cookie de sesión se envía como `SameSite=None` y `Secure`, necesaria para el login admin entre dominios distintos.
