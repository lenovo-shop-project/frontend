import { useState, useEffect } from "react";
import ProductCard from "../ProductCard/ProductCard";
import type { Product } from "../ProductCard/ProductCard";
import "./ProductGrid.css";
import { BASE_URL } from "../../config";
import ProductDetails from "../ProductDetails/ProductDetails";
type FilterType = "default" | "tablet" | "motorola" | "simple";

interface ProductGridProps {
  title?: string;
  categoryKeyword?: string;
  categoryId?: number;
  showPagination?: boolean;
  filterType?: FilterType;
  onClose?: () => void;
}

const getLineOptions = (filterType: FilterType) => {
  if (filterType === "simple") {
    return [];
  }

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
  categoryId,
  showPagination = false,
  filterType = "default",
  onClose,
}: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(10);
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sort, setSort] = useState("default");
  const [brandFilter, setBrandFilter] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/client/products`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ошибка при получении данных с сервера");
        }

        return res.json();
      })
      .then((data) => {
        if (!showPagination && title === "Топ продажів") {
          const randomProducts = [...data]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);

          setProducts(randomProducts);
        } else {
          setProducts(data);
        }
      })
      .catch((err) => {
        console.error("Критическая ошибка интеграции:", err);
      });
  }, []);

  useEffect(() => {
    setPage(1);
    setVisibleCount(10);
    setSort("default");
    setBrandFilter("");
    setMinPrice("");
    setMaxPrice("");
  }, [title, categoryKeyword, categoryId, filterType, showPagination]);

  let filteredProducts = products.filter((product: any) => {
    const name = String(product.name || product.title || "").toLowerCase();
    const description = String(product.description || "").toLowerCase();

    const productCategoryId =
      product.category_id ??
      product.categoryId ??
      product.category?.id;

    if (categoryId && Number(productCategoryId) !== Number(categoryId)) {
      return false;
    }

    if (categoryKeyword) {
      const keywords = categoryKeyword
        .toLowerCase()
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean);

      const textForSearch = `${name} ${description}`;

      if (!keywords.some((keyword) => textForSearch.includes(keyword))) {
        return false;
      }
    }


    if (brandFilter && brandFilter !== "Всі") {
      if (!name.includes(brandFilter.toLowerCase())) {
        return false;
      }
    }

    if (minPrice && product.price < Number(minPrice)) {
      return false;
    }

    if (maxPrice && product.price > Number(maxPrice)) {
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

  return (
    <section
      className="product-section"
      id={showPagination ? "product-grid-anchor" : undefined}
    >
      <h2>{title}</h2>

      {showPagination ? (
        <div className="category-layout">
          <aside className="category-filters">
            <div className="filters-found">
              Знайдено {filteredProducts.length} товарів
            </div>

            <div className="filter-block">
              <div className="filter-title">Ціна</div>

              <div className="price-range-box">
                <input
                  type="number"
                  placeholder="від"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                />

                <input
                  type="number"
                  placeholder="до"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <button
                className="clear-price-btn"
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                  setPage(1);
                }}
              >
                Очистити
              </button>
            </div>

            {filterType !== "simple" && (
              <div className="filter-block">
                <div className="filter-title">Лінійка</div>

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
                      onChange={() => {
                        setBrandFilter(item === "Всі" ? "" : item);
                        setPage(1);
                      }}
                    />
                    {item}
                  </label>
                ))}
              </div>
            )}
          </aside>

          <div className="category-products">
            <div className="category-top-row">
              <span>Знайдено {filteredProducts.length} товарів</span>

              <div className="category-sort">
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="default">Сортування: за замовчуванням</option>
                  <option value="cheap">Спочатку дешевші</option>
                  <option value="expensive">Спочатку дорожчі</option>
                </select>

                {onClose && (
                  <button
                    type="button"
                    className="category-close-btn"
                    onClick={onClose}
                    aria-label="Закрити сторінку пошуку"
                    title="Закрити"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="product-grid">
              {paginatedProducts.map((product) => (
  <div
    key={product.id}
    className="product-card-click"
    onClick={(event) => {
      const target = event.target as HTMLElement;

      if (target.closest("button") || target.closest(".product-icons")) {
        return;
      }

      setSelectedProduct(product);
    }}
  >
    <ProductCard product={product} />
  </div>
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
  <div
    key={product.id}
    className="product-card-click"
    onClick={(event) => {
      const target = event.target as HTMLElement;

      if (target.closest("button") || target.closest(".product-icons")) {
        return;
      }

      setSelectedProduct(product);
    }}
  >
    <ProductCard product={product} />
  </div>
))}
        </div>
      )}
      {selectedProduct && (
  <ProductDetails
    product={selectedProduct}
    close={() => setSelectedProduct(null)}
  />
)}
    </section>
  );
};

export default ProductGrid;