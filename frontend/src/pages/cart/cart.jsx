import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./cartStyles.css";
import {
  fetchCart,
  updateCartItemQuantity,
  removeCartItem,
} from "../../apiFetchs/cartFetch";
import { checkoutCart } from "../../apiFetchs/ordersFetch";
import {
  fetchUserAddress,
  saveUserAddress,
} from "../../apiFetchs/usersFetch";
import { setCartItems as setCartItemsAction } from "../../store/cartSlice";

const DELIVERY_COST = 50;
const CHECKOUT_STEPS = ["Datos de envío", "Confirmación"];
const REQUIRED_ADDRESS_FIELDS = [
  "fullName",
  "phone",
  "street",
  "city",
  "department",
];

const EMPTY_ADDRESS = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  department: "",
  postalCode: "",
  reference: "",
  country: "Uruguay",
};

function Cart() {
  const [cartItems, setLocalCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutState, setCheckoutState] = useState({ status: "idle", message: "" });
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [shippingMethod, setShippingMethod] = useState("delivery");
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [isAddressSaving, setIsAddressSaving] = useState(false);
  const [shippingError, setShippingError] = useState("");
  const [orderReceipt, setOrderReceipt] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loadCart = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const cart = await fetchCart();
      if (cart && Array.isArray(cart.items)) {
        setLocalCartItems(cart.items);
        dispatch(setCartItemsAction(cart));
      } else {
        setLocalCartItems([]);
        dispatch(setCartItemsAction([]));
      }
    } catch (err) {
      setError(err?.message ?? "Error al obtener el carrito");
      setLocalCartItems([]);
      dispatch(setCartItemsAction([]));
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const loadAddress = useCallback(async () => {
    try {
      setIsAddressLoading(true);
      setShippingError("");
      const address = await fetchUserAddress();
      if (address) {
        setAddressForm((prev) => ({ ...prev, ...address }));
      }
    } catch (err) {
      setShippingError(err?.message ?? "No pudimos cargar tu dirección");
    } finally {
      setIsAddressLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    loadAddress();
  }, [loadAddress]);

  const updateQuantity = async (item, delta) => {
    const nextQuantity = item.quantity + delta;
    if (nextQuantity < 1) return;

    try {
      const updatedItem = await updateCartItemQuantity({
        itemId: item.id,
        quantity: nextQuantity,
      });

      if (!updatedItem) return;

      setLocalCartItems((prev) => {
        const nextItems = prev.map((current) =>
          current.id === item.id
            ? {
                ...current,
                ...updatedItem,
              }
            : current
        );
        dispatch(setCartItemsAction(nextItems));
        return nextItems;
      });
    } catch (err) {
      setError(err?.message ?? "No se pudo actualizar la cantidad");
    }
  };

  const removeItem = async (itemId) => {
    try {
      await removeCartItem({ itemId });
      setLocalCartItems((prev) => {
        const nextItems = prev.filter((item) => item.id !== itemId);
        dispatch(setCartItemsAction(nextItems));
        return nextItems;
      });
    } catch (err) {
      setError(err?.message ?? "No se pudo eliminar el producto");
    }
  };

  const isDeliveryFormValid = useMemo(
    () =>
      REQUIRED_ADDRESS_FIELDS.every((field) =>
        Boolean(addressForm[field]?.toString().trim())
      ),
    [addressForm]
  );

  const proceedToConfirmation = async () => {
    setShippingError("");

    if (shippingMethod === "delivery") {
      if (!isDeliveryFormValid) {
        setShippingError("Completá todos los campos marcados con * para continuar.");
        return;
      }

      try {
        setIsAddressSaving(true);
        const savedAddress = await saveUserAddress(addressForm);
        if (savedAddress) {
          setAddressForm((prev) => ({ ...prev, ...savedAddress }));
        }
      } catch (err) {
        setShippingError(err?.message ?? "No pudimos guardar la dirección");
        return;
      } finally {
        setIsAddressSaving(false);
      }
    }

    setActiveStep(1);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0 || activeStep !== 1) return;

    setCheckoutState({ status: "loading", message: "Procesando tu compra..." });
    setIsProcessingCheckout(true);

    try {
      const payload = await checkoutCart({ shippingMethod });
      const order = payload?.order || null;
      const donationCount = order?.donationCount ?? 0;

      setCheckoutState({
        status: "success",
        message:
          donationCount > 0
            ? `¡Gracias! Con esta compra se donarán ${donationCount} producto${donationCount === 1 ? "" : "s"}.`
            : "¡Gracias por tu compra!",
      });
      setOrderReceipt(order);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      await loadCart();
      setActiveStep(0);
    } catch (err) {
      setCheckoutState({ status: "error", message: err?.message || "No pudimos completar el checkout" });
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  const handlePrimaryAction = async () => {
    if (cartItems.length === 0) return;
    if (activeStep === 0) {
      await proceedToConfirmation();
      return;
    }

    await handleCheckout();
  };

  const handleShippingMethodChange = (method) => {
    setShippingMethod(method);
    setShippingError("");
    if (activeStep === 1) {
      setActiveStep(0);
    }
  };

  const resolvePrice = (value, fallback) => {
    const numeric = Number(value ?? fallback ?? 0);
    return Number.isFinite(numeric) ? numeric : 0;
  };

  const getItemPricing = (item) => {
    const originalPrice = resolvePrice(
      item.originalPrice,
      item.product?.price ?? item.price
    );
    const finalPrice = resolvePrice(
      item.finalPrice,
      item.price ?? originalPrice
    );
    const discountPercentage = Number(
      item.discountPercentage ?? item.product?.discountPercentage ?? 0
    );
    const hasDiscount =
      discountPercentage > 0 && originalPrice > 0 && finalPrice < originalPrice;

    return {
      originalPrice,
      finalPrice,
      discountPercentage: hasDiscount ? discountPercentage : 0,
      hasDiscount,
    };
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const { finalPrice } = getItemPricing(item);
      return sum + finalPrice * item.quantity;
    }, 0);
  };

  const calculateDonations = () => {
    const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    return Math.floor(totalItems / 3);
  };

  const subtotal = calculateSubtotal();
  const donations = calculateDonations();
  const shippingCost = shippingMethod === "delivery" ? DELIVERY_COST : 0;
  const total = subtotal + shippingCost;

  const primaryButtonLabel =
    activeStep === 0
      ? isAddressSaving
        ? "Guardando..."
        : "Continuar con confirmación"
      : isProcessingCheckout
        ? "Procesando..."
        : "Confirmar y pagar";

  const primaryButtonDisabled =
    cartItems.length === 0 ||
    isProcessingCheckout ||
    (activeStep === 0 && shippingMethod === "delivery" && !isDeliveryFormValid) ||
    isAddressSaving;

  const hasItems = cartItems.length > 0;

  return (
    <div className="cart-container">
      <div className="cart-content">
        <div className="cart-header">
          <h1 className="cart-title">Tu Carrito</h1>
          <p className="cart-subtitle">{cartItems.length} productos</p>
        </div>

        {checkoutState.status === "success" && (
          <div className="checkout-success-card">
            <div className="success-icon">✅</div>
            <div className="success-content">
              <h2>Compra realizada con éxito</h2>
              <p>{checkoutState.message}</p>
              {orderReceipt && (
                <div className="success-details">
                  <p>
                    <strong>Pedido:</strong> {orderReceipt.id?.slice(0, 8)} · {orderReceipt.totalItems} artículo(s)
                  </p>
                  <p>
                    <strong>Total:</strong> ${Number(orderReceipt.totalAmount || 0).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
            <div className="success-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate("/productos")}>
                Seguir comprando
              </button>
              <button type="button" className="btn-primary" onClick={() => navigate("/profile")}>
                Ver mis pedidos
              </button>
            </div>
          </div>
        )}

        <div className="cart-layout">
          {error && <div className="cart-error">{error}</div>}

          {loading && cartItems.length === 0 ? (
            <div className="cart-loading">Cargando carrito...</div>
          ) : null}

          <div className="cart-items-section">
            {hasItems ? (
              <div className="cart-items-list">
                {cartItems.map((item) => {
                  const pricing = getItemPricing(item);

                  return (
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
                        <div className="item-price-block">
                          {pricing.hasDiscount && (
                            <span className="item-price-original">
                              ${pricing.originalPrice.toFixed(2)}
                            </span>
                          )}
                          <span className="item-price-current">
                            ${pricing.finalPrice.toFixed(2)}
                          </span>
                          {pricing.hasDiscount && (
                            <span className="item-price-badge">
                              -{Math.round(pricing.discountPercentage)}%
                            </span>
                          )}
                        </div>
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
                          ${ (pricing.finalPrice * item.quantity).toFixed(2) }
                        </p>

                        <button
                          className="remove-btn"
                          onClick={() => removeItem(item.id)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-cart">
                <div className="empty-icon">🛒</div>
                <h2 className="empty-title">Tu carrito está vacío</h2>
                <p className="empty-text">Agregá productos para comenzar tu compra</p>

                <button className="btn-shop" onClick={() => navigate("/productos")}>
                  Ir a productos
                </button>
              </div>
            )}
          </div>

          {hasItems && (
            <div className="cart-summary">
              <h2 className="summary-title">Resumen</h2>

              <div className="checkout-steps">
                {CHECKOUT_STEPS.map((label, index) => {
                  const isCompleted = activeStep > index;
                  const isActive = activeStep === index;
                  return (
                    <div
                      key={label}
                      className={`checkout-step ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
                    >
                      <div className="step-circle">{index + 1}</div>
                      <span className="step-label">{label}</span>
                    </div>
                  );
                })}
              </div>

              {activeStep === 0 ? (
                <div className="shipping-step">
                  <p className="step-note">Elegí cómo querés recibir tus productos.</p>
                  <div className="shipping-methods">
                    <button
                      type="button"
                      className={`shipping-method ${shippingMethod === "delivery" ? "active" : ""}`}
                      onClick={() => handleShippingMethodChange("delivery")}
                    >
                      <div className="method-header">
                        <h3>Envío a domicilio</h3>
                        <span className="shipping-badge">${DELIVERY_COST} fijos</span>
                      </div>
                      <p>Entrega en cualquier punto de Uruguay.</p>
                    </button>

                    <button
                      type="button"
                      className={`shipping-method ${shippingMethod === "pickup" ? "active" : ""}`}
                      onClick={() => handleShippingMethodChange("pickup")}
                    >
                      <div className="method-header">
                        <h3>Retiro en refugio</h3>
                        <span className="shipping-badge free">Gratis</span>
                      </div>
                      <p>Coordinamos el retiro en el refugio más cercano.</p>
                    </button>
                  </div>

                  {shippingMethod === "delivery" && (
                    <div className="shipping-form">
                      {isAddressLoading ? (
                        <p className="shipping-loading">Cargando tu dirección guardada...</p>
                      ) : (
                        <div className="form-grid">
                          <label className="form-field">
                            <span>Nombre completo *</span>
                            <input
                              type="text"
                              value={addressForm.fullName}
                              onChange={(e) =>
                                setAddressForm((prev) => ({
                                  ...prev,
                                  fullName: e.target.value,
                                }))
                              }
                              placeholder="Nombre y apellido"
                              autoComplete="name"
                            />
                          </label>
                          <label className="form-field">
                            <span>Teléfono *</span>
                            <input
                              type="tel"
                              value={addressForm.phone}
                              onChange={(e) =>
                                setAddressForm((prev) => ({
                                  ...prev,
                                  phone: e.target.value,
                                }))
                              }
                              placeholder="09X XXX XXX"
                              autoComplete="tel"
                            />
                          </label>
                          <label className="form-field full-width">
                            <span>Calle y número *</span>
                            <input
                              type="text"
                              value={addressForm.street}
                              onChange={(e) =>
                                setAddressForm((prev) => ({
                                  ...prev,
                                  street: e.target.value,
                                }))
                              }
                              placeholder="Ej. Av. Italia 1234"
                              autoComplete="address-line1"
                            />
                          </label>
                          <label className="form-field">
                            <span>Ciudad *</span>
                            <input
                              type="text"
                              value={addressForm.city}
                              onChange={(e) =>
                                setAddressForm((prev) => ({
                                  ...prev,
                                  city: e.target.value,
                                }))
                              }
                              placeholder="Montevideo"
                              autoComplete="address-level2"
                            />
                          </label>
                          <label className="form-field">
                            <span>Departamento *</span>
                            <input
                              type="text"
                              value={addressForm.department}
                              onChange={(e) =>
                                setAddressForm((prev) => ({
                                  ...prev,
                                  department: e.target.value,
                                }))
                              }
                              placeholder="Montevideo"
                              autoComplete="address-level1"
                            />
                          </label>
                          <label className="form-field">
                            <span>Código postal</span>
                            <input
                              type="text"
                              value={addressForm.postalCode}
                              onChange={(e) =>
                                setAddressForm((prev) => ({
                                  ...prev,
                                  postalCode: e.target.value,
                                }))
                              }
                              placeholder="11300"
                              autoComplete="postal-code"
                            />
                          </label>
                          <label className="form-field full-width">
                            <span>Referencia</span>
                            <textarea
                              value={addressForm.reference}
                              onChange={(e) =>
                                setAddressForm((prev) => ({
                                  ...prev,
                                  reference: e.target.value,
                                }))
                              }
                              placeholder="Piso, apartamento o indicaciones adicionales"
                              rows={3}
                            />
                          </label>
                        </div>
                      )}
                      {shippingError && <p className="shipping-error">{shippingError}</p>}
                    </div>
                  )}
                </div>
              ) : (
                <div className="confirm-step">
                  <div className="confirm-header">
                    <h3>Revisá los datos antes de pagar</h3>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setActiveStep(0)}
                      disabled={isProcessingCheckout}
                    >
                      Editar envío
                    </button>
                  </div>
                  <div className="confirm-preview">
                    <div className="confirm-row">
                      <span className="confirm-label">Método</span>
                      <span className="confirm-value">
                        {shippingMethod === "delivery"
                          ? "Envío a domicilio"
                          : "Retiro en refugio"}
                      </span>
                    </div>
                    {shippingMethod === "delivery" ? (
                      <div className="address-preview">
                        <p>
                          {addressForm.fullName} · {addressForm.phone}
                        </p>
                        <p>
                          {addressForm.street}, {addressForm.city}, {addressForm.department}
                        </p>
                        {addressForm.postalCode && <p>CP {addressForm.postalCode}</p>}
                        {addressForm.reference && (
                          <p className="reference-note">Referencia: {addressForm.reference}</p>
                        )}
                      </div>
                    ) : (
                      <p className="pickup-note">
                        Te enviaremos la dirección y horario del refugio más cercano apenas confirmes tu compra.
                      </p>
                    )}
                  </div>
                </div>
              )}

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
                  {shippingCost === 0 ? "Gratis" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>

              <p className="shipping-note">
                Envío dentro de Uruguay por ${DELIVERY_COST}. Retiro en refugio sin costo.
              </p>

              <div className="summary-divider"></div>

              <div className="summary-line summary-total">
                <span className="summary-label">Total</span>
                <span className="summary-value">${total.toFixed(2)}</span>
              </div>

              {checkoutState.status !== "idle" && (
                <p className={`checkout-status ${checkoutState.status}`}>
                  {checkoutState.message}
                </p>
              )}

              <button
                className="btn-checkout"
                onClick={handlePrimaryAction}
                disabled={primaryButtonDisabled}
              >
                {primaryButtonLabel}
              </button>

              <button
                className="btn-continue"
                type="button"
                onClick={() => navigate("/productos")}
              >
                Seguir comprando
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
