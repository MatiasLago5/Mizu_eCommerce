import { Link, useNavigate } from "react-router-dom";
import { LogOut, ShoppingCart, User } from "lucide-react";
import "./navbarStyles.css";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function NavBar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { count: cartCount } = useCart();
  const userInitial = (user?.name || user?.email || "")
    .charAt(0)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="container-fluid">
        <div className="navbar-content">
          <div className="navbar-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/productos" className="nav-link">
              Productos
            </Link>
            <Link to="/sobre-nosotros" className="nav-link">
              Nosotros
            </Link>
          </div>

          <Link to="/" className="navbar-brand">
            MIZU
            <span className="kanji">水</span>
          </Link>

          <div className="navbar-actions">
            <Link to="/carrito" className="nav-icon cart-icon" title="Carrito">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="profile-controls">
                <Link to="/profile" className="nav-icon profile-link" title="Mi perfil">
                  {userInitial ? (
                    <span className="profile-initial">{userInitial}</span>
                  ) : (
                    <User size={20} />
                  )}
                </Link>
                <button
                  className="nav-icon logout-button"
                  title="Cerrar sesión"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="nav-icon" title="Login">
                <User size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
