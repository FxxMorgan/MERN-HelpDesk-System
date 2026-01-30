/**
 * Componente Navbar
 */

const { useState, useEffect } = React;

function Navbar() {
  const [usuario, setUsuario] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const usuarioActual = Auth.obtenerUsuario();
    setUsuario(usuarioActual);
  }, []);

  const cerrarSesion = () => {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
      Auth.cerrarSesion();
    }
  };

  if (!usuario) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <i className="fas fa-ticket-alt"></i>
          <span>HelpDesk</span>
        </div>

        <div className="navbar-menu">
          <button 
            className="navbar-toggle"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <i className="fas fa-bars"></i>
          </button>

          <div className={`navbar-items ${menuAbierto ? 'active' : ''}`}>
            <div className="navbar-user">
              <i className="fas fa-user-circle"></i>
              <div className="user-info">
                <span className="user-name">{usuario.nombre}</span>
                <span className="user-role">{usuario.rol}</span>
              </div>
            </div>

            <button onClick={cerrarSesion} className="btn-logout">
              <i className="fas fa-sign-out-alt"></i>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

window.Navbar = Navbar;
