import React from 'react';

function ProductsList() {
  const products = [
    { icon: "🧴", name: "Shampoo" },
    { icon: "🧼", name: "Jabón" },
    { icon: "🪥", name: "Pasta Dental" },
    { icon: "🪒", name: "Desodorante" },
    { icon: "🧻", name: "Papel Higiénico" },
    { icon: "🧽", name: "Toallas Femeninas" }
  ];

  return (
    <section className="sticky-section products-section">
      <div className="section-content">
        <h2 className="section-title">Productos que Donamos</h2>
        <div className="products-grid">
          {products.map((product, index) => (
            <div key={index} className="product-item">
              <div className="product-icon">{product.icon}</div>
              <p className="product-name">{product.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductsList;