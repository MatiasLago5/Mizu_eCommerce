function OrdersList() {
  // Mock orders - reemplazar con fetch: getUserOrders()
  const orders = [
    {
      id: 1,
      date: "2024-11-10",
      total: 45.50,
      status: "Entregado",
      items: [
        { name: "Mizu Pure Flow", quantity: 3, price: 8.90 },
        { name: "Pasta Dental Menta", quantity: 2, price: 6.50 }
      ]
    },
    {
      id: 2,
      date: "2024-10-25",
      total: 32.00,
      status: "Entregado",
      items: [
        { name: "Jabón Natural", quantity: 4, price: 8.00 }
      ]
    }
  ];

  return (
    <div className="section-card">
      <h2 className="card-title">Historial de Pedidos</h2>
      
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <p className="order-id">Pedido #{order.id}</p>
                <p className="order-date">{order.date}</p>
              </div>
              <span className="order-status">{order.status}</span>
            </div>

            <div className="order-items">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-item">
                  <span className="item-detail">{item.name} x{item.quantity}</span>
                  <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <span className="order-total-label">Total:</span>
              <span className="order-total">${order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrdersList;