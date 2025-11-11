/**
 * Dashboard del Administrador
 */

const { useState } = React;

function DashboardAdmin({ vista, setVista }) {
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [seccionActual, setSeccionActual] = useState('tickets'); // tickets, usuarios

  const verTicket = (id) => {
    setSelectedTicketId(id);
    setVista('detalle');
  };

  const renderContent = () => {
    if (seccionActual === 'usuarios') {
      return <GestionUsuarios />;
    }

    switch (vista) {
      case 'detalle':
        return <TicketDetalle ticketId={selectedTicketId} onVolver={() => setVista('tickets')} />;
      case 'tickets':
      default:
        return <ListaTickets tipo="todos" onVerTicket={verTicket} />;
    }
  };

  return (
    <div className="dashboard-admin">
      <div className="dashboard-sidebar">
        <button 
          className={`sidebar-item ${seccionActual === 'tickets' ? 'active' : ''}`}
          onClick={() => { setSeccionActual('tickets'); setVista('tickets'); }}
        >
          <i className="fas fa-ticket-alt"></i>
          Tickets
        </button>
        <button 
          className={`sidebar-item ${seccionActual === 'usuarios' ? 'active' : ''}`}
          onClick={() => setSeccionActual('usuarios')}
        >
          <i className="fas fa-users"></i>
          Usuarios
        </button>
      </div>

      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1>
            {seccionActual === 'tickets' ? 'Gestión de Tickets' : 'Gestión de Usuarios'}
          </h1>
        </div>

        <div className="dashboard-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

window.DashboardAdmin = DashboardAdmin;
