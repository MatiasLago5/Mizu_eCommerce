import { Link } from "react-router-dom";
import { Filter, Search, ShoppingCart, User } from "lucide-react";
import "./navbarStyles.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="container-fluid">
        <div className="navbar-content">
          {/* IZQUIERDA */}
          <div className="navbar-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/productos" className="nav-link">
              Productos
            </Link>
            <Link to="/categorias" className="nav-link">
              Categorías
            </Link>
            <Link to="/sobre-nosotros" className="nav-link">
              Nosotros
            </Link>
          </div>

          {/* CENTRO */}
          <Link to="/" className="navbar-brand">
            MIZU
            <span className="kanji">水</span>
          </Link>

          {/* DERECHA */}
          <div className="navbar-actions">
            <Link to="/filtro" className="nav-icon" title="Filtrar">
              <Filter size={20} />
            </Link>
            <Link to="/buscar" className="nav-icon" title="Buscar">
              <Search size={20} />
            </Link>
            <Link to="/carrito" className="nav-icon cart-icon" title="Carrito">
              <ShoppingCart size={20} />
              <span className="cart-badge">0</span>
            </Link>
            <Link to="/login" className="nav-icon" title="Login">
              <User size={20} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
