/**
 * Utilidad para generar JWT
 */

const jwt = require('jsonwebtoken');

/**
 * Generar JWT token
 * @param {string} id - ID del usuario
 * @returns {string} - Token JWT
 */
const generarToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

/**
 * Enviar token en respuesta
 * @param {Object} usuario - Objeto de usuario
 * @param {number} statusCode - Código de estado HTTP
 * @param {Object} res - Objeto de respuesta Express
 */
const enviarTokenRespuesta = (usuario, statusCode, res, mensaje = 'Autenticación exitosa') => {
  // Generar token
  const token = generarToken(usuario._id);

  // Respuesta
  res.status(statusCode).json({
    success: true,
    message: mensaje,
    token,
    usuario: {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    }
  });
};

module.exports = {
  generarToken,
  enviarTokenRespuesta
};
