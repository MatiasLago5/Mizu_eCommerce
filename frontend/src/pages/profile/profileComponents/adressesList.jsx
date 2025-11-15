import { useState } from 'react';

function AddressesList() {
  // Mock addresses - reemplazar con fetch: getUserAddresses()
  const [addresses, setAddresses] = useState([
    { id: 1, label: "Casa", street: "Av. Italia 1234", city: "Montevideo", isDefault: true },
    { id: 2, label: "Trabajo", street: "Bulevar Artigas 567", city: "Montevideo", isDefault: false }
  ]);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: "", street: "", city: "" });

  const handleAddAddress = () => {
    if (newAddress.label && newAddress.street && newAddress.city) {
      // Aquí harías: addUserAddress(newAddress)
      setAddresses([...addresses, { ...newAddress, id: Date.now(), isDefault: false }]);
      setNewAddress({ label: "", street: "", city: "" });
      setShowAddressForm(false);
    }
  };

  const handleDeleteAddress = (id) => {
    // Aquí harías: deleteUserAddress(id)
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  return (
    <div className="section-card">
      <div className="card-header">
        <h2 className="card-title">Mis Direcciones</h2>
        <button 
          className="btn-add"
          onClick={() => setShowAddressForm(!showAddressForm)}
        >
          + Agregar
        </button>
      </div>

      {showAddressForm && (
        <div className="address-form">
          <input 
            type="text"
            placeholder="Etiqueta (ej: Casa, Trabajo)"
            value={newAddress.label}
            onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
            className="field-input"
          />
          <input 
            type="text"
            placeholder="Dirección"
            value={newAddress.street}
            onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
            className="field-input"
          />
          <input 
            type="text"
            placeholder="Ciudad"
            value={newAddress.city}
            onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
            className="field-input"
          />
          <div className="form-actions">
            <button className="btn-cancel" onClick={() => setShowAddressForm(false)}>
              Cancelar
            </button>
            <button className="btn-save" onClick={handleAddAddress}>
              Guardar
            </button>
          </div>
        </div>
      )}

      <div className="addresses-list">
        {addresses.map(addr => (
          <div key={addr.id} className="address-card">
            <div className="address-info">
              <div className="address-label">
                {addr.label}
                {addr.isDefault && <span className="default-badge">Principal</span>}
              </div>
              <p className="address-detail">{addr.street}</p>
              <p className="address-detail">{addr.city}</p>
            </div>
            <button 
              className="btn-delete"
              onClick={() => handleDeleteAddress(addr.id)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddressesList;