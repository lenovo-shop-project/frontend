import { useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ProductDetails from "../ProductDetails/ProductDetails";
import {
  addProductToCart,
  FAVORITES_STORAGE_KEY,
  formatProductPrice,
  getProductImage,
  getProductTitle,
  getStoredProducts,
  loadFavoriteProducts,
  PRODUCTS_LIST_CHANGED_EVENT,
  removeFavoriteProduct,
  type StoredProduct,
} from "../../utils/productLists";
import "./FavoritesPanel.css";

interface FavoritesPanelProps {
  close: () => void;
}

const FavoritesPanel = ({ close }: FavoritesPanelProps) => {
  const [products, setProducts] = useState<StoredProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<StoredProduct | null>(null);

  const loadProducts = () => {
    setProducts(getStoredProducts(FAVORITES_STORAGE_KEY));
  };

  const loadProductsFromBackend = async () => {
    const nextProducts = await loadFavoriteProducts();
    setProducts(nextProducts);
  };

  useEffect(() => {
    loadProducts();
    loadProductsFromBackend();

    window.addEventListener(PRODUCTS_LIST_CHANGED_EVENT, loadProducts);
    window.addEventListener("storage", loadProducts);

    return () => {
      window.removeEventListener(PRODUCTS_LIST_CHANGED_EVENT, loadProducts);
      window.removeEventListener("storage", loadProducts);
    };
  }, []);

  const removeProduct = async (productId: number) => {
    await removeFavoriteProduct(productId);
  };

  return (
    <div className="favorites-overlay">
      <div className="favorites-window">
        <button className="favorites-close" onClick={close}>
          ✕
        </button>

        <h2>
          <FavoriteIcon />
          Обране
        </h2>

        {products.length === 0 ? (
          <div className="favorites-empty">
            В обраному поки немає товарів. Натисни сердечко на товарі, щоб додати його сюди.
          </div>
        ) : (
          <div className="favorites-list">
            {products.map((product) => (
              <div className="favorite-card" key={product.id}>
                <div className="favorite-image-box">
                  {getProductImage(product) ? (
                    <img src={getProductImage(product)} alt={getProductTitle(product)} />
                  ) : (
                    <span>Фото немає</span>
                  )}
                </div>

                <div className="favorite-info">
                  <h3>{getProductTitle(product)}</h3>
                  <p className="favorite-price">
                    {formatProductPrice(product.price)} ₴
                  </p>
                  <p className="favorite-meta">
                    ⭐ {product.rating ?? 0} · відгуків: {product.reviewsCount ?? 0}
                  </p>

                  <div className="favorite-actions">
                    <button onClick={() => setSelectedProduct(product)}>
                      Відкрити картку
                    </button>

                    <button onClick={() => addProductToCart(product)}>
                      Додати в кошик
                    </button>

                    <button
                      className="favorite-remove-btn"
                      onClick={() => removeProduct(product.id)}
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          close={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default FavoritesPanel;
