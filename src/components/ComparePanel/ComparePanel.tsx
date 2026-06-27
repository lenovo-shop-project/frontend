import { useEffect, useState } from "react";
import BalanceIcon from "@mui/icons-material/Balance";
import ProductDetails from "../ProductDetails/ProductDetails";
import {
  addProductToCart,
  COMPARE_STORAGE_KEY,
  formatProductPrice,
  getProductImage,
  getProductTitle,
  getStoredProducts,
  PRODUCTS_LIST_CHANGED_EVENT,
  removeProductFromList,
  type StoredProduct,
} from "../../utils/productLists";
import { showNotification } from "../../utils/notifications";
import "./ComparePanel.css";

interface ComparePanelProps {
  close: () => void;
}

const shortDescription = (description?: string | null) => {
  if (!description) return "Опис відсутній";

  return description.length > 120
    ? `${description.slice(0, 120)}...`
    : description;
};

const ComparePanel = ({ close }: ComparePanelProps) => {
  const [products, setProducts] = useState<StoredProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [openedProduct, setOpenedProduct] = useState<StoredProduct | null>(null);

  const loadProducts = () => {
    const nextProducts = getStoredProducts(COMPARE_STORAGE_KEY);
    setProducts(nextProducts);

    if (
      nextProducts.length > 0 &&
      !nextProducts.some((product) => Number(product.id) === Number(selectedProductId))
    ) {
      setSelectedProductId(nextProducts[0].id);
    }
  };

  useEffect(() => {
    loadProducts();

    window.addEventListener(PRODUCTS_LIST_CHANGED_EVENT, loadProducts);
    window.addEventListener("storage", loadProducts);

    return () => {
      window.removeEventListener(PRODUCTS_LIST_CHANGED_EVENT, loadProducts);
      window.removeEventListener("storage", loadProducts);
    };
  }, [selectedProductId]);

  const removeProduct = (productId: number) => {
    removeProductFromList(COMPARE_STORAGE_KEY, productId);
  };

  const addSelectedToCart = () => {
    const selectedProduct = products.find(
      (product) => Number(product.id) === Number(selectedProductId)
    );

    if (!selectedProduct) {
      showNotification("Спочатку оберіть товар для покупки", "warning");
      return;
    }

    addProductToCart(selectedProduct);
  };

  return (
    <div className="compare-overlay">
      <div className="compare-window">
        <button className="compare-close" onClick={close}>
          ✕
        </button>

        <div className="compare-header">
          <h2>
            <BalanceIcon />
            Порівняння
          </h2>

          {products.length > 0 && (
            <button className="compare-main-cart-btn" onClick={addSelectedToCart}>
              Додати вибраний у кошик
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <div className="compare-empty">
            У порівнянні поки немає товарів. Натисни іконку вагів на товарі, щоб додати його сюди.
          </div>
        ) : (
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Обрати</th>
                  <th>Товар</th>
                  <th>Ціна</th>
                  <th>Рейтинг</th>
                  <th>Відгуки</th>
                  <th>Опис</th>
                  <th>Дії</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <input
                        type="radio"
                        name="compare-product"
                        checked={Number(selectedProductId) === Number(product.id)}
                        onChange={() => setSelectedProductId(product.id)}
                      />
                    </td>

                    <td>
                      <div className="compare-product-cell">
                        <div className="compare-product-image">
                          {getProductImage(product) ? (
                            <img src={getProductImage(product)} alt={getProductTitle(product)} />
                          ) : (
                            <span>Фото немає</span>
                          )}
                        </div>

                        <b>{getProductTitle(product)}</b>
                      </div>
                    </td>

                    <td>{formatProductPrice(product.price)} ₴</td>
                    <td>⭐ {product.rating ?? 0}</td>
                    <td>{product.reviewsCount ?? 0}</td>
                    <td className="compare-description">
                      {shortDescription(product.description)}
                    </td>

                    <td>
                      <div className="compare-actions">
                        <button onClick={() => setOpenedProduct(product)}>
                          Картка
                        </button>

                        <button onClick={() => addProductToCart(product)}>
                          В кошик
                        </button>

                        <button
                          className="compare-remove-btn"
                          onClick={() => removeProduct(product.id)}
                        >
                          Видалити
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {openedProduct && (
        <ProductDetails
          product={openedProduct}
          close={() => setOpenedProduct(null)}
        />
      )}
    </div>
  );
};

export default ComparePanel;
