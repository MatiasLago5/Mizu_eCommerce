import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminStyles.css';
import Dashboard from './adminComponents/dashboard';


function Admin() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si el usuario es admin
    // Decodificar el token para obtener el role
    const token = localStorage.getItem('mizu_token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Decodificar el JWT (sin verificar, solo para leer)
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      if (payload.role !== 'admin') {
        // No es admin, redirigir
        navigate('/');
        return;
      }
      
      setUserRole(payload.role);
      setIsLoading(false);
    } catch (error) {
      console.error('Error al verificar token:', error);
      navigate('/login');
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="admin-loading">
        <p>Verificando permisos...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">MIZU Admin</h2>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-item ${activeSection === 'products' ? 'active' : ''}`}
            onClick={() => setActiveSection('products')}
          >
            📦 Productos
          </button>
          <button
            className={`nav-item ${activeSection === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveSection('orders')}
          >
            🛒 Pedidos
          </button>
          <button
            className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            👥 Usuarios
          </button>
          <button
            className={`nav-item ${activeSection === 'refuges' ? 'active' : ''}`}
            onClick={() => setActiveSection('refuges')}
          >
            🏠 Refugios
          </button>
        </nav>

        <div className="sidebar-footer">
          <button 
            className="btn-back"
            onClick={() => navigate('/')}
          >
            ← Volver al sitio
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {activeSection === 'dashboard' && <Dashboard />}
        {activeSection === 'products' && <ProductsManager />}
        {activeSection === 'orders' && <OrdersManager />}
        {activeSection === 'users' && <UsersManager />}
        {activeSection === 'refuges' && <RefugesManager />}
      </main>
    </div>
  );
}

export default Admin;