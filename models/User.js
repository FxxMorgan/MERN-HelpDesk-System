/**
 * Modelo de Usuario
 * Roles: usuario, agente, admin
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false // No devolver password por defecto en queries
  },
  rol: {
    type: String,
    enum: ['usuario', 'agente', 'admin'],
    default: 'usuario'
  },
  activo: {
    type: Boolean,
    default: true
  },
  ultimoAcceso: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// =======================
// MIDDLEWARE PRE-SAVE
// =======================

// Hash de password antes de guardar
userSchema.pre('save', async function(next) {
  // Solo hashear si el password fue modificado o es nuevo
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// =======================
// MÉTODOS DEL MODELO
// =======================

// Comparar password ingresado con el hasheado
userSchema.methods.compararPassword = async function(passwordIngresado) {
  return await bcrypt.compare(passwordIngresado, this.password);
};

// Método para obtener datos públicos del usuario (sin password)
userSchema.methods.toJSON = function() {
  const usuario = this.toObject();
  delete usuario.password;
  return usuario;
};

// =======================
// MÉTODOS ESTÁTICOS
// =======================

// Buscar usuario por email (incluyendo password)
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email }).select('+password');
};

// =======================
// ÍNDICES
// =======================

userSchema.index({ email: 1 });
userSchema.index({ rol: 1 });

module.exports = mongoose.model('User', userSchema);
