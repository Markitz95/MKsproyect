# CampusQuest Backend API

Backend REST en **Node.js + Express + MongoDB Atlas** para la app CampusQuest (Gymkhana USC).

## Endpoints disponibles

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Registrar nuevo usuario |
| POST | `/api/auth/login` | No | Iniciar sesión (devuelve JWT) |
| GET | `/api/locations` | No | Todas las estaciones del campus |
| GET | `/api/locations/:locId` | No | Una estación específica |
| POST | `/api/locations/verify` | Sí | Verificar respuesta de un reto |
| GET | `/api/users/me` | Sí | Perfil del usuario |
| PUT | `/api/users/me` | Sí | Actualizar perfil |
| GET | `/api/users/leaderboard` | Sí | Ranking de estudiantes |
| GET | `/api/health` | No | Estado del servidor |

## Instalación y uso

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
copy .env.example .env
# → Editar .env con tu MONGODB_URI real

# 3. Poblar la base de datos (primera vez)
npm run seed

# 4. Iniciar el servidor en modo desarrollo
npm run dev
```

## Variables de entorno (.env)

```
MONGODB_URI=mongodb+srv://usuario:password@campusquest-cluster.xxx.mongodb.net/campusquest
JWT_SECRET=una_clave_secreta_larga
JWT_EXPIRES_IN=7d
PORT=3000
```
