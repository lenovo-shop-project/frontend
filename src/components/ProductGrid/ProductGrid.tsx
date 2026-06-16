import ProductCard from "../ProductCard/ProductCard";
import type { Product } from "../ProductCard/ProductCard";
import "./ProductGrid.css";

const products: Product[] = [];

// ТУТ БУДЕ PYTHON FASTAPI BACKEND
//
// GET http://localhost:8000/products/top
//
// FastAPI бере товари з DB:
// @app.get("/products/top")
// async def get_top_products():
//     return products_from_database 

// useEffect(() => {
//   fetch("http://localhost:8000/products/top")
//     .then(res => res.json())
//     .then(data => setProducts(data));
// }, []);

const ProductGrid = () => {
  return (
    <section className="product-section">
      <h2>Топ продажів</h2>

      {products.length === 0 ? (
        <div className="empty-products">
          Товари будуть завантажен
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;