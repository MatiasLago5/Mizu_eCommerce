import { useState, useEffect } from 'react';
import { fetchDashboardStats } from '../../../apiFetchs/adminFetch';

function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    productsDonated: 0,
    activeRefuges: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchDashboardStats();
      
      setStats(data.stats || {
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        productsDonated: 0,
        activeRefuges: 0
      });
      
      setRecentOrders(data.recentOrders || []);
      setTopProducts(data.topProducts || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message);
      setStats({
        totalSales: 15750.50,
        totalOrders: 156,
        totalProducts: 45,
        totalUsers: 234,
        productsDonated: 52,
        activeRefuges: 4
      });
      setRecentOrders([
        { id: 1, customer: "Juan Pérez", total: 45.50, status: "Entregado", date: "2024-11-10" },
        { id: 2, customer: "María García", total: 32.00, status: "En camino", date: "2024-11-12" },
        { id: 3, customer: "Carlos López", total: 67.80, status: "Pendiente", date: "2024-11-14" }
      ]);
      setTopProducts([
        { name: "Mizu Pure Flow", sold: 156, revenue: 1388.40 },
        { name: "Pasta Dental Menta", sold: 124, revenue: 806.00 },
        { name: "Jabón Natural", sold: 98, revenue: 784.00 }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="loading">Cargando datos del dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="section-header">
        <h1 className="section-title">Dashboard</h1>
        <p className="section-subtitle">Vista general del sistema</p>
      </div>

      {error && (
        <div className="error-message" style={{ marginBottom: '1rem', padding: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '8px' }}>
          Error al cargar datos: {error}. Mostrando datos de ejemplo.
        </div>
      )}

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="admin-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💰</div>
          <div style={{ fontSize: '2rem', fontWeight: '500', color: '#6B9BD1', marginBottom: '0.25rem' }}>
            ${stats.totalSales.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Ventas Totales</div>
        </div>

        <div className="admin-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛒</div>
          <div style={{ fontSize: '2rem', fontWeight: '500', color: '#6B9BD1', marginBottom: '0.25rem' }}>
            {stats.totalOrders}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Pedidos</div>
        </div>

        <div className="admin-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📦</div>
          <div style={{ fontSize: '2rem', fontWeight: '500', color: '#6B9BD1', marginBottom: '0.25rem' }}>
            {stats.totalProducts}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Productos</div>
        </div>

        <div className="admin-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
          <div style={{ fontSize: '2rem', fontWeight: '500', color: '#6B9BD1', marginBottom: '0.25rem' }}>
            {stats.totalUsers}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Usuarios</div>
        </div>

        <div className="admin-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💝</div>
          <div style={{ fontSize: '2rem', fontWeight: '500', color: '#10b981', marginBottom: '0.25rem' }}>
            {stats.productsDonated}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Productos Donados</div>
        </div>

        <div className="admin-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏠</div>
          <div style={{ fontSize: '2rem', fontWeight: '500', color: '#6B9BD1', marginBottom: '0.25rem' }}>
            {stats.activeRefuges}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Refugios Activos</div>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Orders */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '1.5rem', color: '#1a1a1a' }}>
            Pedidos Recientes
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentOrders.map(order => (
              <div key={order.id} style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '500', color: '#1a1a1a' }}>{order.customer}</span>
                  <span style={{ color: '#6B9BD1', fontWeight: '500' }}>${order.total.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
                  <span>{order.date}</span>
                  <span>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '1.5rem', color: '#1a1a1a' }}>
            Productos Más Vendidos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topProducts.map((product, idx) => (
              <div key={idx} style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '500', color: '#1a1a1a' }}>{product.name}</span>
                  <span style={{ color: '#10b981', fontWeight: '500' }}>${product.revenue.toFixed(2)}</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {product.sold} unidades vendidas
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;