/**
 * Controlador de Usuarios (Gestión de Admin)
 */

const User = require('../models/User');

/**
 * @route   GET /api/users
 * @desc    Obtener todos los usuarios
 * @access  Privado (Admin)
 */
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      cantidad: usuarios.length,
      usuarios
    });

  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/users/:id
 * @desc    Obtener usuario por ID
 * @access  Privado (Admin)
 */
exports.obtenerUsuario = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id).select('-password');

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      usuario
    });

  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/users
 * @desc    Crear nuevo usuario (por Admin)
 * @access  Privado (Admin)
 */
exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Validación
    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y contraseña son obligatorios'
      });
    }

    // Verificar si el email ya existe
    const usuarioExiste = await User.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Crear usuario
    const usuario = await User.create({
      nombre,
      email,
      password,
      rol: rol || 'usuario'
    });

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      usuario
    });

  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear usuario',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/users/:id
 * @desc    Actualizar usuario
 * @access  Privado (Admin)
 */
exports.actualizarUsuario = async (req, res) => {
  try {
    const { nombre, email, rol, activo } = req.body;

    const camposActualizar = {};
    if (nombre) camposActualizar.nombre = nombre;
    if (email) camposActualizar.email = email;
    if (rol) camposActualizar.rol = rol;
    if (typeof activo !== 'undefined') camposActualizar.activo = activo;

    const usuario = await User.findByIdAndUpdate(
      req.params.id,
      camposActualizar,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      usuario
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
};

/**
 * @route   DELETE /api/users/:id
 * @desc    Eliminar usuario
 * @access  Privado (Admin)
 */
exports.eliminarUsuario = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // No permitir eliminar al mismo admin
    if (usuario._id.toString() === req.usuario.id) {
      return res.status(400).json({
        success: false,
        message: 'No puede eliminar su propia cuenta'
      });
    }

    await usuario.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/users/agentes
 * @desc    Obtener lista de agentes
 * @access  Privado (Agente, Admin)
 */
exports.obtenerAgentes = async (req, res) => {
  try {
    const agentes = await User.find({ 
      rol: { $in: ['agente', 'admin'] },
      activo: true
    }).select('nombre email rol');

    res.status(200).json({
      success: true,
      cantidad: agentes.length,
      agentes
    });

  } catch (error) {
    console.error('Error al obtener agentes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener agentes',
      error: error.message
    });
  }
};
