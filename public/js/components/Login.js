/**
 * Componente Login
 */

const { useState } = React;

function Login({ onLogin, irARegistro }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    setCargando(true);

    try {
      const response = await API.auth.login(formData);
      const { token, usuario } = response.data;
      
      Auth.guardarSesion(token, usuario);
      onLogin(usuario);
    } catch (error) {
      setError(error.response?.data?.message || 'Error al iniciar sesión');
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
          <h2>Iniciar Sesión</h2>

          {error && (
            <div className="alert alert-error">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

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
                Iniciando sesión...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Iniciar Sesión
              </>
            )}
          </button>

          <div className="auth-footer">
            <p>
              ¿No tienes cuenta?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); irARegistro(); }}>
                Regístrate aquí
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

window.Login = Login;
