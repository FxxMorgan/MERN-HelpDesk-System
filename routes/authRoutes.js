/**
 * Rutas de Autenticación
 */

const express = require('express');
const router = express.Router();
const { 
  registro, 
  login, 
  obtenerUsuarioActual,
  actualizarPerfil,
  cambiarPassword
} = require('../controllers/authController');
const { proteger } = require('../middleware/auth');

// Rutas públicas
router.post('/registro', registro);
router.post('/login', login);

// Rutas protegidas
router.get('/me', proteger, obtenerUsuarioActual);
router.put('/actualizar-perfil', proteger, actualizarPerfil);
router.put('/cambiar-password', proteger, cambiarPassword);

module.exports = router;
