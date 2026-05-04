# 🔐 Credenciales y Estructura de Base de Datos — CampusQuest

> ⚠️ **PRIVADO** — No compartir públicamente este archivo.

---

## 🍃 MongoDB Atlas

| Campo | Valor |
|-------|-------|
| **Cluster** | `campusquest-cluster` |
| **Proyecto** | `CampusQuest` |
| **Organización** | `Marco's Org - 2026-0...` |
| **Base de datos** | `campusquest` |
| **Usuario BD** | `campusquest_user` |
| **Contraseña BD** | `Campus2026` |
| **Plan** | FREE (512 MB) |
| **Región** | AWS / N. Virginia (us-east-1) |
| **Versión** | 0.0.22 |

### Cadena de conexión (Standard — sin SRV)
```
mongodb://campusquest_user:Campus2026@ac-gglpynp-shard-00-00.0grcjhb.mongodb.net:27017,ac-gglpynp-shard-00-01.0grcjhb.mongodb.net:27017,ac-gglpynp-shard-00-02.0grcjhb.mongodb.net:27017/campusquest?ssl=true&replicaSet=atlas-tij6ns-shard-0&authSource=admin&appName=campusquest-cluster
```

### Cadena de conexión (SRV — para referencia)
```
mongodb+srv://campusquest_user:Campus2026@campusquest-cluster.0grcjhb.mongodb.net/campusquest?appName=campusquest-cluster
```

> **Nota:** Se usa la cadena Standard porque el DNS SRV no resuelve correctamente en la red local de desarrollo.

---

## 👥 Usuarios de la Aplicación (Colección `users`)

| Campo | Admin | Estudiante |
|-------|-------|-----------|
| **username** | `admin` | `estudiante1` |
| **password** | `admin123` | `pass123` |
| **name** | Administrador CampusQuest | Estudiante de Prueba |
| **email** | admin@usc.edu.co | estudiante@usc.edu.co |
| **studentCode** | — | `USC2024001` |
| **role** | `admin` | `student` |
| **totalPoints** | 0 | 0 |

> Las contraseñas están **hasheadas con bcrypt** en MongoDB — lo que se ve arriba son las contraseñas en texto plano para acceso a la app.

---

## 📍 Estaciones del Campus (Colección `locations`)

### 1. Facultad de Ingeniería
| Campo | Valor |
|-------|-------|
| **loc_id** | `LOC_ENG_07` |
| **name** | Facultad de Ingeniería |
| **block** | 7 |
| **floor** | 1 |
| **coordinates** | `[-76.5485, 3.4021]` (lng, lat) |
| **points** | 150 |
| **question** | ¿En qué año fue fundada la Facultad de Ingeniería de la USC? |
| **answer** | `1969` |
| **hint** | Busca la placa conmemorativa en la entrada del bloque 7. |

### 2. Biblioteca Santiago Cadena Copete
| Campo | Valor |
|-------|-------|
| **loc_id** | `LOC_LIB_03` |
| **name** | Biblioteca Santiago Cadena Copete |
| **block** | 3 |
| **floor** | 3 |
| **coordinates** | `[-76.5490, 3.4025]` |
| **points** | 100 |
| **question** | ¿Cuántos libros tiene en su colección la Biblioteca Santiago Cadena Copete? |
| **answer** | `80000` |
| **hint** | La respuesta está en el panel informativo del piso 1. |

### 3. Edificio de Laboratorios
| Campo | Valor |
|-------|-------|
| **loc_id** | `LOC_LAB_04` |
| **name** | Edificio de Laboratorios |
| **block** | 4 |
| **floor** | 2 |
| **coordinates** | `[-76.5488, 3.4030]` |
| **points** | 120 |
| **question** | ¿Qué tipo de microscopio se encuentra en el Laboratorio de Biología del piso 2? |
| **answer** | `electrónico` |
| **hint** | El equipo está marcado con una etiqueta amarilla. |

### 4. Edificio de Bienestar
| Campo | Valor |
|-------|-------|
| **loc_id** | `LOC_WEL_00` |
| **name** | Edificio de Bienestar |
| **block** | 0 |
| **floor** | 1 |
| **coordinates** | `[-76.5492, 3.4035]` |
| **points** | 80 |
| **question** | ¿Cuántas canchas deportivas tiene el campus de la Citadela Pampalinda? |
| **answer** | `4` |
| **hint** | Observa el plano del campus en el Edificio de Bienestar. |

### 5. Edificio de Juegos y Recreación
| Campo | Valor |
|-------|-------|
| **loc_id** | `LOC_REC_00` |
| **name** | Edificio de Juegos y Recreación |
| **block** | 0 |
| **floor** | 1 |
| **coordinates** | `[-76.5495, 3.4028]` |
| **points** | 90 |
| **question** | ¿Cuál es el deporte más practicado según el censo de Bienestar USC 2024? |
| **answer** | `fútbol` |
| **hint** | El afiche con los resultados está en el tablero de Juegos y Recreación. |

---

## 🔑 JWT (Tokens de Autenticación)

| Campo | Valor |
|-------|-------|
| **JWT_SECRET** | `campusquest_clave_super_secreta_2024` |
| **JWT_EXPIRES_IN** | `7d` (7 días) |
| **Almacenamiento en app** | `expo-secure-store` con key `campusquest_token` |

---

## 🌐 API Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|:----:|-------------|
| `POST` | `/api/auth/register` | ❌ | Registrar nuevo usuario |
| `POST` | `/api/auth/login` | ❌ | Iniciar sesión → devuelve JWT |
| `GET` | `/api/locations` | ❌ | Todas las estaciones activas |
| `GET` | `/api/locations/:locId` | ❌ | Una estación por ID |
| `POST` | `/api/locations/verify` | ✅ | Verificar respuesta de un reto |
| `GET` | `/api/users/me` | ✅ | Perfil del usuario autenticado |
| `PUT` | `/api/users/me` | ✅ | Actualizar perfil |
| `GET` | `/api/users/leaderboard` | ✅ | Ranking de estudiantes |
| `GET` | `/api/health` | ❌ | Estado del servidor |

**URL base local:** `http://localhost:3000`
**URL base emulador Android:** `http://10.0.2.2:3000`

---

## 🖥️ Servidor

| Campo | Valor |
|-------|-------|
| **Puerto** | `3000` |
| **Entorno** | `development` |
| **Comando dev** | `npm run dev` (con nodemon) |
| **Comando prod** | `npm start` |
| **Comando seed** | `npm run seed` |

---

## 📁 Colecciones en MongoDB

```
campusquest (base de datos)
├── users       → Usuarios registrados de la app
├── locations   → Estaciones del gymkhana en el campus
```

### Índices importantes
- `locations.loc_id` → único
- `locations.location` → **2dsphere** (geoespacial para búsquedas por proximidad)
- `users.username` → único
- `users.email` → único

---

## 🔗 GitHub

| Campo | Valor |
|-------|-------|
| **Repositorio** | https://github.com/Markitz95/MKsproyect |
| **Usuario** | Markitz95 |
| **Rama principal** | `main` |

---

*Generado: Mayo 2026 — CampusQuest USC · Gymkhana Citadela Pampalinda*
