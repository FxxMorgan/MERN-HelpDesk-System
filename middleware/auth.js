/**
 * Middleware de autenticación JWT
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Proteger rutas - Verificar JWT
 */
exports.proteger = async (req, res, next) => {
  let token;

  // Verificar si el token viene en el header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraer token del header
      token = req.headers.authorization.split(' ')[1];

      // Verificar y decodificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Agregar usuario al request (sin password)
      req.usuario = await User.findById(decoded.id).select('-password');

      if (!req.usuario) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      if (!req.usuario.activo) {
        return res.status(401).json({
          success: false,
          message: 'Usuario inactivo'
        });
      }

      next();
    } catch (error) {
      console.error('Error en autenticación:', error);
      return res.status(401).json({
        success: false,
        message: 'Token no válido o expirado'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado - Token no proporcionado'
    });
  }
};

/**
 * Verificar roles específicos
 * @param  {...string} roles - Roles permitidos
 */
exports.autorizarRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        message: `Rol '${req.usuario.rol}' no autorizado para acceder a este recurso`
      });
    }

    next();
  };
};

/**
 * Verificar que el usuario sea admin
 */
exports.esAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado - Se requieren permisos de administrador'
    });
  }
  next();
};

/**
 * Verificar que el usuario sea agente o admin
 */
exports.esAgenteOAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'agente' && req.usuario.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado - Se requieren permisos de agente o administrador'
    });
  }
  next();
};
