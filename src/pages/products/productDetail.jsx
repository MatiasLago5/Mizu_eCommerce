import { useState } from "react";
import "./productDetailStyles.css";

function ProductDetail() {
  // Datos de ejemplo (mock data)
  const product = {
    id: 1,
    name: "Mizu Pure Flow",
    category: "Jabones Líquidos",
    price: 12.99,
    description:
      "Jabón líquido suave y purificante para uso diario. Formulado con ingredientes naturales que limpian delicadamente sin resecar la piel. Su textura ligera y aromática transforma cada lavado en un momento de calma y frescura.",
    ingredients: "Agua purificada, glicerina vegetal, aceite de coco, extracto de aloe vera, aceites esenciales naturales.",
    sizes: ["250ml", "500ml", "1L"],
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600",
      "https://images.unsplash.com/photo-1585933646077-214581db4821?w=600",
    ],
    stock: 50,
  };

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    console.log("Añadido al carrito:", {
      product: product.name,
      size: selectedSize,
      quantity: quantity,
    });
    // Aquí conectarás con tu estado global o context del carrito
  };

  return (
    <div className="product-detail-container">
      <div className="product-detail-content">
        {/* SECCIÓN IZQUIERDA: IMÁGENES */}
        <div className="product-images-section">
          <div className="main-image-container">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="main-image"
            />
          </div>
          <div className="thumbnails-container">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`thumbnail ${
                  selectedImage === index ? "active" : ""
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image} alt={`${product.name} ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* SECCIÓN DERECHA: INFORMACIÓN */}
        <div className="product-info-section">
          <div className="product-category">{product.category}</div>
          <h1 className="product-name">{product.name}</h1>
          <div className="product-price">{product.price.toFixed(2)} €</div>

          <div className="product-description">
            <p>{product.description}</p>
          </div>

          <div className="product-ingredients">
            <h3>Ingredientes</h3>
            <p>{product.ingredients}</p>
          </div>

          {/* SELECTOR DE TAMAÑO */}
          <div className="product-options">
            <label className="option-label">Tamaño</label>
            <div className="size-selector">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-button ${
                    selectedSize === size ? "active" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* SELECTOR DE CANTIDAD */}
          <div className="product-options">
            <label className="option-label">Cantidad</label>
            <div className="quantity-selector">
              <button
                className="quantity-button"
                onClick={() => handleQuantityChange(-1)}
              >
                −
              </button>
              <span className="quantity-value">{quantity}</span>
              <button
                className="quantity-button"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>
          </div>

          {/* BOTÓN AÑADIR AL CARRITO */}
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Añadir a la cesta
          </button>

          {/* STOCK */}
          <div className="product-stock">
            {product.stock > 10
              ? "En stock"
              : `Solo quedan ${product.stock} unidades`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;