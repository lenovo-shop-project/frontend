import { useState, useEffect } from "react";
import ProductCard from "../ProductCard/ProductCard";
import type { Product } from "../ProductCard/ProductCard";
import "./ProductGrid.css";

interface ProductGridProps {
  title?: string;
  categoryKeyword?: string;
  showPagination?: boolean;
  filterType?: "default" | "tablet" | "motorola";
}

const getFilterList = (filterType: "default" | "tablet" | "motorola") => {
  if (filterType === "motorola") {
    return [
      "Серія",
      "Модель",
      "Дисплей",
      "Діагональ екрана",
      "Тип матриці",
      "Макс. роздільна здатність",
      "Захист",
      "Процесор",
      "Пам'ять",
      "ПЗП Обсяг, ГБ",
      "Бездротові мережі",
      "NFC-чіп",
      "Модуль GPS",
      "Інтерфейси",
      "Датчики",
      "Тип",
      "Ємність акумулятора, мА*год",
      "Рік випуску",
      "Версія ОС",
      "Пило-, вологозахист",
    ];
  }

  if (filterType === "tablet") {
    return [
      "Модель",
      "Дисплей",
      "Діагональ екрана",
      "Тип матриці",
      "Роздільна здатність екрану",
      "Частота оновлення",
      "Покриття екрану",
      "Захист",
      "Датчики",
      "Процесор",
      "Пам'ять",
      "К-ть ядер, шт.",
      "Частота, ГГц",
      "ПЗП Обсяг, ГБ",
      "Бездротові мережі",
      "NFC-чіп",
      "GPS-модуль",
      "Акумулятор",
      "Тип",
      "Ємність, мА*год",
      "Час роботи",
      "Камера",
      "Тильна, Мпікс",
      "WEB-камера, Мпікс",
      "Інше",
      "Наявність стилуса",
      "Док-станція",
      "Операційна система",
      "Версія ОС",
    ];
  }

  return [
    "Серія",
    "Модель",
    "Процесор",
    "Відеоадаптер",
    "Пам'ять",
    "Дисплей",
    "Накопичувач",
    "AI процесор",
    "Предустановлена ОС",
    "Автономність",
    "Клавіатура",
    "Бездротові мережі",
    "Корпус",
    "Розміри",
  ];
};

const getLineOptions = (filterType: "default" | "tablet" | "motorola") => {
  if (filterType === "motorola") {
    return ["Всі", "Edge", "Razr", "Moto G"];
  }

  if (filterType === "tablet") {
    return ["Всі", "Legion", "Yoga Tab", "Idea Tab", "Lenovo Tab"];
  }

  return ["Всі", "ThinkPad", "ThinkBook", "Legion", "LOQ", "Yoga", "IdeaPad"];
};

const ProductGrid = ({
  title = "Топ продажів",
  categoryKeyword = "",
  showPagination = false,
  filterType = "default",
}: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([]);

  const [page, setPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(12);

  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sort, setSort] = useState("default");
  const [priceFilter, setPriceFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");

  useEffect(() => {
    fetch("/api/client/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ошибка при получении данных с сервера");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error("Критическая ошибка интеграции:", err);
      });
  }, []);

  let filteredProducts = products.filter((product: any) => {
    const name = String(product.name || product.title || "").toLowerCase();
    const description = String(product.description || "").toLowerCase();

    if (categoryKeyword) {
      const keyword = categoryKeyword.toLowerCase();

      if (!name.includes(keyword) && !description.includes(keyword)) {
        return false;
      }
    }

    if (onlyAvailable && !product.is_available) {
      return false;
    }

    if (brandFilter && brandFilter !== "Всі") {
      if (!name.includes(brandFilter.toLowerCase())) {
        return false;
      }
    }

    if (priceFilter === "cheap" && product.price > 30000) {
      return false;
    }

    if (
      priceFilter === "middle" &&
      (product.price < 30000 || product.price > 60000)
    ) {
      return false;
    }

    if (priceFilter === "expensive" && product.price < 60000) {
      return false;
    }

    return true;
  });

  if (sort === "cheap") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  }

  if (sort === "expensive") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  const perPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / perPage);

  const paginatedProducts = showPagination
    ? filteredProducts.slice((page - 1) * perPage, page * perPage)
    : filteredProducts.slice(0, visibleCount);

  const lineOptions = getLineOptions(filterType);
  const filterList = getFilterList(filterType);

  return (
    <section className="product-section">
      <h2>{title}</h2>

      {showPagination ? (
        <div className="category-layout">
          <aside className="category-filters">
            <div className="filters-found">
              Знайдено {filteredProducts.length} товарів
            </div>

            <div className="filter-block">
              <div className="filter-title">За ціною</div>

              <label>
                <input
                  type="radio"
                  name="price"
                  checked={priceFilter === ""}
                  onChange={() => setPriceFilter("")}
                />
                Всі
              </label>

              <label>
                <input
                  type="radio"
                  name="price"
                  checked={priceFilter === "cheap"}
                  onChange={() => setPriceFilter("cheap")}
                />
                до 30000
              </label>

              <label>
                <input
                  type="radio"
                  name="price"
                  checked={priceFilter === "middle"}
                  onChange={() => setPriceFilter("middle")}
                />
                30000 - 60000
              </label>

              <label>
                <input
                  type="radio"
                  name="price"
                  checked={priceFilter === "expensive"}
                  onChange={() => setPriceFilter("expensive")}
                />
                від 60000
              </label>
            </div>

            <div className="filter-block">
              <div className="filter-title">
                {filterType === "tablet" ? "Лінійка" : "Лінійка"}
              </div>

              {lineOptions.map((item) => (
                <label key={item}>
                  <input
                    type="radio"
                    name="brand"
                    checked={
                      item === "Всі"
                        ? brandFilter === ""
                        : brandFilter === item
                    }
                    onChange={() =>
                      setBrandFilter(item === "Всі" ? "" : item)
                    }
                  />
                  {item}
                </label>
              ))}
            </div>

            {filterList.map((item) => (
              <div className="filter-closed" key={item}>
                {item} <span>+</span>
              </div>
            ))}
          </aside>

          <div className="category-products">
            <div className="category-top-row">
              <span>Знайдено {filteredProducts.length} товарів</span>

              <div className="category-sort">
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="default">Сортування: за замовчуванням</option>
                  <option value="cheap">Спочатку дешевші</option>
                  <option value="expensive">Спочатку дорожчі</option>
                </select>

                <label>
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                  />
                  В наявності
                </label>
              </div>
            </div>

            <div className="product-grid">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="pagination-box">
              <p>
                Показано {paginatedProducts.length} із {filteredProducts.length}
              </p>

              {visibleCount < filteredProducts.length && (
                <button
                  className="show-more-btn"
                  onClick={() => setVisibleCount(visibleCount + 12)}
                >
                  ⟳ Показати ще
                </button>
              )}

              <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                  ‹
                </button>

                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    className={page === index + 1 ? "active-page" : ""}
                    onClick={() => setPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  disabled={page === totalPages || totalPages === 0}
                  onClick={() => setPage(page + 1)}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="product-grid">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;