/**
 * Rutas de Usuarios (Gestión de Admin)
 */

const express = require('express');
const router = express.Router();
const {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerAgentes
} = require('../controllers/userController');
const { proteger, esAdmin, esAgenteOAdmin } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(proteger);

// Obtener lista de agentes (para asignación)
router.get('/agentes', esAgenteOAdmin, obtenerAgentes);

// Rutas CRUD de usuarios (solo admin)
router.route('/')
  .get(esAdmin, obtenerUsuarios)
  .post(esAdmin, crearUsuario);

router.route('/:id')
  .get(esAdmin, obtenerUsuario)
  .put(esAdmin, actualizarUsuario)
  .delete(esAdmin, eliminarUsuario);

module.exports = router;
