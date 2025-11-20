import { useState, useEffect, useCallback } from 'react';
import { fetchRefuges, createRefuge, updateRefuge, deleteRefuge } from '../../../apiFetchs/adminFetch';

function RefugesManager() {
  const [refuges, setRefuges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRefuge, setEditingRefuge] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contactEmail: '',
    phone: '',
    description: '',
    capacity: '',
    needs: ''
  });

  useEffect(() => {
    loadRefuges();
  }, [loadRefuges]);

  const loadRefuges = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchRefuges();
      setRefuges(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading refuges:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRefuge) {
        await updateRefuge(editingRefuge.id, formData);
      } else {
        await createRefuge(formData);
      }
      await loadRefuges();
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (refuge) => {
    setEditingRefuge(refuge);
    setFormData({
      name: refuge.name || '',
      location: refuge.location || '',
      contactEmail: refuge.contactEmail || '',
      phone: refuge.phone || '',
      description: refuge.description || '',
      capacity: refuge.capacity || '',
      needs: refuge.needs || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (refugeId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este refugio?')) {
      try {
        await deleteRefuge(refugeId);
        await loadRefuges();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingRefuge(null);
    setFormData({
      name: '',
      location: '',
      contactEmail: '',
      phone: '',
      description: '',
      capacity: '',
      needs: ''
    });
  }, []);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    if (!showModal) return undefined;

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        handleCloseModal();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showModal, handleCloseModal]);

  if (isLoading) {
    return <div className="loading">Cargando refugios...</div>;
  }

  return (
    <div className="refuges-manager">
      <div className="section-header">
        <h1 className="section-title">Gestión de Refugios</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Nuevo Refugio
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="refuges-grid">
        {refuges.length === 0 ? (
          <p>No hay refugios registrados</p>
        ) : (
          refuges.map(refuge => (
            <div key={refuge.id} className="admin-card">
              <h3>{refuge.name}</h3>
              <p><strong>Ubicación:</strong> {refuge.location}</p>
              <p><strong>Email:</strong> {refuge.contactEmail}</p>
              <p><strong>Teléfono:</strong> {refuge.phone}</p>
              <p><strong>Capacidad:</strong> {refuge.capacity}</p>
              <p><strong>Descripción:</strong> {refuge.description}</p>
              <div className="card-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleEdit(refuge)}
                >
                  Editar
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDelete(refuge.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onMouseDown={handleOverlayClick}>
          <div
            className="modal-content"
            role="dialog"
            aria-modal="true"
            aria-label={editingRefuge ? 'Editar refugio' : 'Crear refugio'}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{editingRefuge ? 'Editar Refugio' : 'Nuevo Refugio'}</h2>
              <button 
                className="close-btn"
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Ubicación *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email de Contacto *</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Capacidad</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Necesidades</label>
                <textarea
                  value={formData.needs}
                  onChange={(e) => setFormData({...formData, needs: e.target.value})}
                  placeholder="Ej: Alimento para perros, mantas, medicamentos..."
                  rows="2"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingRefuge ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RefugesManager;