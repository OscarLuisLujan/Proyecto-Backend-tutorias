# Backend Tutorías API

Backend RESTful desarrollado con Node.js, Express y PostgreSQL.
Implementa autenticación segura con JWT, refresh tokens persistidos en base de datos, control de roles, rate limiting y cookies httpOnly.

## Características

- 🔐 Autenticación con JWT
- 🔄 Refresh Tokens almacenados y hasheados en base de datos
- 🚪 Logout con revocación real de sesión
- 👥 Sistema de Roles y Permisos
- 🛡 Rate limiting en endpoints sensibles (/login, /refresh)
- 🍪 Cookies httpOnly para mayor seguridad
- 🧾 Validaciones con Zod
- 🗄 PostgreSQL como base de datos
- ⚙ Arquitectura modular (Controllers, Models, Middlewares)

## Tecnologías

- Node.js
- Express
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt
- express-rate-limit
- Zod
- cookie-parser

## Estructura del Proyecto

src/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── config/
└── app.js

## Flujo de Autenticación

1. Usuario inicia sesión.
2. Se genera un Access Token (15 min).
3. Se genera un Refresh Token (7 días).
4. El Refresh Token se almacena hasheado en la base de datos.
5. El Access Token se renueva mediante el endpoint /refresh.
6. En logout, el Refresh Token se revoca.

## Variables de Entorno

Crear un archivo `.env` basado en:

PORT=3000
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

## Instalación

```bash
git clone https://github.com/OscarLuisLujan/Proyecto-Backend-tutorias.git
cd backend-tutorias
npm install
npm run dev
```

## Endpoints Principales

POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET /api/users (protegido por roles)

## Seguridad Implementada

- Hashing de contraseñas con bcrypt
- Refresh tokens almacenados como hash
- Protección contra fuerza bruta (rate limit)
- Cookies httpOnly
- SameSite policy
- Validaciones de entrada con Zod

## 📈 Próximas Mejoras

- Rotación automática de refresh tokens
- Detección de reuse de token
- Sistema de sesiones activas
- Deploy en producción (Render/Railway)
- Dockerización

## 👨‍💻 Autor

Desarrollado por Oscar Luis Luján Nacho
Enfoque en backend seguro y arquitectura escalable.
