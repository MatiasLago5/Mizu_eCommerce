import { useState } from 'react';

function PersonalInfo({ userData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userData });

  const handleEditToggle = () => {
    if (isEditing) {
      // Aca iría el fetch para guardar: updateUserProfile(formData)
      console.log('Guardar cambios:', formData);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="section-card">
      <div className="card-header">
        <h2 className="card-title">Información Personal</h2>
        <button className="btn-edit" onClick={handleEditToggle}>
          {isEditing ? 'Guardar' : 'Editar'}
        </button>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label className="field-label">Nombre completo</label>
          {isEditing ? (
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="field-input"
            />
          ) : (
            <p className="field-value">{formData.name}</p>
          )}
        </div>

        <div className="form-field">
          <label className="field-label">Email</label>
          {isEditing ? (
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="field-input"
            />
          ) : (
            <p className="field-value">{formData.email}</p>
          )}
        </div>

        <div className="form-field">
          <label className="field-label">Teléfono</label>
          {isEditing ? (
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="field-input"
            />
          ) : (
            <p className="field-value">{formData.phone}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;