import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./productDetailStyles.css";
import { fetchProductById, fetchProducts } from "../../apiFetchs/productsFetch";
import { addOrUpdateCartItem } from "../../apiFetchs/cartFetch";
import { useCart } from "../../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const { refreshCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedStatus, setRelatedStatus] = useState({ loading: false, error: null });

  useEffect(() => {
    let isActive = true;

    const loadProduct = async () => {
      if (!id) {
        setError("Producto no especificado");
        setLoading(false);
        return;
      }

      try {
        setError(null);
        setLoading(true);
        const data = await fetchProductById(id);
        if (!isActive) return;
        setProduct(data);
        setSelectedImage(0);
        setQuantity(1);
      } catch (err) {
        if (!isActive) return;
        setProduct(null);
        setError(err?.message ?? "Error al cargar el producto");
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isActive = false;
    };
  }, [id]);

  useEffect(() => {
    let isActive = true;

    const categoryId =
      product?.categoryId ||
      product?.category?.id ||
      (typeof product?.category === "object" ? product?.category?.id : null);

    if (!product || !categoryId) {
      setRelatedProducts([]);
      setRelatedStatus((prev) => ({ ...prev, loading: false }));
      return () => {
        isActive = false;
      };
    }

    const loadRelated = async () => {
      setRelatedStatus({ loading: true, error: null });
      try {
        const data = await fetchProducts({ limit: 12, categoryId });
        if (!isActive) return;
        const filtered = (Array.isArray(data) ? data : [])
          .filter((item) => item.id !== product.id)
          .slice(0, 4);
        setRelatedProducts(filtered);
        setRelatedStatus({ loading: false, error: null });
      } catch (err) {
        if (!isActive) return;
        setRelatedProducts([]);
        setRelatedStatus({
          loading: false,
          error: err?.message ?? "No pudimos cargar productos similares",
        });
      }
    };

    loadRelated();

    return () => {
      isActive = false;
    };
  }, [product]);

  const gallery = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    if (product.imageUrl) {
      return [product.imageUrl];
    }
    return [];
  }, [product]);

  useEffect(() => {
    if (selectedImage >= gallery.length) {
      setSelectedImage(0);
    }
  }, [gallery, selectedImage]);

  const stockNumber = useMemo(() => {
    const numeric = Number(product?.stock ?? 0);
    return Number.isFinite(numeric) ? numeric : 0;
  }, [product]);

  const priceNumber = useMemo(() => {
    const numeric = Number(product?.price ?? 0);
    return Number.isFinite(numeric) ? numeric : null;
  }, [product]);

  const handleQuantityChange = (delta) => {
    const next = quantity + delta;
    if (next < 1) return;
    if (stockNumber > 0 && next > stockNumber) return;
    setQuantity(next);
  };

  const handleAddToCart = async () => {
    if (!product?.id) return;

    try {
      setFeedback(null);
      await addOrUpdateCartItem({
        productId: product.id,
        quantity,
      });
      setFeedback({
        type: "success",
        message: "Producto agregado al carrito",
      });
      refreshCart();
    } catch (err) {
      setFeedback({
        type: "error",
        message: err?.message ?? "No se pudo agregar al carrito",
      });
    }
  };

  const mainImage = gallery[selectedImage] || "/placeholder.png";
  const categoryName = product?.category?.name || product?.category || "";
  const subcategoryName = product?.subcategory?.name || "";
  const isOutOfStock = stockNumber <= 0;

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="product-detail-content">
          <div className="product-status">Cargando producto...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-container">
        <div className="product-detail-content">
          <div className="product-status product-status-error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-content">
        <div className="product-images-section">
          <div className="main-image-container">
            <img
              src={mainImage}
              alt={product?.name || "Producto"}
              className="main-image"
            />
          </div>
          {gallery.length > 1 && (
            <div className="thumbnails-container">
              {gallery.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${
                    selectedImage === index ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product?.name || "Producto"} ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info-section">
          {(categoryName || subcategoryName) && (
            <div className="product-category">
              {categoryName}
              {subcategoryName ? ` • ${subcategoryName}` : ""}
            </div>
          )}
          <h1 className="product-name">{product?.name}</h1>
          <div className="product-price">
            {priceNumber !== null
              ? `$${priceNumber.toFixed(2)}`
              : product?.price}
          </div>

          {product?.description && (
            <div className="product-description">
              <p>{product.description}</p>
            </div>
          )}

          <div className="product-options">
            <label className="option-label">Cantidad</label>
            <div className="quantity-selector">
              <button
                className="quantity-button"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="quantity-value">{quantity}</span>
              <button
                className="quantity-button"
                onClick={() => handleQuantityChange(1)}
                disabled={
                  isOutOfStock || (stockNumber > 0 && quantity >= stockNumber)
                }
              >
                +
              </button>
            </div>
          </div>

          <button
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Sin stock" : "Añadir al carrito"}
          </button>

          <div className="product-stock">
            {isOutOfStock
              ? "No hay stock disponible"
              : stockNumber > 10
              ? "En stock"
              : `Solo quedan ${stockNumber} unidades`}
          </div>

          {feedback && (
            <div
              className={`product-feedback ${
                feedback.type === "error"
                  ? "product-feedback-error"
                  : "product-feedback-success"
              }`}
            >
              {feedback.message}
            </div>
          )}
        </div>
      </div>

      <div className="product-related-section">
        <div className="related-header">
          <h2>Productos similares</h2>
          {categoryName && <p>Más opciones en {categoryName}</p>}
        </div>

        {relatedStatus.loading ? (
          <div className="related-status">Buscando sugerencias...</div>
        ) : relatedStatus.error ? (
          <div className="related-status related-status-error">
            {relatedStatus.error}
          </div>
        ) : relatedProducts.length === 0 ? (
          <div className="related-status">No hay productos similares para mostrar.</div>
        ) : (
          <div className="related-grid">
            {relatedProducts.map((item) => {
              const itemPrice = Number(item.price);
              const displayPrice = Number.isFinite(itemPrice)
                ? `$${itemPrice.toFixed(2)}`
                : item.price;
              return (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="related-card"
                >
                  <div className="related-image-wrapper">
                    <img
                      src={item.imageUrl || "/placeholder.png"}
                      alt={item.name}
                    />
                  </div>
                  <div className="related-info">
                    <h3>{item.name}</h3>
                    <p className="related-price">{displayPrice}</p>
                    <span className="related-link">Ver detalle →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
