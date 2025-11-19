function PersonalInfo({ userData }) {
  return (
    <div className="section-card">
      <div className="card-header">
        <h2 className="card-title">Información Personal</h2>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label className="field-label">Nombre completo</label>
          <p className="field-value">{userData?.name || 'Sin nombre registrado'}</p>
        </div>

        <div className="form-field">
          <label className="field-label">Email</label>
          <p className="field-value">{userData?.email || 'Sin email registrado'}</p>
        </div>

        <div className="form-field">
          <label className="field-label">Teléfono</label>
          <p className="field-value">{userData?.phone || 'Completa tu teléfono desde soporte'}</p>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;