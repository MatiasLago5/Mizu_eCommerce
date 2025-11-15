import { useState } from 'react';
import './profileStyles.css';
import PersonalInfo from './profileComponents/personalInfo';
import OrdersList from './profileComponents/ordersList';
import AddressesList from './profileComponents/adressesList';
import SecuritySettings from './profileComponents/securitySettings';

function Profile() {
  const [activeTab, setActiveTab] = useState('personal');

  // Ejemplo de usuario - reemplazar con fetch real
  const userData = {
    name: "Peteco Pérez",
    email: "peteco@mizu.com",
    phone: "099 123 456",
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-text">{userData.name.charAt(0)}</span>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{userData.name}</h1>
            <p className="profile-email">{userData.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            Información Personal
          </button>
          <button 
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Mis Pedidos
          </button>
          <button 
            className={`tab ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            Direcciones
          </button>
          <button 
            className={`tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Seguridad
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'personal' && <PersonalInfo userData={userData} />}
          {activeTab === 'orders' && <OrdersList />}
          {activeTab === 'addresses' && <AddressesList />}
          {activeTab === 'security' && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}

export default Profile;