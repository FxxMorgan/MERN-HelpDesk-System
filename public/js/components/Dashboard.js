/**
 * Componente Dashboard Principal
 * Redirige al dashboard correspondiente según el rol
 */

const { useState, useEffect } = React;

function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [vista, setVista] = useState('tickets'); // tickets, crear, detalle, usuarios

  useEffect(() => {
    const usuarioActual = Auth.obtenerUsuario();
    setUsuario(usuarioActual);
  }, []);

  if (!usuario) {
    return <div className="loading">Cargando...</div>;
  }

  const renderDashboard = () => {
    switch (usuario.rol) {
      case 'admin':
        return <DashboardAdmin vista={vista} setVista={setVista} />;
      case 'agente':
        return <DashboardAgente vista={vista} setVista={setVista} />;
      case 'usuario':
      default:
        return <DashboardUsuario vista={vista} setVista={setVista} />;
    }
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        {renderDashboard()}
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;
