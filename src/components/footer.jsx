import { Link } from "react-router-dom";
import "./footerStyles.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* COLUMNA 1: MIZU */}
        <div className="footer-column footer-brand-section">
          <h3>MIZU</h3>
          <p className="footer-tagline">Cuidado que se multiplica</p>
        </div>

        {/* COLUMNA 2: TIENDA */}
        <div className="footer-column">
          <h2>Tienda</h2>
          <ul className="footer-links-list">
            <li>
              <Link to="/productos" className="footer-link">
                Todos los productos
              </Link>
            </li>
            <li>
              <Link to="/higienedental" className="footer-link">
                Higiene dental
              </Link>
            </li>
            <li>
              <Link to="/cuidadocorporal" className="footer-link">
                Cuidado corporal
              </Link>
            </li>
            <li>
              <Link to="/skincare" className="footer-link">
                Skin care
              </Link>
            </li>
            <li>
              <Link to="/capilar" className="footer-link">
                Capilar
              </Link>
            </li>
          </ul>
        </div>

        {/* COLUMNA 3: INFORMACIÓN */}
        <div className="footer-column">
          <h2>Información</h2>
          <ul className="footer-links-list">
            <li>
              <Link to="/sobre-nosotros" className="footer-link">
                Sobre nosotros
              </Link>
            </li>
            <li>
              <Link to="/donaciones" className="footer-link">
                Donaciones
              </Link>
            </li>
            <li>
              <Link to="/envios" className="footer-link">
                Envíos
              </Link>
            </li>
          </ul>
        </div>

        {/* COLUMNA 4: CONTACTO */}
        <div className="footer-column">
          <h2>Contacto</h2>
          <div className="footer-contact-info">
            <a href="mailto:hola@mizu.com" className="footer-contact-item">
              hola@mizu.com
            </a>
            <a href="tel:+34123456789" className="footer-contact-item">
              +34 123 456 789
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
