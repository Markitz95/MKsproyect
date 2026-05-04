// src/models/User.js
// Modelo de Usuario para MongoDB.
// Corresponde a la colección "users" en la base de datos campusquest.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  // ─── Datos de autenticación ───────────────────────────────────────────────
  username: {
    type: String,
    required: [true, 'El usuario es requerido'],
    unique: true,
    trim: true,
    minlength: [3, 'El usuario debe tener al menos 3 caracteres'],
    maxlength: [30, 'El usuario no puede tener más de 30 caracteres'],
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    // select: false hace que la contraseña NO se devuelva en las consultas por defecto
    select: false,
  },

  // ─── Datos del perfil ─────────────────────────────────────────────────────
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email no válido'],
  },
  studentCode: {
    type: String,
    trim: true,
    default: '',
  },

  // ─── Datos del gymkhana ───────────────────────────────────────────────────
  // Puntos acumulados en el rally
  totalPoints: {
    type: Number,
    default: 0,
    min: 0,
  },
  // IDs de las estaciones completadas (para no repetir)
  completedLocations: [{
    type: String,
  }],
  // Rol: 'student' (estudiante) o 'admin' (profesor/administrador)
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
}, {
  // Agrega automáticamente createdAt y updatedAt
  timestamps: true,
});

// ─── Hook: hashear contraseña antes de guardar ────────────────────────────────
// Solo encripta si la contraseña fue modificada (evita rehashear en updates)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Método: comparar contraseña ingresada con el hash ───────────────────────
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
