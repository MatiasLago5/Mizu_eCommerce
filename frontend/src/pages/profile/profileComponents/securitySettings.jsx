import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthToken } from '../../../apiFetchs/usersFetch';

function SecuritySettings() {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleUpdatePassword = () => {
    if (passwords.new !== passwords.confirm) {
      alert('Las contraseñas no coinciden');
      return;
    }
    // Aquí harías: updatePassword(passwords.current, passwords.new)
    console.log('Actualizar contraseña');
  };

  const handleLogout = () => {
    clearAuthToken();
    navigate('/login');
  };

  return (
    <div className="section-card">
      <h2 className="card-title">Cambiar Contraseña</h2>
      
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

      <button className="btn-primary" onClick={handleUpdatePassword}>
        Actualizar Contraseña
      </button>

      <div className="divider"></div>

      <button className="btn-logout" onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
}

export default SecuritySettings;