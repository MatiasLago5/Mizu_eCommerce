import { useState, useEffect } from 'react';
import { fetchAllUsers, updateUserRole, deleteUser } from '../../../apiFetchs/adminFetch';

function UsersManager() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await deleteUser(userId);
        await loadUsers();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getUserStats = () => {
    const total = users.length;
    const admins = users.filter(u => u.role === 'admin').length;
    const regularUsers = users.filter(u => u.role === 'usuario').length;
    return { total, admins, regularUsers };
  };

  const stats = getUserStats();

  if (isLoading) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  return (
    <div className="users-manager">
      <div className="section-header">
        <h1 className="section-title">Gestión de Usuarios</h1>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="users-stats">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Total Usuarios</p>
        </div>
        <div className="stat-card">
          <h3>{stats.regularUsers}</h3>
          <p>Usuarios Regulares</p>
        </div>
        <div className="stat-card">
          <h3>{stats.admins}</h3>
          <p>Administradores</p>
        </div>
      </div>

      <div className="users-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos los roles</option>
            <option value="usuario">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Fecha de Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className={`role-select ${user.role}`}
                  >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  {new Date(user.createdAt || user.created_at).toLocaleDateString()}
                </td>
                <td>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={user.role === 'admin' && stats.admins === 1}
                    title={user.role === 'admin' && stats.admins === 1 ? 'No se puede eliminar el último admin' : ''}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && !isLoading && (
        <div className="no-results">
          No se encontraron usuarios que coincidan con los filtros.
        </div>
      )}
    </div>
  );
}

export default UsersManager;