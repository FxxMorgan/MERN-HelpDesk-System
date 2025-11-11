/**
 * Rutas de Tickets
 */

const express = require('express');
const router = express.Router();
const {
  crearTicket,
  obtenerTickets,
  obtenerMisTickets,
  obtenerTicket,
  asignarTicket,
  cambiarEstado,
  agregarComentario,
  eliminarTicket
} = require('../controllers/ticketController');
const { proteger, esAgenteOAdmin, esAdmin } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(proteger);

// Rutas generales
router.route('/')
  .get(obtenerTickets)      // GET /api/tickets - Obtener tickets (filtrados por rol)
  .post(crearTicket);       // POST /api/tickets - Crear ticket

// Mis tickets
router.get('/mis-tickets', obtenerMisTickets);

// Rutas específicas por ID
router.route('/:id')
  .get(obtenerTicket)                      // GET /api/tickets/:id - Ver ticket
  .delete(esAdmin, eliminarTicket);        // DELETE /api/tickets/:id - Eliminar (solo admin)

// Asignar ticket (solo agentes y admins)
router.put('/:id/asignar', esAgenteOAdmin, asignarTicket);

// Cambiar estado (solo agentes y admins)
router.put('/:id/estado', esAgenteOAdmin, cambiarEstado);

// Agregar comentario
router.post('/:id/comentarios', agregarComentario);

module.exports = router;
