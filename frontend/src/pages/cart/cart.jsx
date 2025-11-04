import { useState } from 'react';
import './cartStyles.css';

function Cart() {
  // Ejemplo de carrito con productos
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Mizu Pure Flow",
      description: "Jabón líquido revitalizante con notas marinas",
      price: 8.90,
      quantity: 3,
      imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80",
      categoryKey: "soaps"
    },
    {
      id: 2,
      name: "Pasta Dental Menta",
      description: "Pasta dental con extractos naturales",
      price: 6.50,
      quantity: 2,
      imageUrl: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=400&q=80",
      categoryKey: "dental"
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateDonations = () => {
    let totalDonations = 0;
    cartItems.forEach(item => {
      totalDonations += Math.floor(item.quantity / 3);
    });
    return totalDonations;
  };

  const subtotal = calculateSubtotal();
  const donations = calculateDonations();
  const shipping = subtotal > 50 ? 0 : 5.00;
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
          {/* Lista de productos */}
          <div className="cart-items-section">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-icon">🛒</div>
                <h2 className="empty-title">Tu carrito está vacío</h2>
                <p className="empty-text">Agregá productos para comenzar tu compra</p>
                <button className="btn-shop">Ir a productos</button>
              </div>
            ) : (
              <div className="cart-items-list">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.imageUrl} alt={item.name} className="item-image" />
                    
                    <div className="item-info">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-description">{item.description}</p>
                      <p className="item-price">${item.price.toFixed(2)}</p>
                    </div>

                    <div className="item-actions">
                      <div className="quantity-control">
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <p className="item-total">${(item.price * item.quantity).toFixed(2)}</p>

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
                    <p className="donation-count">¡Vas a donar {donations} producto{donations > 1 ? 's' : ''}!</p>
                    <p className="donation-subtitle">Gracias por tu compromiso social</p>
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
                  {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
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