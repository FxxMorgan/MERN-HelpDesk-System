/**
 * Componente Lista de Tickets
 */

const { useState, useEffect } = React;

function ListaTickets({ tipo, onVerTicket, filtroInicial = '' }) {
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({
    estado: filtroInicial,
    prioridad: ''
  });

  useEffect(() => {
    cargarTickets();
  }, [tipo, filtros]);

  const cargarTickets = async () => {
    setCargando(true);
    setError('');

    try {
      let response;
      if (tipo === 'mis-tickets') {
        response = await API.tickets.obtenerMis();
      } else {
        const filtrosLimpios = {};
        if (filtros.estado) filtrosLimpios.estado = filtros.estado;
        if (filtros.prioridad) filtrosLimpios.prioridad = filtros.prioridad;
        response = await API.tickets.obtenerTodos(filtrosLimpios);
      }

      setTickets(response.data.tickets);
    } catch (error) {
      setError('Error al cargar los tickets');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const getPrioridadClass = (prioridad) => {
    const classes = {
      baja: 'prioridad-baja',
      media: 'prioridad-media',
      alta: 'prioridad-alta'
    };
    return classes[prioridad] || '';
  };

  const getEstadoClass = (estado) => {
    const classes = {
      abierto: 'estado-abierto',
      en_progreso: 'estado-en-progreso',
      resuelto: 'estado-resuelto',
      cerrado: 'estado-cerrado'
    };
    return classes[estado] || '';
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (cargando) {
    return (
      <div className="loading">
        <i className="fas fa-spinner fa-spin"></i>
        Cargando tickets...
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
    <div className="lista-tickets">
      {tipo === 'todos' && (
        <div className="filtros">
          <select
            value={filtros.estado}
            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
            className="form-select"
          >
            <option value="">Todos los estados</option>
            <option value="abierto">Abierto</option>
            <option value="en_progreso">En Progreso</option>
            <option value="resuelto">Resuelto</option>
            <option value="cerrado">Cerrado</option>
          </select>

          <select
            value={filtros.prioridad}
            onChange={(e) => setFiltros({ ...filtros, prioridad: e.target.value })}
            className="form-select"
          >
            <option value="">Todas las prioridades</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-inbox"></i>
          <p>No hay tickets para mostrar</p>
        </div>
      ) : (
        <div className="tickets-grid">
          {tickets.map((ticket) => (
            <div 
              key={ticket._id} 
              className="ticket-card"
              onClick={() => onVerTicket(ticket._id)}
            >
              <div className="ticket-header">
                <h3>{ticket.asunto}</h3>
                <span className={`badge ${getPrioridadClass(ticket.prioridad)}`}>
                  {ticket.prioridad}
                </span>
              </div>

              <p className="ticket-descripcion">
                {ticket.descripcion.substring(0, 100)}
                {ticket.descripcion.length > 100 && '...'}
              </p>

              <div className="ticket-meta">
                <span className={`badge ${getEstadoClass(ticket.estado)}`}>
                  {ticket.estado.replace('_', ' ')}
                </span>
                <span className="ticket-fecha">
                  <i className="fas fa-clock"></i>
                  {formatearFecha(ticket.createdAt)}
                </span>
              </div>

              {ticket.asignado && (
                <div className="ticket-asignado">
                  <i className="fas fa-user"></i>
                  Asignado a: {ticket.asignado.nombre}
                </div>
              )}

              {tipo !== 'mis-tickets' && (
                <div className="ticket-creador">
                  <i className="fas fa-user-circle"></i>
                  Creado por: {ticket.creador.nombre}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

window.ListaTickets = ListaTickets;
