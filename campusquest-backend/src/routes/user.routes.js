// src/routes/user.routes.js
// Rutas de usuario: perfil, puntos, estaciones completadas.
// GET /api/users/me          → Perfil del usuario autenticado
// PUT /api/users/me          → Actualizar perfil
// GET /api/users/leaderboard → Ranking de todos los usuarios

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth.middleware');

// ─── GET /api/users/me ────────────────────────────────────────────────────────
// Devuelve el perfil completo del usuario autenticado.
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        studentCode: user.studentCode,
        role: user.role,
        totalPoints: user.totalPoints,
        completedLocations: user.completedLocations,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener el perfil.' });
  }
});

// ─── PUT /api/users/me ────────────────────────────────────────────────────────
// Actualiza el perfil del usuario (nombre, email, código estudiantil).
// No permite cambiar username, role ni puntos directamente.
router.put('/me', protect, async (req, res) => {
  try {
    const allowedFields = ['name', 'email', 'studentCode'];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar el perfil.' });
  }
});

// ─── GET /api/users/leaderboard ───────────────────────────────────────────────
// Top 10 estudiantes por puntos (ranking del gymkhana).
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const topUsers = await User.find({ role: 'student' })
      .select('name username totalPoints completedLocations')
      .sort({ totalPoints: -1 })
      .limit(10);

    res.json({
      success: true,
      data: topUsers.map((u, index) => ({
        rank: index + 1,
        name: u.name,
        username: u.username,
        totalPoints: u.totalPoints,
        completedCount: u.completedLocations.length,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener el ranking.' });
  }
});

module.exports = router;
