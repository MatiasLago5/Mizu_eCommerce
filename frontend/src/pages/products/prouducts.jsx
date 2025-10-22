import { Link } from "react-router-dom";
import "./productsStyles.css";

function Products() {
  // Datos de ejemplo (mock data) - después conectarás con tu API
  const products = [
    {
      id: 1,
      name: "Mizu Pure Flow",
      category: "Jabones Líquidos",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600",
    },
    {
      id: 2,
      name: "Mizu Gentle Stream",
      category: "Jabones Líquidos",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600",
    },
    {
      id: 3,
      name: "Mizu Essence Bar",
      category: "Jabones de Tocador",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1585933646077-214581db4821?w=600",
    },
    {
      id: 4,
      name: "Mizu Crystal Touch",
      category: "Jabones de Tocador",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1600857062241-98e5dba60f2f?w=600",
    },
    {
      id: 5,
      name: "Mizu Daily Wash",
      category: "Jabones de Manos",
      price: 9.99,
      image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600",
    },
    {
      id: 6,
      name: "Mizu AirFoam",
      category: "Espuma para Manos",
      price: 14.99,
      image: "https://images.unsplash.com/photo-1556229010-aa3e6b40a1ee?w=600",
    },
    {
      id: 7,
      name: "Mizu Mineral Soak",
      category: "Sales de Baño",
      price: 16.99,
      image: "https://images.unsplash.com/photo-1608571607446-f2c90e5c4c55?w=600",
    },
    {
      id: 8,
      name: "Mizu Bamboo Clean",
      category: "Cepillos de Dientes",
      price: 5.99,
      image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600",
    },
    {
      id: 9,
      name: "Mizu MintCare",
      category: "Pasta de Dientes",
      price: 7.99,
      image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600",
    },
    {
      id: 10,
      name: "Mizu HydraBalance",
      category: "Crema Hidratante",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600",
    },
    {
      id: 11,
      name: "Mizu Sea Polish",
      category: "Exfoliante Corporal",
      price: 18.99,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600",
    },
    {
      id: 12,
      name: "Mizu FreshCore",
      category: "Desodorante",
      price: 11.99,
      image: "https://images.unsplash.com/photo-1615397349754-83cc6b7ccd2d?w=600",
    },
    {
      id: 13,
      name: "Mizu SunVeil",
      category: "Protector Solar",
      price: 22.99,
      image: "https://images.unsplash.com/photo-1556228720-da4e85f25e15?w=600",
    },
    {
      id: 14,
      name: "Mizu Eau Pure",
      category: "Perfumes",
      price: 45.99,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600",
    },
    {
      id: 15,
      name: "Mizu GlowScrub",
      category: "Exfoliante Facial",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1570194065650-d99fb4ceb9f0?w=600",
    },
    {
      id: 16,
      name: "Mizu Clean Flow",
      category: "Gel de Limpieza",
      price: 15.99,
      image: "https://images.unsplash.com/photo-1556228852-80c92ad3e4ce?w=600",
    },
    {
      id: 17,
      name: "Mizu Calm Mask",
      category: "Mascarillas",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600",
    },
    {
      id: 18,
      name: "Mizu Glow Serum",
      category: "Serum Facial",
      price: 32.99,
      image: "https://images.unsplash.com/photo-1620916297019-e4bbaa6ed202?w=600",
    },
    {
      id: 19,
      name: "Mizu FreshWave",
      category: "Shampoo",
      price: 14.99,
      image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600",
    },
    {
      id: 20,
      name: "Mizu Smooth Flow",
      category: "Acondicionador",
      price: 14.99,
      image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600",
    },
  ];

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="products-title">Todos los Productos</h1>
        <p className="products-subtitle">
          Descubre nuestra colección completa de productos conscientes
        </p>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <Link
            to={`/producto/${product.id}`}
            key={product.id}
            className="product-card"
          >
            <div className="product-card-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-card-info">
              <span className="product-card-category">{product.category}</span>
              <h3 className="product-card-name">{product.name}</h3>
              <p className="product-card-price">{product.price.toFixed(2)} €</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Products;