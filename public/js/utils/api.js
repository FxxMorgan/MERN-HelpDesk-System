/**
 * Configuración de API y Axios
 */

const API_URL = '/api';

// Configurar Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Funciones de API
const API = {
  // Autenticación
  auth: {
    registro: (datos) => api.post('/auth/registro', datos),
    login: (datos) => api.post('/auth/login', datos),
    obtenerPerfil: () => api.get('/auth/me'),
    actualizarPerfil: (datos) => api.put('/auth/actualizar-perfil', datos),
    cambiarPassword: (datos) => api.put('/auth/cambiar-password', datos)
  },

  // Tickets
  tickets: {
    crear: (datos) => api.post('/tickets', datos),
    obtenerTodos: (filtros = {}) => {
      const params = new URLSearchParams(filtros);
      return api.get(`/tickets?${params}`);
    },
    obtenerMis: () => api.get('/tickets/mis-tickets'),
    obtenerPorId: (id) => api.get(`/tickets/${id}`),
    asignar: (id, agenteId) => api.put(`/tickets/${id}/asignar`, { agenteId }),
    cambiarEstado: (id, estado) => api.put(`/tickets/${id}/estado`, { estado }),
    agregarComentario: (id, contenido) => api.post(`/tickets/${id}/comentarios`, { contenido }),
    eliminar: (id) => api.delete(`/tickets/${id}`)
  },

  // Usuarios
  usuarios: {
    obtenerTodos: () => api.get('/users'),
    obtenerPorId: (id) => api.get(`/users/${id}`),
    crear: (datos) => api.post('/users', datos),
    actualizar: (id, datos) => api.put(`/users/${id}`, datos),
    eliminar: (id) => api.delete(`/users/${id}`),
    obtenerAgentes: () => api.get('/users/agentes')
  }
};

window.API = API;
