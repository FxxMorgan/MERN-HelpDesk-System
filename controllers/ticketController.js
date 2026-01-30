/**
 * Controlador de Tickets
 * Maneja CRUD de tickets, asignaciones, comentarios
 */

const Ticket = require('../models/Ticket');

/**
 * @route   POST /api/tickets
 * @desc    Crear nuevo ticket
 * @access  Privado (Usuario, Agente, Admin)
 */
exports.crearTicket = async (req, res) => {
  try {
    const { asunto, descripcion, prioridad } = req.body;

    // Validación
    if (!asunto || !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Asunto y descripción son obligatorios'
      });
    }

    // Crear ticket
    const ticket = await Ticket.create({
      asunto,
      descripcion,
      prioridad: prioridad || 'media',
      creador: req.usuario.id
    });

    // Poblar información del creador
    await ticket.populate('creador', 'nombre email');

    res.status(201).json({
      success: true,
      message: 'Ticket creado exitosamente',
      ticket
    });

  } catch (error) {
    console.error('Error al crear ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear ticket',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/tickets
 * @desc    Obtener tickets (según rol)
 * @access  Privado
 */
exports.obtenerTickets = async (req, res) => {
  try {
    const { estado, prioridad, asignado } = req.query;
    let tickets;

    // Construir filtros
    const filtros = {};
    if (estado) filtros.estado = estado;
    if (prioridad) filtros.prioridad = prioridad;
    if (asignado) filtros.asignado = asignado;

    // Si es usuario normal, solo ve sus tickets
    if (req.usuario.rol === 'usuario') {
      tickets = await Ticket.porUsuario(req.usuario.id);
    } 
    // Si es agente o admin, ve todos o filtrados
    else {
      tickets = await Ticket.obtenerTodos(filtros);
    }

    res.status(200).json({
      success: true,
      cantidad: tickets.length,
      tickets
    });

  } catch (error) {
    console.error('Error al obtener tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tickets',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/tickets/mis-tickets
 * @desc    Obtener tickets del usuario actual
 * @access  Privado
 */
exports.obtenerMisTickets = async (req, res) => {
  try {
    const tickets = await Ticket.porUsuario(req.usuario.id);

    res.status(200).json({
      success: true,
      cantidad: tickets.length,
      tickets
    });

  } catch (error) {
    console.error('Error al obtener mis tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tickets',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/tickets/:id
 * @desc    Obtener ticket por ID
 * @access  Privado
 */
exports.obtenerTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('creador', 'nombre email rol')
      .populate('asignado', 'nombre email rol')
      .populate('comentarios.autor', 'nombre email rol');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }

    // Verificar permisos: solo el creador, asignado, agente o admin pueden ver
    if (req.usuario.rol === 'usuario' && 
        ticket.creador._id.toString() !== req.usuario.id) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para ver este ticket'
      });
    }

    res.status(200).json({
      success: true,
      ticket
    });

  } catch (error) {
    console.error('Error al obtener ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ticket',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/tickets/:id/asignar
 * @desc    Asignar ticket a un agente
 * @access  Privado (Agente, Admin)
 */
exports.asignarTicket = async (req, res) => {
  try {
    const { agenteId } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }

    // Asignar (puede ser a sí mismo o a otro agente)
    await ticket.asignar(agenteId || req.usuario.id);

    await ticket.populate('creador asignado', 'nombre email');

    res.status(200).json({
      success: true,
      message: 'Ticket asignado exitosamente',
      ticket
    });

  } catch (error) {
    console.error('Error al asignar ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error al asignar ticket',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/tickets/:id/estado
 * @desc    Cambiar estado del ticket
 * @access  Privado (Agente, Admin)
 */
exports.cambiarEstado = async (req, res) => {
  try {
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({
        success: false,
        message: 'El estado es obligatorio'
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }

    await ticket.cambiarEstado(estado, req.usuario.id);
    await ticket.populate('creador asignado', 'nombre email');

    res.status(200).json({
      success: true,
      message: 'Estado actualizado exitosamente',
      ticket
    });

  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar estado',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/tickets/:id/comentarios
 * @desc    Agregar comentario a un ticket
 * @access  Privado (Creador del ticket o Agente asignado)
 */
exports.agregarComentario = async (req, res) => {
  try {
    const { contenido } = req.body;

    if (!contenido) {
      return res.status(400).json({
        success: false,
        message: 'El contenido del comentario es obligatorio'
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }

    // Verificar permisos: creador, asignado, agente o admin
    const esCreador = ticket.creador.toString() === req.usuario.id;
    const esAsignado = ticket.asignado && ticket.asignado.toString() === req.usuario.id;
    const esAgenteOAdmin = ['agente', 'admin'].includes(req.usuario.rol);

    if (!esCreador && !esAsignado && !esAgenteOAdmin) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para comentar en este ticket'
      });
    }

    await ticket.agregarComentario(req.usuario.id, contenido);
    await ticket.populate('comentarios.autor', 'nombre email rol');

    res.status(201).json({
      success: true,
      message: 'Comentario agregado exitosamente',
      ticket
    });

  } catch (error) {
    console.error('Error al agregar comentario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al agregar comentario',
      error: error.message
    });
  }
};

/**
 * @route   DELETE /api/tickets/:id
 * @desc    Eliminar ticket
 * @access  Privado (Solo Admin)
 */
exports.eliminarTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }

    await ticket.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Ticket eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar ticket',
      error: error.message
    });
  }
};
