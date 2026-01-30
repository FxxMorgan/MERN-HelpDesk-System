/**
 * HelpDesk System - Servidor Principal
 * Sistema de gestión de tickets con roles de usuario
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const userRoutes = require('./routes/userRoutes');

// Inicializar app
const app = express();

// =======================
// MIDDLEWARE DE SEGURIDAD
// =======================

// Helmet: Protección de headers HTTP con CSP configurado para CDN
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Necesario para Babel inline transforms
        "'unsafe-eval'", // Necesario para Babel
        "https://unpkg.com",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdnjs.cloudflare.com"
      ],
      fontSrc: [
        "'self'",
        "https://cdnjs.cloudflare.com"
      ],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

// CORS: Configuración de dominios permitidos
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5000',
  credentials: true
}));

// Rate Limiting: Prevenir ataques de fuerza bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 peticiones por IP
  message: 'Demasiadas peticiones desde esta IP, intente de nuevo más tarde.'
});
app.use('/api/', limiter);

// =======================
// MIDDLEWARE DE PARSEO
// =======================

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =======================
// SERVIR ARCHIVOS ESTÁTICOS
// =======================

app.use(express.static(path.join(__dirname, 'public')));

// =======================
// RUTAS DE LA API
// =======================

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'HelpDesk API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// =======================
// RUTA PRINCIPAL (SPA)
// =======================

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// =======================
// MANEJO DE ERRORES
// =======================

// Middleware para errores 404
app.use((req, res, next) => {
  res.status(404).json({ 
    success: false, 
    message: 'Ruta no encontrada' 
  });
});

// Middleware para errores generales
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// =======================
// CONEXIÓN A MONGODB
// =======================

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log(' Conectado a MongoDB Atlas');
  
  // Iniciar servidor
  app.listen(PORT, () => {
    console.log(` Servidor corriendo en puerto ${PORT}`);
    console.log(` API disponible en: http://localhost:${PORT}/api`);
    console.log(` Frontend en: http://localhost:${PORT}`);
  });
})
.catch((error) => {
  console.error(' Error al conectar a MongoDB:', error.message);
  process.exit(1);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error(' Error no manejado:', err);
  process.exit(1);
});
