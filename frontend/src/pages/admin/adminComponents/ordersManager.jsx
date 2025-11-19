import { useState, useEffect } from 'react';
import { fetchAllOrders, updateOrderStatus } from '../../../apiFetchs/adminFetch';

function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  const orderStatuses = {
    'pending': { label: 'Pendiente', color: '#f59e0b' },
    'confirmed': { label: 'Confirmado', color: '#3b82f6' },
    'shipped': { label: 'Enviado', color: '#8b5cf6' },
    'delivered': { label: 'Entregado', color: '#10b981' },
    'cancelled': { label: 'Cancelado', color: '#ef4444' }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllOrders();
      setOrders(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  const getFilteredAndSortedOrders = () => {
    let filtered = orders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt);
        case 'date_asc':
          return new Date(a.created_at || a.createdAt) - new Date(b.created_at || b.createdAt);
        case 'total_desc':
          return (b.total || 0) - (a.total || 0);
        case 'total_asc':
          return (a.total || 0) - (b.total || 0);
        default:
          return 0;
      }
    });
  };

  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const confirmed = orders.filter(o => o.status === 'confirmed').length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    return { total, pending, confirmed, shipped, delivered, totalRevenue };
  };

  const stats = getOrderStats();
  const filteredOrders = getFilteredAndSortedOrders();

  if (isLoading) {
    return <div className="loading">Cargando pedidos...</div>;
  }

  return (
    <div className="orders-manager">
      <div className="section-header">
        <h1 className="section-title">Gestión de Pedidos</h1>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="orders-stats">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Total Pedidos</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pending}</h3>
          <p>Pendientes</p>
        </div>
        <div className="stat-card">
          <h3>{stats.confirmed}</h3>
          <p>Confirmados</p>
        </div>
        <div className="stat-card">
          <h3>{stats.shipped}</h3>
          <p>Enviados</p>
        </div>
        <div className="stat-card">
          <h3>{stats.delivered}</h3>
          <p>Entregados</p>
        </div>
        <div className="stat-card">
          <h3>${stats.totalRevenue.toFixed(2)}</h3>
          <p>Ingresos Totales</p>
        </div>
      </div>

      <div className="orders-filters">
        <div className="filter-group">
          <label>Filtrar por estado:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos los estados</option>
            {Object.entries(orderStatuses).map(([status, config]) => (
              <option key={status} value={status}>
                {config.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Ordenar por:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="date_desc">Fecha (más reciente)</option>
            <option value="date_asc">Fecha (más antigua)</option>
            <option value="total_desc">Total (mayor a menor)</option>
            <option value="total_asc">Total (menor a mayor)</option>
          </select>
        </div>
      </div>

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>
                  {order.User?.name || order.customer_name || 'Cliente no encontrado'}
                  <br />
                  <small>{order.User?.email || order.customer_email}</small>
                </td>
                <td>
                  {new Date(order.created_at || order.createdAt).toLocaleDateString()}
                  <br />
                  <small>{new Date(order.created_at || order.createdAt).toLocaleTimeString()}</small>
                </td>
                <td>${(order.total || 0).toFixed(2)}</td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ 
                      backgroundColor: orderStatuses[order.status]?.color || '#6b7280',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  >
                    {orderStatuses[order.status]?.label || order.status}
                  </span>
                </td>
                <td>
                  {order.items?.length || order.CartItems?.length || 0} producto(s)
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="status-select"
                  >
                    {Object.entries(orderStatuses).map(([status, config]) => (
                      <option key={status} value={status}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && !isLoading && (
        <div className="no-results">
          No se encontraron pedidos que coincidan con los filtros.
        </div>
      )}
    </div>
  );
}

export default OrdersManager;