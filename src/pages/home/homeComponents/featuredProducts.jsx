import React, { useEffect, useState } from "react";
import "./FeaturedProducts.css";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Datos de ejemplo mientras la API no está lista
    const fetchProducts = async () => {
      try {
        const data = [
          { id: 1, name: "Jabón Sakura", price: 12.99, image: "https://www.giftsandcare.com/15968-full_default/jabon-de-bano-sakura-tokyo-acca-kappa-150gr.jpg" },
          { id: 2, name: "Crema Facial Matcha", price: 18.50, image: "https://www.druni.es/media/catalog/product/5/7/5798580.jpg" },
          { id: 3, name: "Toallitas de Arroz", price: 9.99, image: "https://miradadeangel.com.co/wp-content/uploads/2021/08/toallas-de-arroz-trendy.jpg" },
          { id: 4, name: "Aceite de Camelia", price: 15.00, image: "https://m.media-amazon.com/images/I/71g9JsbrMRL._SL1500_.jpg" },
          { id: 5, name: "Tónico de Té Verde", price: 14.50, image: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/btn/btn99034/l/46.jpg" },
          { id: 6, name: "Mascarilla de Arroz", price: 11.00, image: "https://m.media-amazon.com/images/I/51qSvl5xkqL._UF1000,1000_QL80_.jpg" },
        ];
        setProducts(data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p className="loading-text">Cargando productos...</p>;
  }

  return (
    <section className="featured-products">
      <h2 className="featured-title">Productos destacados</h2>
      <div className="product-grid">
        {products.slice(0, 6).map((product) => (
          <div className="product-card" key={product.id}>
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
