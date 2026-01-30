/**
 * Dashboard del Usuario
 */

const { useState, useEffect } = React;

function DashboardUsuario({ vista, setVista }) {
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const verTicket = (id) => {
    setSelectedTicketId(id);
    setVista('detalle');
  };

  const renderContent = () => {
    switch (vista) {
      case 'crear':
        return <CrearTicket onTicketCreado={() => setVista('tickets')} />;
      case 'detalle':
        return <TicketDetalle ticketId={selectedTicketId} onVolver={() => setVista('tickets')} />;
      case 'tickets':
      default:
        return <ListaTickets tipo="mis-tickets" onVerTicket={verTicket} />;
    }
  };

  return (
    <div className="dashboard-usuario">
      <div className="dashboard-header">
        <h1>Mis Tickets</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setVista('crear')}
        >
          <i className="fas fa-plus"></i>
          Nuevo Ticket
        </button>
      </div>

      <div className="dashboard-body">
        {renderContent()}
      </div>
    </div>
  );
}

window.DashboardUsuario = DashboardUsuario;
