import { useState, useEffect } from 'react';
import { fetchProducts } from '../../../apiFetchs/productsFetch';
import { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  fetchCategories, 
  fetchSubcategories 
} from '../../../apiFetchs/adminFetch';

function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    subcategoryId: '',
    imageUrl: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsData, categoriesData, subcategoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchSubcategories()
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
    } catch (err) {
      setError(err.message);
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
      };

      if (!productData.categoryId) {
        throw new Error('Seleccioná una categoría');
      }

      if (!Number.isFinite(productData.price) || productData.price < 0) {
        throw new Error('Ingresá un precio válido');
      }

      if (!Number.isInteger(productData.stock) || productData.stock < 0) {
        throw new Error('Ingresá un stock válido');
      }

      if (!productData.subcategoryId) {
        productData.subcategoryId = null;
      }

      if (!productData.imageUrl) {
        delete productData.imageUrl;
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }
      
      await loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      categoryId: product.categoryId || product.category?.id || '',
      subcategoryId: product.subcategoryId || product.subcategory?.id || '',
      imageUrl: product.imageUrl || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(productId);
        await loadData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      categoryId: '',
      subcategoryId: '',
      imageUrl: ''
    });
  };

  const getFilteredSubcategories = () => {
    return subcategories.filter(sub => String(sub.categoryId) === String(formData.categoryId));
  };

  if (isLoading) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
    <div className="products-manager">
      <div className="section-header">
        <h1 className="section-title">Gestión de Productos</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Nuevo Producto
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '50px', height: '50px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      Sin imagen
                    </div>
                  )}
                </td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td>
                  {product.category?.name || product.Category?.name || 'Sin categoría'}
                  {product.subcategory?.name && ` - ${product.subcategory.name}`}
                </td>
                <td>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleEdit(product)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button 
                className="close-btn"
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Precio *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Categoría *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value, subcategoryId: ''})}
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Subcategoría</label>
                  <select
                    value={formData.subcategoryId}
                    onChange={(e) => setFormData({...formData, subcategoryId: e.target.value})}
                    disabled={!formData.categoryId}
                  >
                    <option value="">Seleccionar subcategoría</option>
                    {getFilteredSubcategories().map(subcategory => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>URL de Imagen</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsManager;