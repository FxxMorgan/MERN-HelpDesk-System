/**
 * Componente Detalle de Ticket
 */

const { useState, useEffect } = React;

function TicketDetalle({ ticketId, onVolver }) {
  const [ticket, setTicket] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [comentario, setComentario] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [agentes, setAgentes] = useState([]);
  const usuarioActual = Auth.obtenerUsuario();

  useEffect(() => {
    cargarTicket();
    if (usuarioActual.rol !== 'usuario') {
      cargarAgentes();
    }
  }, [ticketId]);

  const cargarTicket = async () => {
    try {
      const response = await API.tickets.obtenerPorId(ticketId);
      setTicket(response.data.ticket);
    } catch (error) {
      setError('Error al cargar el ticket');
    } finally {
      setCargando(false);
    }
  };

  const cargarAgentes = async () => {
    try {
      const response = await API.usuarios.obtenerAgentes();
      setAgentes(response.data.agentes);
    } catch (error) {
      console.error('Error al cargar agentes:', error);
    }
  };

  const agregarComentario = async (e) => {
    e.preventDefault();
    if (!comentario.trim()) return;

    setEnviandoComentario(true);
    try {
      await API.tickets.agregarComentario(ticketId, comentario);
      setComentario('');
      await cargarTicket();
    } catch (error) {
      alert('Error al agregar comentario');
    } finally {
      setEnviandoComentario(false);
    }
  };

  const cambiarEstado = async (nuevoEstado) => {
    if (!confirm(`¿Cambiar estado a "${nuevoEstado}"?`)) return;

    try {
      await API.tickets.cambiarEstado(ticketId, nuevoEstado);
      await cargarTicket();
    } catch (error) {
      alert('Error al cambiar estado');
    }
  };

  const asignarTicket = async (agenteId) => {
    try {
      await API.tickets.asignar(ticketId, agenteId);
      await cargarTicket();
    } catch (error) {
      alert('Error al asignar ticket');
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (cargando) {
    return (
      <div className="loading">
        <i className="fas fa-spinner fa-spin"></i>
        Cargando ticket...
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="alert alert-error">
        <i className="fas fa-exclamation-circle"></i>
        {error || 'Ticket no encontrado'}
      </div>
    );
  }

  const esAgenteOAdmin = ['agente', 'admin'].includes(usuarioActual.rol);

  return (
    <div className="ticket-detalle">
      <button onClick={onVolver} className="btn-back">
        <i className="fas fa-arrow-left"></i>
        Volver
      </button>

      <div className="ticket-detalle-header">
        <div>
          <h1>{ticket.asunto}</h1>
          <div className="ticket-meta">
            <span className={`badge prioridad-${ticket.prioridad}`}>
              {ticket.prioridad}
            </span>
            <span className={`badge estado-${ticket.estado}`}>
              {ticket.estado.replace('_', ' ')}
            </span>
            <span className="fecha">
              Creado: {formatearFecha(ticket.createdAt)}
            </span>
          </div>
        </div>

        {esAgenteOAdmin && (
          <div className="ticket-acciones">
            <select
              value={ticket.estado}
              onChange={(e) => cambiarEstado(e.target.value)}
              className="form-select"
            >
              <option value="abierto">Abierto</option>
              <option value="en_progreso">En Progreso</option>
              <option value="resuelto">Resuelto</option>
              <option value="cerrado">Cerrado</option>
            </select>

            {agentes.length > 0 && (
              <select
                value={ticket.asignado?._id || ''}
                onChange={(e) => asignarTicket(e.target.value)}
                className="form-select"
              >
                <option value="">Sin asignar</option>
                {agentes.map((agente) => (
                  <option key={agente._id} value={agente._id}>
                    {agente.nombre}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      <div className="ticket-info">
        <div className="info-item">
          <i className="fas fa-user"></i>
          <div>
            <strong>Creado por:</strong>
            <span>{ticket.creador.nombre} ({ticket.creador.email})</span>
          </div>
        </div>

        {ticket.asignado && (
          <div className="info-item">
            <i className="fas fa-user-tie"></i>
            <div>
              <strong>Asignado a:</strong>
              <span>{ticket.asignado.nombre} ({ticket.asignado.email})</span>
            </div>
          </div>
        )}
      </div>

      <div className="ticket-descripcion">
        <h3>Descripción</h3>
        <p>{ticket.descripcion}</p>
      </div>

      <div className="ticket-comentarios">
        <h3>Comentarios ({ticket.comentarios.length})</h3>

        <form onSubmit={agregarComentario} className="comentario-form">
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Escribe un comentario..."
            rows={3}
            disabled={enviandoComentario}
            maxLength={500}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={enviandoComentario || !comentario.trim()}
          >
            {enviandoComentario ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Enviando...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                Comentar
              </>
            )}
          </button>
        </form>

        <div className="comentarios-lista">
          {ticket.comentarios.length === 0 ? (
            <p className="empty-state">No hay comentarios aún</p>
          ) : (
            ticket.comentarios.map((com, index) => (
              <div key={index} className="comentario">
                <div className="comentario-header">
                  <strong>{com.autor.nombre}</strong>
                  <span className="comentario-fecha">
                    {formatearFecha(com.fecha)}
                  </span>
                </div>
                <p>{com.contenido}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

window.TicketDetalle = TicketDetalle;
