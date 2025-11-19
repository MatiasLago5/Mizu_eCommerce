import { useEffect, useMemo, useState } from 'react';
import './profileStyles.css';
import PersonalInfo from './profileComponents/personalInfo';
import OrdersList from './profileComponents/ordersList';
import AddressesList from './profileComponents/adressesList';
import SecuritySettings from './profileComponents/securitySettings';
import { useAuth } from '../../context/AuthContext';
import { fetchMyOrders } from '../../apiFetchs/ordersFetch';

function Profile() {
  const [activeTab, setActiveTab] = useState('personal');
  const { user, isLoading, refreshUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  useEffect(() => {
    if (!user && !isLoading) {
      refreshUser();
    }
  }, [user, isLoading, refreshUser]);

  useEffect(() => {
    let isMounted = true;
    const loadOrders = async () => {
      if (!user) return;
      setOrdersLoading(true);
      try {
        const payload = await fetchMyOrders();
        if (!isMounted) return;
        const data = payload?.data || payload?.orders || [];
        setOrders(data);
        setOrdersError(null);
      } catch (err) {
        if (isMounted) {
          setOrdersError(err?.message || 'No pudimos cargar tus pedidos');
        }
      } finally {
        if (isMounted) {
          setOrdersLoading(false);
        }
      }
    };

    loadOrders();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const avatarInitial = (user?.name || user?.email || '?').charAt(0).toUpperCase();

  const normalizedAddresses = useMemo(() => {
    if (!user?.addresses) return [];

    if (Array.isArray(user.addresses)) {
      return user.addresses;
    }

    if (typeof user.addresses === 'string') {
      return user.addresses
        .split(/\r?\n|;|\|/)
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((street, index) => ({
          id: `addr-${index}`,
          label: index === 0 ? 'Dirección principal' : `Dirección ${index + 1}`,
          street,
          city: '',
          isDefault: index === 0,
        }));
    }

    return [];
  }, [user?.addresses]);

  if (isLoading && !user) {
    return (
      <div className="profile-container">
        <div className="profile-content">
          <div className="section-card">
            <p>Cargando tu perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-content">
          <div className="section-card">
            <p>No pudimos cargar tu información. Intentá nuevamente.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-text">{avatarInitial}</span>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user.name || 'Tu cuenta'}</h1>
            <p className="profile-email">{user.email || 'Sin email'}</p>
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

        <div className="tab-content">
          {activeTab === 'personal' && (
            <PersonalInfo userData={user} />
          )}
          {activeTab === 'orders' && (
            <>
              {ordersError && (
                <p className="status-message error">{ordersError}</p>
              )}
              <OrdersList orders={orders} isLoading={ordersLoading} />
            </>
          )}
          {activeTab === 'addresses' && (
            <AddressesList addresses={normalizedAddresses} isLoading={false} />
          )}
          {activeTab === 'security' && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}

export default Profile;