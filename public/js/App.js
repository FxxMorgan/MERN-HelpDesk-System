/**
 * Componente Principal de la Aplicación
 */

const { useState, useEffect } = React;

function App() {
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [vistaAuth, setVistaAuth] = useState('login'); // login, registro
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión activa
    const token = Auth.obtenerToken();
    if (token) {
      setEstaAutenticado(true);
    }
    setCargando(false);
  }, []);

  const handleLogin = (usuario) => {
    setEstaAutenticado(true);
  };

  const handleRegistro = (usuario) => {
    setEstaAutenticado(true);
  };

  if (cargando) {
    return (
      <div className="app-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Cargando aplicación...</p>
      </div>
    );
  }

  if (!estaAutenticado) {
    return vistaAuth === 'login' ? (
      <Login 
        onLogin={handleLogin} 
        irARegistro={() => setVistaAuth('registro')}
      />
    ) : (
      <Registro 
        onRegistro={handleRegistro} 
        irALogin={() => setVistaAuth('login')}
      />
    );
  }

  return <Dashboard />;
}

// Renderizar la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
