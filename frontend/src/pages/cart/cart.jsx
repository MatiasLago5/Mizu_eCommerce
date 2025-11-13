import { useCallback, useEffect, useState } from "react";
import "./cartStyles.css";
import {
  fetchCart,
  updateCartItemQuantity,
  removeCartItem,
} from "../../apiFetchs/cartFetch";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCart = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const cart = await fetchCart();
      if (cart && Array.isArray(cart.items)) {
        setCartItems(cart.items);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      setError(err?.message ?? "Error al obtener el carrito");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const updateQuantity = async (item, delta) => {
    const nextQuantity = item.quantity + delta;
    if (nextQuantity < 1) return;

    try {
      const updatedItem = await updateCartItemQuantity({
        itemId: item.id,
        quantity: nextQuantity,
      });

      if (!updatedItem) return;

      setCartItems((prev) =>
        prev.map((current) =>
          current.id === item.id
            ? {
                ...current,
                ...updatedItem,
              }
            : current
        )
      );
    } catch (err) {
      setError(err?.message ?? "No se pudo actualizar la cantidad");
    }
  };

  const removeItem = async (itemId) => {
    try {
      await removeCartItem({ itemId });
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      setError(err?.message ?? "No se pudo eliminar el producto");
    }
  };

  const resolvePrice = (value, fallback) => {
    const numeric = Number(value ?? fallback ?? 0);
    return Number.isFinite(numeric) ? numeric : 0;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const basePrice = resolvePrice(item.price, item.product?.price);
      return sum + basePrice * item.quantity;
    }, 0);
  };

  const calculateDonations = () => {
    let totalDonations = 0;
    cartItems.forEach((item) => {
      totalDonations += Math.floor(item.quantity / 3);
    });
    return totalDonations;
  };

  const subtotal = calculateSubtotal();
  const donations = calculateDonations();
  const shipping = subtotal > 50 ? 0 : 5.0;
  const total = subtotal + shipping;

  return (
    <div className="cart-container">
      <div className="cart-content">
        {/* Header */}
        <div className="cart-header">
          <h1 className="cart-title">Tu Carrito</h1>
          <p className="cart-subtitle">{cartItems.length} productos</p>
        </div>

        <div className="cart-layout">
          {error && <div className="cart-error">{error}</div>}

          {loading && cartItems.length === 0 ? (
            <div className="cart-loading">Cargando carrito...</div>
          ) : null}

          {/* Lista de productos */}
          <div className="cart-items-section">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-icon">🛒</div>
                <h2 className="empty-title">Tu carrito está vacío</h2>
                <p className="empty-text">
                  Agregá productos para comenzar tu compra
                </p>
                <button className="btn-shop">Ir a productos</button>
              </div>
            ) : (
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img
                      src={
                        item.imageUrl ||
                        item.product?.imageUrl ||
                        "/placeholder.png"
                      }
                      alt={item.product?.name || item.name || "Producto"}
                      className="item-image"
                    />

                    <div className="item-info">
                      <h3 className="item-name">
                        {item.product?.name || item.name}
                      </h3>
                      <p className="item-description">
                        {item.product?.description || item.description}
                      </p>
                      <p className="item-price">
                        $
                        {resolvePrice(item.price, item.product?.price).toFixed(
                          2
                        )}
                      </p>
                    </div>

                    <div className="item-actions">
                      <div className="quantity-control">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item, -1)}
                        >
                          -
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item, 1)}
                        >
                          +
                        </button>
                      </div>

                      <p className="item-total">
                        $
                        {(
                          resolvePrice(item.price, item.product?.price) *
                          item.quantity
                        ).toFixed(2)}
                      </p>

                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resumen */}
          {cartItems.length > 0 && (
            <div className="cart-summary">
              <h2 className="summary-title">Resumen</h2>

              {/* Donaciones */}
              {donations > 0 && (
                <div className="donation-banner">
                  <div className="donation-icon">💝</div>
                  <div className="donation-text">
                    <p className="donation-count">
                      ¡Vas a donar {donations} producto
                      {donations > 1 ? "s" : ""}!
                    </p>
                    <p className="donation-subtitle">
                      Gracias por tu compromiso social
                    </p>
                  </div>
                </div>
              )}

              <div className="summary-line">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">${subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-line">
                <span className="summary-label">Envío</span>
                <span className="summary-value">
                  {shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              {shipping > 0 && (
                <p className="shipping-note">
                  Envío gratis en compras mayores a $50
                </p>
              )}

              <div className="summary-divider"></div>

              <div className="summary-line summary-total">
                <span className="summary-label">Total</span>
                <span className="summary-value">${total.toFixed(2)}</span>
              </div>

              <button className="btn-checkout">Proceder al pago</button>

              <button className="btn-continue">Seguir comprando</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
