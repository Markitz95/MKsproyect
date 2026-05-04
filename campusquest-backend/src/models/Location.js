// src/models/Location.js
// Modelo de Estación/Ubicación del campus para MongoDB.
// Corresponde a la colección "locations" en la base de datos campusquest.
// Usa GeoJSON Point para las coordenadas (compatible con índices geoespaciales de MongoDB).

const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  // ─── Identificador único de la estación ──────────────────────────────────
  // Formato: LOC_ENG_07, LOC_LIB_03, etc.
  // Debe coincidir con los IDs usados en la app (CHALLENGES_DB en challenge.tsx)
  loc_id: {
    type: String,
    required: [true, 'El loc_id es requerido'],
    unique: true,
    trim: true,
    uppercase: true,
  },

  // ─── Datos descriptivos ───────────────────────────────────────────────────
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  block: {
    type: Number,
    required: [true, 'El bloque es requerido'],
    min: 0,
  },
  floor: {
    type: Number,
    default: 1,
    min: 1,
  },

  // ─── Coordenadas GeoJSON ──────────────────────────────────────────────────
  // Formato GeoJSON: coordinates = [longitud, latitud] (¡OJO: longitud primero!)
  // Esto permite usar $near y $geoWithin de MongoDB
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],  // [longitud, latitud]
      required: true,
    },
  },

  // ─── Datos del reto ───────────────────────────────────────────────────────
  challenge: {
    question: { type: String, default: '' },
    hint: { type: String, default: '' },
    answer: { type: String, default: '' },
    points: { type: Number, default: 100, min: 0 },
  },

  // ─── Estado ───────────────────────────────────────────────────────────────
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// ─── Índice geoespacial: permite búsquedas por proximidad ────────────────────
LocationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Location', LocationSchema);
