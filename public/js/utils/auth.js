/**
 * Utilidades de Autenticación
 */

const Auth = {
  // Guardar usuario y token
  guardarSesion: (token, usuario) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  },

  // Obtener token
  obtenerToken: () => {
    return localStorage.getItem('token');
  },

  // Obtener usuario
  obtenerUsuario: () => {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  },

  // Verificar si está autenticado
  estaAutenticado: () => {
    return !!localStorage.getItem('token');
  },

  // Cerrar sesión
  cerrarSesion: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/';
  },

  // Verificar rol
  tieneRol: (...roles) => {
    const usuario = Auth.obtenerUsuario();
    return usuario && roles.includes(usuario.rol);
  },

  // Obtener rol
  obtenerRol: () => {
    const usuario = Auth.obtenerUsuario();
    return usuario ? usuario.rol : null;
  }
};

window.Auth = Auth;
