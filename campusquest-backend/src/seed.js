// src/seed.js
// Script para poblar la base de datos con las estaciones del gymkhana.
// Ejecutar una sola vez: node src/seed.js
//
// ¡IMPORTANTE! Asegúrate de tener el archivo .env configurado antes de correrlo.

require('dotenv').config();
const mongoose = require('mongoose');
const Location = require('./models/Location');
const User = require('./models/User');

// ─── Datos iniciales de las estaciones del campus USC ────────────────────────
// Estas estaciones coinciden exactamente con los CHALLENGES_DB de challenge.tsx
// y los FALLBACK_LOCATIONS de explore.native.tsx

const SEED_LOCATIONS = [
  {
    loc_id: 'LOC_ENG_07',
    name: 'Facultad de Ingeniería',
    description: 'Bloque principal de la Facultad de Ingeniería de la USC.',
    block: 7,
    floor: 1,
    location: {
      type: 'Point',
      coordinates: [-76.5485, 3.4021], // [longitud, latitud]
    },
    challenge: {
      question: '¿En qué año fue fundada la Facultad de Ingeniería de la Universidad Santiago de Cali?',
      hint: 'Busca la placa conmemorativa en la entrada del bloque 7.',
      answer: '1969',
      points: 150,
    },
  },
  {
    loc_id: 'LOC_LIB_03',
    name: 'Biblioteca Santiago Cadena Copete',
    description: 'Biblioteca central del campus Pampalinda.',
    block: 3,
    floor: 3,
    location: {
      type: 'Point',
      coordinates: [-76.5490, 3.4025],
    },
    challenge: {
      question: '¿Cuántos libros tiene en su colección la Biblioteca Santiago Cadena Copete?',
      hint: 'La respuesta está en el panel informativo del piso 1.',
      answer: '80000',
      points: 100,
    },
  },
  {
    loc_id: 'LOC_LAB_04',
    name: 'Edificio de Laboratorios',
    description: 'Laboratorios de ciencias básicas e ingeniería.',
    block: 4,
    floor: 2,
    location: {
      type: 'Point',
      coordinates: [-76.5488, 3.4030],
    },
    challenge: {
      question: '¿Qué tipo de microscopio se encuentra en el Laboratorio de Biología del piso 2?',
      hint: 'El equipo está marcado con una etiqueta amarilla.',
      answer: 'electrónico',
      points: 120,
    },
  },
  {
    loc_id: 'LOC_WEL_00',
    name: 'Edificio de Bienestar',
    description: 'Centro de bienestar universitario y servicios estudiantiles.',
    block: 0,
    floor: 1,
    location: {
      type: 'Point',
      coordinates: [-76.5492, 3.4035],
    },
    challenge: {
      question: '¿Cuántas canchas deportivas tiene el campus de la Citadela Pampalinda?',
      hint: 'Observa el plano del campus en el Edificio de Bienestar.',
      answer: '4',
      points: 80,
    },
  },
  {
    loc_id: 'LOC_REC_00',
    name: 'Edificio de Juegos y Recreación',
    description: 'Área de deportes y actividades recreativas.',
    block: 0,
    floor: 1,
    location: {
      type: 'Point',
      coordinates: [-76.5495, 3.4028],
    },
    challenge: {
      question: '¿Cuál es el deporte más practicado por los estudiantes según el censo de Bienestar USC 2024?',
      hint: 'El afiche con los resultados está en el tablero de Juegos y Recreación.',
      answer: 'fútbol',
      points: 90,
    },
  },
];

// ─── Usuario administrador de prueba ────────────────────────────────────────
const SEED_ADMIN = {
  username: 'admin',
  password: 'admin123',
  name: 'Administrador CampusQuest',
  email: 'admin@usc.edu.co',
  role: 'admin',
};

const SEED_STUDENT = {
  username: 'estudiante1',
  password: 'pass123',
  name: 'Estudiante de Prueba',
  email: 'estudiante@usc.edu.co',
  studentCode: 'USC2024001',
  role: 'student',
};

// ─── Función principal del seed ───────────────────────────────────────────────
async function seed() {
  try {
    console.log('🌱 Iniciando seed de la base de datos...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    // Limpiar colecciones existentes
    await Location.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Colecciones limpiadas');

    // Insertar ubicaciones
    await Location.insertMany(SEED_LOCATIONS);
    console.log(`✅ ${SEED_LOCATIONS.length} estaciones del campus insertadas`);

    // Insertar usuarios de prueba
    await User.create(SEED_ADMIN);
    await User.create(SEED_STUDENT);
    console.log('✅ Usuarios de prueba creados:');
    console.log('   Admin   → usuario: admin     / contraseña: admin123');
    console.log('   Student → usuario: estudiante1 / contraseña: pass123');

    console.log('\n🎉 Seed completado exitosamente!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error en el seed:', error.message);
    process.exit(1);
  }
}

seed();
