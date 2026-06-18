import { useState, useEffect } from "react"; // 1. Добавил импорты
import ProductCard from "../ProductCard/ProductCard";
import type { Product } from "../ProductCard/ProductCard";
import "./ProductGrid.css";

const ProductGrid = () => {
  // 2. Сделал products динамическим состоянием (State)
  const [products, setProducts] = useState<Product[]>([]);

  // 3. Запуск запрос к бэкенду при загрузке компонента
  useEffect(() => {
    // ВНИМАНИЕ: На бэке должен быть эндпоинт "/products/top" или "/api/products"
    fetch("http://localhost:8000/products/top") 
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ошибка при получении данных с сервера");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data); // Запись пришедших товаров в состояние
      })
      .catch((err) => {
        console.error("Критическая ошибка интеграции:", err);
      });
  }, []);

  return (
    <section className="product-section">
      <h2>Топ продажів</h2>

      {products.length === 0 ? (
        <div className="empty-products">
          Товари завантажуються або відсутні...
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