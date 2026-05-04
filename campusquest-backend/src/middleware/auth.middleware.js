// src/middleware/auth.middleware.js
// Middleware de autenticación JWT.
// Protege rutas que requieren que el usuario haya iniciado sesión.

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware que verifica el token JWT en el header Authorization.
 * Si el token es válido, agrega el usuario al objeto `req` y continúa.
 * Si no, responde con 401 Unauthorized.
 */
const protect = async (req, res, next) => {
  try {
    // 1. Extraer el token del header Authorization: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado. Se requiere token de acceso.',
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Buscar el usuario en la BD (verificar que aún existe)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado.',
      });
    }

    // 4. Adjuntar el usuario a la request para uso posterior
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Token inválido.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expirado. Inicia sesión nuevamente.' });
    }
    next(error);
  }
};

/**
 * Middleware adicional: verifica que el usuario sea admin.
 * Usar DESPUÉS de `protect`.
 */
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de administrador.',
    });
  }
  next();
};

module.exports = { protect, adminOnly };
