/**
 * Componente Registro
 */

const { useState } = React;

function Registro({ onRegistro, irALogin }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar contraseñas
    if (formData.password !== formData.passwordConfirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setCargando(true);

    try {
      const response = await API.auth.registro({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password
      });

      const { token, usuario } = response.data;
      Auth.guardarSesion(token, usuario);
      onRegistro(usuario);
    } catch (error) {
      setError(error.response?.data?.message || 'Error al registrarse');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <i className="fas fa-ticket-alt"></i>
          <h1>HelpDesk</h1>
          <p>Sistema de Tickets de Soporte</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Crear Cuenta</h2>

          {error && (
            <div className="alert alert-error">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="nombre">
              <i className="fas fa-user"></i>
              Nombre Completo
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Juan Pérez"
              disabled={cargando}
              minLength={2}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
              disabled={cargando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i>
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              disabled={cargando}
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="passwordConfirm">
              <i className="fas fa-lock"></i>
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
              placeholder="••••••••"
              disabled={cargando}
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={cargando}
          >
            {cargando ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Registrando...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i>
                Crear Cuenta
              </>
            )}
          </button>

          <div className="auth-footer">
            <p>
              ¿Ya tienes cuenta?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); irALogin(); }}>
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

window.Registro = Registro;
