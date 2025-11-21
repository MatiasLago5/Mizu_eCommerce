import { Link, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import "./productsStyles.css";
import { fetchProducts } from "../../apiFetchs/productsFetch";
import { fetchCatalogCategories } from "../../apiFetchs/catalogFetch";

const HEADER_COPY = {
  all: {
    title: "Todos los Productos",
    subtitle: "Descubrí nuestra colección completa de productos conscientes",
  },
};

function Products({ variant = "all" }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [productsError, setProductsError] = useState(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filtersLoading, setFiltersLoading] = useState(false);

  const queryFilters = useMemo(
    () => ({
      search: searchParams.get("q") || "",
      categoryId: searchParams.get("categoryId") || "",
      subcategoryId: searchParams.get("subcategoryId") || "",
    }),
    [searchParams]
  );

  const [searchTerm, setSearchTerm] = useState(queryFilters.search);
  const [selectedCategory, setSelectedCategory] = useState(
    queryFilters.categoryId
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    queryFilters.subcategoryId
  );

  useEffect(() => {
    setSearchTerm(queryFilters.search);
    setSelectedCategory(queryFilters.categoryId);
    setSelectedSubcategory(queryFilters.subcategoryId);
  }, [queryFilters]);

  const subcategoriesForCategory = useMemo(() => {
    const category = categories.find((cat) => String(cat.id) === selectedCategory);
    return category?.subcategories || [];
  }, [categories, selectedCategory]);

  const loadProducts = async () => {
    try {
      setProductsError(null);
      setProductsLoading(true);
      const data = await fetchProducts({
        limit: 200,
        search: queryFilters.search || undefined,
        categoryId: queryFilters.categoryId || undefined,
        subcategoryId: queryFilters.subcategoryId || undefined,
      });
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      setProductsError(error?.message ?? "Error al cargar productos");
    } finally {
      setProductsLoading(false);
    }
  };

  const loadCategories = async () => {
    if (variant === "all" && categories.length > 0) {
      return;
    }

    try {
      setFiltersLoading(true);
      const data = await fetchCatalogCategories({ includeSubcategories: true });
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("No pudimos cargar las categorías", error);
    } finally {
      setFiltersLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [queryFilters.search, queryFilters.categoryId, queryFilters.subcategoryId]);

  useEffect(() => {
    loadCategories();
  }, []);

  const syncFiltersToUrl = useCallback(
    ({
      searchValue = searchTerm,
      categoryValue = selectedCategory,
      subcategoryValue = selectedSubcategory,
    } = {}) => {
      const nextParams = {};

      const trimmedSearch = searchValue?.trim();
      if (trimmedSearch) {
        nextParams.q = trimmedSearch;
      }
      if (categoryValue) {
        nextParams.categoryId = categoryValue;
      }
      if (subcategoryValue) {
        nextParams.subcategoryId = subcategoryValue;
      }

      setSearchParams(nextParams, { replace: true });
    },
    [searchTerm, selectedCategory, selectedSubcategory, setSearchParams]
  );

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSearchParams({}, { replace: true });
  };

  const { title, subtitle } = HEADER_COPY[variant] || HEADER_COPY.all;

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="products-title">{title}</h1>
        <p className="products-subtitle">{subtitle}</p>
      </div>

      <div className="products-filters" role="search">
        <input
          type="search"
          placeholder="Buscar por nombre o descripción"
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            syncFiltersToUrl({ searchValue: value });
          }}
          className="filter-input"
        />
        <select
          value={selectedCategory}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedCategory(value);
            setSelectedSubcategory("");
            syncFiltersToUrl({ categoryValue: value, subcategoryValue: "" });
          }}
          className="filter-select"
          disabled={filtersLoading}
        >
          <option value="">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={selectedSubcategory}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedSubcategory(value);
            syncFiltersToUrl({ subcategoryValue: value });
          }}
          className="filter-select"
          disabled={!selectedCategory || filtersLoading}
        >
          <option value="">Todas las subcategorías</option>
          {subcategoriesForCategory.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>

        <div className="filter-actions">
          <button type="button" className="btn-secondary" onClick={handleResetFilters}>
            Limpiar
          </button>
        </div>
      </div>

      {productsLoading && <p className="products-status">Cargando productos...</p>}
      {productsError && <p className="products-error">{productsError}</p>}

      {!productsLoading && !productsError && (
        <>
          {products.length === 0 ? (
            <p className="products-status">No encontramos productos con esos criterios.</p>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <Link to={`/product/${product.id}`} className="product-link">
                    <img
                      src={product.imageUrl || product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      className="product-image"
                    />
                    <h2 className="product-name">{product.name}</h2>
                    <p className="product-price">${Number(product.price).toFixed(2)}</p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Products;