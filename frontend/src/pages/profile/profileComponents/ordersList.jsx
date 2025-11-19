function OrdersList({ orders = [], isLoading = false }) {
  const hasOrders = Array.isArray(orders) && orders.length > 0;

  return (
    <div className="section-card">
      <h2 className="card-title">Historial de Pedidos</h2>

      {isLoading && <p className="empty-state">Cargando pedidos...</p>}

      {!isLoading && !hasOrders && (
        <p className="empty-state">
          Aún no registramos pedidos para tu cuenta. ¡Visitá la tienda y realizá tu primera compra!
        </p>
      )}

      {hasOrders && (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <p className="order-id">Pedido</p>
                  <p className="order-date">
                    {new Date(order.date || order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="order-status">{order.status || 'Procesando'}</span>
              </div>

              {Array.isArray(order.items) && order.items.length > 0 && (
                <div className="order-items">
                  {order.items.map((item, idx) => (
                    <div key={`${order.id}-${idx}`} className="order-item">
                      <span className="item-detail">
                        {item.name || item.product?.name || 'Producto'} x{item.quantity}
                      </span>
                      <span className="item-price">
                        ${Number(item.unitPrice || item.price || item.product?.price || 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="order-footer">
                <span className="order-total-label">Total:</span>
                <span className="order-total">
                  ${Number(order.totalAmount || order.total || 0).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersList;