// src/index.js
// Punto de entrada del servidor Express para CampusQuest.
// Conecta a MongoDB Atlas y levanta la API REST.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// ─── Importar rutas ──────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth.routes');
const locationRoutes = require('./routes/location.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares globales ────────────────────────────────────────────────────

// CORS: permite peticiones desde la app React Native
app.use(cors({
  origin: '*', // En producción, limitar al dominio real
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parseo de JSON en el body de las peticiones
app.use(express.json());

// Log básico de cada petición (útil para desarrollo)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Rutas de la API ─────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/users', userRoutes);

// Ruta de salud: verifica que el servidor está corriendo
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CampusQuest API corriendo ✅',
    timestamp: new Date().toISOString(),
    dbStatus: mongoose.connection.readyState === 1 ? 'conectado' : 'desconectado',
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

// ─── Conexión a MongoDB Atlas ─────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas - Base de datos: campusquest');
    // Solo levanta el servidor si la DB conectó correctamente
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📋 Endpoints disponibles:`);
      console.log(`   POST /api/auth/register  - Registrar usuario`);
      console.log(`   POST /api/auth/login     - Iniciar sesión`);
      console.log(`   GET  /api/locations      - Obtener estaciones del campus`);
      console.log(`   GET  /api/users/me       - Perfil del usuario`);
      console.log(`   GET  /api/health         - Estado del servidor`);
    });
  })
  .catch((error) => {
    console.error('❌ Error conectando a MongoDB Atlas:', error.message);
    console.error('Verifica que tu MONGODB_URI en .env sea correcto y que tu IP esté en la whitelist de Atlas.');
    process.exit(1);
  });
