import React, { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../../../apiFetchs/productsFetch";
import "./FeaturedProducts.css";

const formatCurrency = (value) => Number(value || 0).toFixed(2);

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDiscountedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts({ limit: 12, discountedOnly: true });
        setProducts(data);
      } catch (err) {
        console.error("Error al obtener los productos:", err);
        setError("No pudimos cargar los productos en oferta.");
      } finally {
        setLoading(false);
      }
    };

    loadDiscountedProducts();
  }, []);

  const visibleProducts = useMemo(() => products.slice(0, 6), [products]);

  if (loading) {
    return <p className="loading-text">Cargando productos con descuento...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  if (!visibleProducts.length) {
    return (
      <section className="featured-products">
        <h2 className="featured-title">Productos en oferta</h2>
        <p className="empty-text">Pronto tendremos descuentos disponibles.</p>
      </section>
    );
  }

  return (
    <section className="featured-products">
      <h2 className="featured-title">Productos con descuento</h2>
      <div className="product-grid">
        {visibleProducts.map((product) => {
          const discountValue = Number(product.discountPercentage) || 0;
          const hasDiscount = discountValue > 0;
          const originalPrice = Number(product.price) || 0;
          const discountedPrice = hasDiscount
            ? originalPrice * (1 - discountValue / 100)
            : originalPrice;

          return (
            <div className="product-card" key={product.id}>
              {hasDiscount && (
                <span className="discount-badge">-{Math.round(discountValue)}%</span>
              )}
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-image"
                loading="lazy"
              />
              <h3 className="product-name">{product.name}</h3>
              <div className="price-info">
                {hasDiscount && (
                  <span className="original-price">
                    ${formatCurrency(originalPrice)}
                  </span>
                )}
                <span className="current-price">
                  ${formatCurrency(discountedPrice)}
                </span>
              </div>
              {product.description && (
                <p className="product-description">{product.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedProducts;
