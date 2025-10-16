import HeroCarousel from "./homeComponents/carousel";
import "./homeStyles.css";
import SalesCounter from "./homeComponents/salesCounter";
import FeaturedProducts from "./homeComponents/featuredProducts";

function Home() {
  return (
    <div className="home-container">
      {/* Carousel */}
      <HeroCarousel />

      {/* Sección de bienvenida */}
      <section className="welcome-section">
        <h1 className="welcome-title">Bienvenido a Mizu 水</h1>
      </section>

      {/* Aca van los otros componentes */}
      {<SalesCounter />}
      {<FeaturedProducts />}
    </div>
  );
}

export default Home;
