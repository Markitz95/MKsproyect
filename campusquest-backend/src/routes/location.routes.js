// src/routes/location.routes.js
// Rutas para gestionar las estaciones del campus (gymkhana).
// GET  /api/locations        → Todas las estaciones activas (pública)
// GET  /api/locations/:id    → Una estación por loc_id (pública)
// POST /api/locations        → Crear estación (solo admin)
// PUT  /api/locations/:id    → Actualizar estación (solo admin)

const express = require('express');
const router = express.Router();
const Location = require('../models/Location');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// ─── GET /api/locations ───────────────────────────────────────────────────────
// Devuelve todas las estaciones activas del campus.
// Esta ruta es PÚBLICA (sin token) para que el mapa cargue sin necesidad de login.
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true })
      .select('-challenge.answer') // No enviar la respuesta al cliente
      .sort({ block: 1 });

    res.json({
      success: true,
      count: locations.length,
      data: locations,
    });
  } catch (error) {
    console.error('Error obteniendo ubicaciones:', error);
    res.status(500).json({ success: false, message: 'Error al obtener las estaciones.' });
  }
});

// ─── GET /api/locations/:locId ────────────────────────────────────────────────
// Devuelve los detalles de una estación específica (SIN la respuesta del reto).
router.get('/:locId', async (req, res) => {
  try {
    const location = await Location.findOne({ loc_id: req.params.locId.toUpperCase() })
      .select('-challenge.answer');

    if (!location) {
      return res.status(404).json({ success: false, message: 'Estación no encontrada.' });
    }

    res.json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener la estación.' });
  }
});

// ─── POST /api/locations/verify ──────────────────────────────────────────────
// Verifica la respuesta de un reto y suma puntos al usuario.
// Requiere autenticación (token JWT).
// Body: { locId, answer }
router.post('/verify', protect, async (req, res) => {
  try {
    const { locId, answer } = req.body;
    const User = require('../models/User');

    if (!locId || !answer) {
      return res.status(400).json({ success: false, message: 'locId y answer son requeridos.' });
    }

    // Buscar la ubicación incluyendo la respuesta
    const location = await Location.findOne({ loc_id: locId.toUpperCase() });
    if (!location) {
      return res.status(404).json({ success: false, message: 'Estación no encontrada.' });
    }

    // Verificar que el usuario no haya completado este reto antes
    if (req.user.completedLocations.includes(locId)) {
      return res.status(400).json({
        success: false,
        message: 'Ya completaste este reto anteriormente.',
        alreadyCompleted: true,
      });
    }

    // Comparar respuesta (normalizada: sin espacios y minúsculas)
    const normalizedAnswer = answer.trim().toLowerCase();
    const correctAnswer = location.challenge.answer.trim().toLowerCase();
    const isCorrect = normalizedAnswer === correctAnswer;

    if (isCorrect) {
      // Actualizar puntos y marcar estación como completada
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { totalPoints: location.challenge.points },
        $addToSet: { completedLocations: locId },
      });

      return res.json({
        success: true,
        correct: true,
        message: `¡Correcto! Ganaste ${location.challenge.points} puntos.`,
        points: location.challenge.points,
      });
    } else {
      return res.json({
        success: true,
        correct: false,
        message: 'Respuesta incorrecta. ¡Inténtalo de nuevo!',
      });
    }

  } catch (error) {
    console.error('Error verificando respuesta:', error);
    res.status(500).json({ success: false, message: 'Error al verificar la respuesta.' });
  }
});

// ─── POST /api/locations (admin) ──────────────────────────────────────────────
// Crea una nueva estación. Solo para administradores.
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json({ success: true, data: location });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Error al crear la estación.' });
  }
});

// ─── PUT /api/locations/:locId (admin) ────────────────────────────────────────
// Actualiza una estación. Solo para administradores.
router.put('/:locId', protect, adminOnly, async (req, res) => {
  try {
    const location = await Location.findOneAndUpdate(
      { loc_id: req.params.locId.toUpperCase() },
      req.body,
      { new: true, runValidators: true }
    );

    if (!location) {
      return res.status(404).json({ success: false, message: 'Estación no encontrada.' });
    }

    res.json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar la estación.' });
  }
});

module.exports = router;
