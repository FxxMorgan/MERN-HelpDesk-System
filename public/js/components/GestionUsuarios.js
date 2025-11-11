/**
 * Componente Gestión de Usuarios (Solo Admin)
 */

const { useState, useEffect } = React;

function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'usuario'
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setCargando(true);
    try {
      const response = await API.usuarios.obtenerTodos();
      setUsuarios(response.data.usuarios);
    } catch (error) {
      setError('Error al cargar usuarios');
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.usuarios.crear(formData);
      setMostrarForm(false);
      setFormData({ nombre: '', email: '', password: '', rol: 'usuario' });
      await cargarUsuarios();
      alert('Usuario creado exitosamente');
    } catch (error) {
      alert(error.response?.data?.message || 'Error al crear usuario');
    }
  };

  const cambiarRol = async (usuarioId, nuevoRol) => {
    if (!confirm(`¿Cambiar rol de este usuario a "${nuevoRol}"?`)) return;

    try {
      await API.usuarios.actualizar(usuarioId, { rol: nuevoRol });
      await cargarUsuarios();
    } catch (error) {
      alert('Error al cambiar rol');
    }
  };

  const toggleActivo = async (usuarioId, activoActual) => {
    if (!confirm(`¿${activoActual ? 'Desactivar' : 'Activar'} este usuario?`)) return;

    try {
      await API.usuarios.actualizar(usuarioId, { activo: !activoActual });
      await cargarUsuarios();
    } catch (error) {
      alert('Error al actualizar usuario');
    }
  };

  const eliminarUsuario = async (usuarioId) => {
    if (!confirm('¿Está seguro de eliminar este usuario? Esta acción no se puede deshacer.')) return;

    try {
      await API.usuarios.eliminar(usuarioId);
      await cargarUsuarios();
      alert('Usuario eliminado exitosamente');
    } catch (error) {
      alert(error.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  if (cargando) {
    return (
      <div className="loading">
        <i className="fas fa-spinner fa-spin"></i>
        Cargando usuarios...
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <i className="fas fa-exclamation-circle"></i>
        {error}
      </div>
    );
  }

  return (
    <div className="gestion-usuarios">
      <div className="gestion-header">
        <h2>Gestión de Usuarios</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setMostrarForm(!mostrarForm)}
        >
          <i className="fas fa-plus"></i>
          {mostrarForm ? 'Cancelar' : 'Nuevo Usuario'}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleSubmit} className="usuario-form">
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              minLength={2}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>Rol</label>
            <select
              value={formData.rol}
              onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
            >
              <option value="usuario">Usuario</option>
              <option value="agente">Agente</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            <i className="fas fa-save"></i>
            Crear Usuario
          </button>
        </form>
      )}

      <div className="usuarios-tabla">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario._id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>
                  <select
                    value={usuario.rol}
                    onChange={(e) => cambiarRol(usuario._id, e.target.value)}
                    className="form-select-sm"
                  >
                    <option value="usuario">Usuario</option>
                    <option value="agente">Agente</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => toggleActivo(usuario._id, usuario.activo)}
                    className={`btn-status ${usuario.activo ? 'activo' : 'inactivo'}`}
                  >
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td>
                  {new Date(usuario.createdAt).toLocaleDateString('es-ES')}
                </td>
                <td>
                  <button
                    onClick={() => eliminarUsuario(usuario._id)}
                    className="btn-eliminar"
                    title="Eliminar usuario"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

window.GestionUsuarios = GestionUsuarios;
