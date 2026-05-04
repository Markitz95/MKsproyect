// src/routes/auth.routes.js
// Rutas de autenticación: registro e inicio de sesión.
// POST /api/auth/register  → Crear cuenta nueva
// POST /api/auth/login     → Iniciar sesión y obtener token JWT

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Genera un token JWT para el usuario con el ID dado.
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// ─── POST /api/auth/register ─────────────────────────────────────────────────
// Crea un nuevo usuario en la base de datos.
// Body: { username, password, name, email, studentCode? }
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, email, studentCode } = req.body;

    // Validación básica
    if (!username || !password || !name || !email) {
      return res.status(400).json({
        success: false,
        message: 'username, password, name y email son requeridos.',
      });
    }

    // Verificar si el usuario o email ya existe
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'El usuario o email ya está registrado.',
      });
    }

    // Crear el usuario (el hash de la contraseña se hace en el modelo)
    const user = await User.create({
      username,
      password,
      name,
      email,
      studentCode: studentCode || '',
    });

    // Generar token JWT
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente.',
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        totalPoints: user.totalPoints,
        completedLocations: user.completedLocations,
      },
    });

  } catch (error) {
    // Errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    console.error('Error en register:', error);
    res.status(500).json({ success: false, message: 'Error al registrar el usuario.' });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
// Verifica credenciales y devuelve un token JWT.
// Body: { username, password }
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validación básica
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son requeridos.',
      });
    }

    // Buscar el usuario incluyendo la contraseña (normalmente oculta con select: false)
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos.',
      });
    }

    // Verificar la contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos.',
      });
    }

    // Generar token JWT
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: '¡Bienvenido a CampusQuest!',
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        totalPoints: user.totalPoints,
        completedLocations: user.completedLocations,
      },
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ success: false, message: 'Error al iniciar sesión.' });
  }
});

module.exports = router;
