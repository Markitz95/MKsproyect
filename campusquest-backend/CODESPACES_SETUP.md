# 🚀 Guía de Inicialización en GitHub Codespaces

> Usa esta guía cuando estés en la universidad y necesites levantar el proyecto
> desde cero usando **GitHub Codespaces** (sin instalar nada en el PC de la uni).

---

## ⚡ Inicio Rápido (copia y pega en orden)

### PASO 1 — Abrir el Codespace

1. Ve a 👉 https://github.com/Markitz95/MKsproyect
2. Clic en el botón verde **`<> Code`**
3. Pestaña **Codespaces**
4. Clic en **"Create codespace on main"**
5. Espera ~2 minutos a que cargue el entorno VSCode en el navegador

---

### PASO 2 — Levantar el Backend (Terminal 1)

En la terminal integrada de Codespaces, ejecuta esto **en orden**:

```bash
# 1. Entrar a la carpeta del backend
cd campusquest-backend

# 2. Instalar dependencias
npm install

# 3. Crear el archivo .env con las credenciales de MongoDB
cat > .env << 'EOF'
MONGODB_URI=mongodb://campusquest_user:Campus2026@ac-gglpynp-shard-00-00.0grcjhb.mongodb.net:27017,ac-gglpynp-shard-00-01.0grcjhb.mongodb.net:27017,ac-gglpynp-shard-00-02.0grcjhb.mongodb.net:27017/campusquest?ssl=true&replicaSet=atlas-tij6ns-shard-0&authSource=admin&appName=campusquest-cluster
JWT_SECRET=campusquest_clave_super_secreta_2024
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
EOF

# 4. Poblar la base de datos (solo si es la primera vez o está vacía)
npm run seed

# 5. Iniciar el servidor
npm run dev
```

✅ Deberías ver:
```
✅ Conectado a MongoDB Atlas - Base de datos: campusquest
🚀 Servidor corriendo en http://localhost:3000
```

---

### PASO 3 — Obtener la URL pública del backend

> En Codespaces el `localhost` no es accesible directamente desde la app.
> Debes usar la URL pública que Codespaces genera.

1. En VSCode, clic en la pestaña **"Ports"** (abajo en la barra)
2. Busca el puerto **3000**
3. Clic derecho → **"Port Visibility"** → **"Public"**
4. Copia la URL que aparece, se verá así:
   ```
   https://tu-codespace-nombre-3000.app.github.dev
   ```

---

### PASO 4 — Configurar la App para usar la URL de Codespaces

Abre una **segunda terminal** en Codespaces (`+` en la barra de terminales):

```bash
# Entrar a la app React Native
cd react-native-starter

# Crear el archivo de variables de entorno de Expo
# ⚠️ Reemplaza la URL con la que copiaste en el Paso 3
cat > .env.local << 'EOF'
EXPO_PUBLIC_API_URL=https://TU-CODESPACE-NOMBRE-3000.app.github.dev/api
EOF

# Instalar dependencias de la app (si no están instaladas)
npm install

# Iniciar Expo
npx expo start --tunnel
```

Se generará un **código QR**. Escanéalo con **Expo Go** en tu celular.

---

### PASO 5 — Verificar que todo funciona

#### Prueba el backend desde el navegador:
Abre en el navegador la URL pública + `/api/health`:
```
https://TU-CODESPACE-NOMBRE-3000.app.github.dev/api/health
```

Debes ver:
```json
{
  "success": true,
  "message": "CampusQuest API corriendo ✅",
  "dbStatus": "conectado"
}
```

#### Prueba el login en la app:
- **Usuario:** `estudiante1`
- **Contraseña:** `pass123`

---

## 📋 Comandos de referencia rápida

| Acción | Comando |
|--------|---------|
| Instalar backend | `cd campusquest-backend && npm install` |
| Crear `.env` | Ver Paso 2 arriba |
| Poblar BD | `npm run seed` |
| Iniciar servidor | `npm run dev` |
| Instalar app | `cd react-native-starter && npm install` |
| Iniciar Expo | `npx expo start --tunnel` |
| Ver logs en tiempo real | El servidor imprime cada petición |

---

## 🔑 Credenciales para el `.env` del backend

```env
MONGODB_URI=mongodb://campusquest_user:Campus2026@ac-gglpynp-shard-00-00.0grcjhb.mongodb.net:27017,ac-gglpynp-shard-00-01.0grcjhb.mongodb.net:27017,ac-gglpynp-shard-00-02.0grcjhb.mongodb.net:27017/campusquest?ssl=true&replicaSet=atlas-tij6ns-shard-0&authSource=admin&appName=campusquest-cluster
JWT_SECRET=campusquest_clave_super_secreta_2024
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

---

## 👥 Usuarios de prueba

| Rol | Usuario | Contraseña |
|-----|---------|-----------|
| Estudiante | `estudiante1` | `pass123` |
| Admin | `admin` | `admin123` |

> Si los usuarios no existen, corre `npm run seed` en la carpeta `campusquest-backend`.

---

## ⚠️ Problemas frecuentes en Codespaces

| Problema | Solución |
|----------|---------|
| `Error: Cannot find module` | Correr `npm install` en la carpeta correcta |
| Backend no conecta a MongoDB | Verificar que el `.env` fue creado (Paso 2) |
| App no llega al backend | Verificar que el puerto 3000 sea **Public** (Paso 3) |
| QR de Expo no funciona | Usar `npx expo start --tunnel` en lugar de `--lan` |
| `seed` da error de auth | La contraseña de MongoDB puede haber cambiado, revisar `CREDENTIALS.md` |
| Codespace se durmió | Volver a correr `npm run dev` en el backend |

---

## 📁 Estructura del proyecto en el repo

```
MKsproyect/
├── campusquest-backend/     ← Backend Node.js + Express
│   ├── src/
│   │   ├── index.js         → Servidor principal
│   │   ├── seed.js          → Poblar base de datos
│   │   ├── models/          → User.js, Location.js
│   │   ├── routes/          → auth, locations, users
│   │   └── middleware/      → JWT auth
│   ├── .env.example         → Template del .env
│   ├── CREDENTIALS.md       → Credenciales completas
│   └── package.json
│
├── react-native-starter/    ← App React Native (Expo)
│   ├── app/(tabs)/
│   │   ├── index.tsx        → Login
│   │   ├── explore.tsx      → Mapa del campus
│   │   └── challenge.tsx    → Retos AR
│   ├── services/
│   │   ├── api.ts           → Configuración axios
│   │   ├── auth.service.ts  → Login/registro
│   │   └── location.service.ts → Estaciones
│   └── package.json
│
├── Sesion 3/                ← Material del curso
└── README.md
```

---

## 🔗 Links útiles

| Recurso | URL |
|---------|-----|
| Repositorio | https://github.com/Markitz95/MKsproyect |
| MongoDB Atlas | https://cloud.mongodb.com |
| Expo Go (Android) | https://play.google.com/store/apps/details?id=host.exp.exponent |
| Expo Go (iOS) | https://apps.apple.com/app/expo-go/id982107779 |

---

*CampusQuest · Gymkhana USC · Citadela Pampalinda*
