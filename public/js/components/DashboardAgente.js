/**
 * Dashboard del Agente
 */

const { useState, useEffect } = React;

function DashboardAgente({ vista, setVista }) {
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [filtro, setFiltro] = useState('todos');

  const verTicket = (id) => {
    setSelectedTicketId(id);
    setVista('detalle');
  };

  const renderContent = () => {
    switch (vista) {
      case 'detalle':
        return <TicketDetalle ticketId={selectedTicketId} onVolver={() => setVista('tickets')} />;
      case 'tickets':
      default:
        return <ListaTickets tipo="todos" onVerTicket={verTicket} filtroInicial={filtro} />;
    }
  };

  return (
    <div className="dashboard-agente">
      <div className="dashboard-header">
        <h1>Gestión de Tickets</h1>
        <div className="dashboard-actions">
          <select 
            className="form-select"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="todos">Todos los tickets</option>
            <option value="abierto">Abiertos</option>
            <option value="en_progreso">En Progreso</option>
            <option value="resuelto">Resueltos</option>
          </select>
        </div>
      </div>

      <div className="dashboard-body">
        {renderContent()}
      </div>
    </div>
  );
}

window.DashboardAgente = DashboardAgente;
