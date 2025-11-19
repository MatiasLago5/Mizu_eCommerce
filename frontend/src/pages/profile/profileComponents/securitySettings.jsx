import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changeUserPassword } from '../../../apiFetchs/usersFetch';
import { useAuth } from '../../../context/AuthContext';

function SecuritySettings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setStatus({ type: 'error', message: 'Completá todos los campos para continuar.' });
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setStatus({ type: 'error', message: 'Las contraseñas nuevas no coinciden.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await changeUserPassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });
      setStatus({ type: 'success', message: 'Actualizamos tu contraseña correctamente.' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error?.message || 'No pudimos actualizar la contraseña.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="section-card">
      <h2 className="card-title">Seguridad de la Cuenta</h2>
      
      <div className="form-grid">
        <div className="form-field">
          <label className="field-label">Contraseña actual</label>
          <input 
            type="password" 
            name="current"
            value={passwords.current}
            onChange={handlePasswordChange}
            className="field-input" 
          />
        </div>

        <div className="form-field">
          <label className="field-label">Nueva contraseña</label>
          <input 
            type="password" 
            name="new"
            value={passwords.new}
            onChange={handlePasswordChange}
            className="field-input" 
          />
        </div>

        <div className="form-field">
          <label className="field-label">Confirmar contraseña</label>
          <input 
            type="password" 
            name="confirm"
            value={passwords.confirm}
            onChange={handlePasswordChange}
            className="field-input" 
          />
        </div>
      </div>

      {status && (
        <p className={`status-message ${status.type}`}>
          {status.message}
        </p>
      )}

      <button className="btn-primary" onClick={handleUpdatePassword} disabled={isSubmitting}>
        {isSubmitting ? 'Actualizando...' : 'Actualizar Contraseña'}
      </button>

      <div className="divider"></div>

      <button className="btn-logout" onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
}

export default SecuritySettings;