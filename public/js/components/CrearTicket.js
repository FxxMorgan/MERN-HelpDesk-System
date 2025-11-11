/**
 * Componente Crear Ticket
 */

const { useState } = React;

function CrearTicket({ onTicketCreado }) {
  const [formData, setFormData] = useState({
    asunto: '',
    descripcion: '',
    prioridad: 'media'
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);

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
      await API.tickets.crear(formData);
      setExito(true);
      
      // Limpiar formulario
      setFormData({
        asunto: '',
        descripcion: '',
        prioridad: 'media'
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        onTicketCreado();
      }, 2000);

    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear el ticket');
    } finally {
      setCargando(false);
    }
  };

  if (exito) {
    return (
      <div className="success-message">
        <i className="fas fa-check-circle"></i>
        <h2>¡Ticket creado exitosamente!</h2>
        <p>Será redirigido a la lista de tickets...</p>
      </div>
    );
  }

  return (
    <div className="crear-ticket">
      <h2>Crear Nuevo Ticket</h2>

      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-group">
          <label htmlFor="asunto">
            <i className="fas fa-heading"></i>
            Asunto *
          </label>
          <input
            type="text"
            id="asunto"
            name="asunto"
            value={formData.asunto}
            onChange={handleChange}
            required
            placeholder="Breve descripción del problema"
            disabled={cargando}
            minLength={5}
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">
            <i className="fas fa-align-left"></i>
            Descripción *
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            placeholder="Describe el problema en detalle..."
            disabled={cargando}
            rows={6}
            minLength={10}
            maxLength={1000}
          />
        </div>

        <div className="form-group">
          <label htmlFor="prioridad">
            <i className="fas fa-exclamation-triangle"></i>
            Prioridad
          </label>
          <select
            id="prioridad"
            name="prioridad"
            value={formData.prioridad}
            onChange={handleChange}
            disabled={cargando}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={cargando}
          >
            {cargando ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Creando...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                Crear Ticket
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

window.CrearTicket = CrearTicket;
