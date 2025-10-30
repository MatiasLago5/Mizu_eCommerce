import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./productsStyles.css";
import { fetchProducts } from "../../apiFetchs/productsFetch";

function Products() {
  const [products, setProducts] = useState([]);
  const [productsError, setProductsError] = useState(null);
  const [productsLoading, setProductsLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setProductsError(null);
      setProductsLoading(true);
      const data = await fetchProducts({ limit: 200 });
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      setProductsError(error?.message ?? "Error al cargar productos");
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="products-title">Todos los Productos</h1>
        <p className="products-subtitle">
          Descubre nuestra colección completa de productos conscientes
        </p>
      </div>
      {productsLoading && <p className="products-status">Cargando productos...</p>}
      {productsError && <p className="products-error">{productsError}</p>}
      {!productsLoading && !productsError && (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/producto/${product.id}`} className="product-link">
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="product-image"
                />
                <h2 className="product-name">{product.name}</h2>
                <p className="product-price">${product.price}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;