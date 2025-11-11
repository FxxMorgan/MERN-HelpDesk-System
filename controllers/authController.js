/**
 * Controlador de Autenticación
 * Maneja registro, login y gestión de sesiones
 */

const User = require('../models/User');
const { enviarTokenRespuesta } = require('../utils/jwt');

/**
 * @route   POST /api/auth/registro
 * @desc    Registrar nuevo usuario
 * @access  Público
 */
exports.registro = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validación básica
    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporcione todos los campos requeridos'
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

    // Crear usuario (el rol por defecto es 'usuario')
    const usuario = await User.create({
      nombre,
      email,
      password
    });

    // Enviar token
    enviarTokenRespuesta(usuario, 201, res, 'Usuario registrado exitosamente');

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Público
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporcione email y contraseña'
      });
    }

    // Buscar usuario por email (incluyendo password)
    const usuario = await User.findByEmail(email);

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo. Contacte al administrador.'
      });
    }

    // Verificar password
    const passwordCorrecto = await usuario.compararPassword(password);

    if (!passwordCorrecto) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Actualizar último acceso
    usuario.ultimoAcceso = new Date();
    await usuario.save();

    // Enviar token
    enviarTokenRespuesta(usuario, 200, res, 'Inicio de sesión exitoso');

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Obtener usuario actual
 * @access  Privado
 */
exports.obtenerUsuarioActual = async (req, res) => {
  try {
    const usuario = await User.findById(req.usuario.id);

    res.status(200).json({
      success: true,
      usuario
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener información del usuario',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/auth/actualizar-perfil
 * @desc    Actualizar perfil del usuario
 * @access  Privado
 */
exports.actualizarPerfil = async (req, res) => {
  try {
    const { nombre, email } = req.body;

    const camposActualizar = {};
    if (nombre) camposActualizar.nombre = nombre;
    if (email) camposActualizar.email = email;

    const usuario = await User.findByIdAndUpdate(
      req.usuario.id,
      camposActualizar,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Perfil actualizado correctamente',
      usuario
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar perfil',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/auth/cambiar-password
 * @desc    Cambiar contraseña
 * @access  Privado
 */
exports.cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNuevo } = req.body;

    if (!passwordActual || !passwordNuevo) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporcione la contraseña actual y la nueva'
      });
    }

    // Obtener usuario con password
    const usuario = await User.findById(req.usuario.id).select('+password');

    // Verificar password actual
    const passwordCorrecto = await usuario.compararPassword(passwordActual);
    if (!passwordCorrecto) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    // Actualizar password
    usuario.password = passwordNuevo;
    await usuario.save();

    enviarTokenRespuesta(usuario, 200, res, 'Contraseña actualizada exitosamente');

  } catch (error) {
    console.error('Error al cambiar password:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar contraseña',
      error: error.message
    });
  }
};
