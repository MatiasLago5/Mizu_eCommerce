function AddressesList({ addresses = [], isLoading = false }) {
  const hasAddresses = Array.isArray(addresses) && addresses.length > 0;

  return (
    <div className="section-card">
      <div className="card-header">
        <h2 className="card-title">Mis Direcciones</h2>
      </div>

      {isLoading && <p className="empty-state">Cargando direcciones guardadas...</p>}

      {!isLoading && !hasAddresses && (
        <p className="empty-state">
          Aún no guardaste direcciones. Pronto vas a poder administrarlas desde tu cuenta.
        </p>
      )}

      {hasAddresses && (
        <div className="addresses-list">
          {addresses.map((addr) => (
            <div key={addr.id} className="address-card">
              <div className="address-info">
                <div className="address-label">
                  {addr.label || 'Dirección'}
                  {addr.isDefault && <span className="default-badge">Principal</span>}
                </div>
                <p className="address-detail">{addr.street}</p>
                <p className="address-detail">{addr.city}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddressesList;