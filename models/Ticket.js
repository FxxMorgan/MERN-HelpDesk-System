/**
 * Modelo de Ticket
 * Estados: abierto, en_progreso, resuelto, cerrado
 * Prioridades: baja, media, alta
 */

const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  asunto: {
    type: String,
    required: [true, 'El asunto es obligatorio'],
    trim: true,
    minlength: [5, 'El asunto debe tener al menos 5 caracteres'],
    maxlength: [100, 'El asunto no puede exceder 100 caracteres']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  prioridad: {
    type: String,
    enum: ['baja', 'media', 'alta'],
    default: 'media'
  },
  estado: {
    type: String,
    enum: ['abierto', 'en_progreso', 'resuelto', 'cerrado'],
    default: 'abierto'
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  asignado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  comentarios: [{
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    contenido: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'El comentario no puede exceder 500 caracteres']
    },
    fecha: {
      type: Date,
      default: Date.now
    }
  }],
  fechaCierre: {
    type: Date,
    default: null
  },
  historialEstados: [{
    estado: {
      type: String,
      required: true
    },
    cambiadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    fecha: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true // createdAt y updatedAt
});

// =======================
// MIDDLEWARE PRE-SAVE
// =======================

// Registrar cambio de estado en historial
ticketSchema.pre('save', function(next) {
  if (this.isModified('estado')) {
    // Si el estado cambió a 'cerrado', guardar fecha de cierre
    if (this.estado === 'cerrado') {
      this.fechaCierre = new Date();
    }
  }
  next();
});

// =======================
// MÉTODOS DEL MODELO
// =======================

// Agregar comentario
ticketSchema.methods.agregarComentario = function(autorId, contenido) {
  this.comentarios.push({
    autor: autorId,
    contenido: contenido,
    fecha: new Date()
  });
  return this.save();
};

// Cambiar estado
ticketSchema.methods.cambiarEstado = function(nuevoEstado, usuarioId) {
  const estadosValidos = ['abierto', 'en_progreso', 'resuelto', 'cerrado'];
  
  if (!estadosValidos.includes(nuevoEstado)) {
    throw new Error('Estado no válido');
  }

  this.estado = nuevoEstado;
  this.historialEstados.push({
    estado: nuevoEstado,
    cambiadoPor: usuarioId,
    fecha: new Date()
  });

  return this.save();
};

// Asignar ticket a un agente
ticketSchema.methods.asignar = function(agenteId) {
  this.asignado = agenteId;
  
  // Si se asigna, cambiar a "en_progreso" si está "abierto"
  if (this.estado === 'abierto') {
    this.estado = 'en_progreso';
  }

  return this.save();
};

// =======================
// MÉTODOS ESTÁTICOS
// =======================

// Obtener tickets por usuario (creador)
ticketSchema.statics.porUsuario = function(usuarioId) {
  return this.find({ creador: usuarioId })
    .populate('creador', 'nombre email')
    .populate('asignado', 'nombre email')
    .sort({ createdAt: -1 });
};

// Obtener tickets asignados a un agente
ticketSchema.statics.porAgente = function(agenteId) {
  return this.find({ asignado: agenteId })
    .populate('creador', 'nombre email')
    .populate('asignado', 'nombre email')
    .sort({ createdAt: -1 });
};

// Obtener todos los tickets (para admin/agente)
ticketSchema.statics.obtenerTodos = function(filtros = {}) {
  return this.find(filtros)
    .populate('creador', 'nombre email')
    .populate('asignado', 'nombre email')
    .populate('comentarios.autor', 'nombre email')
    .sort({ createdAt: -1 });
};

// =======================
// ÍNDICES
// =======================

ticketSchema.index({ creador: 1 });
ticketSchema.index({ asignado: 1 });
ticketSchema.index({ estado: 1 });
ticketSchema.index({ prioridad: 1 });
ticketSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Ticket', ticketSchema);
