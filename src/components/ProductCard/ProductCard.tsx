import { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BalanceIcon from "@mui/icons-material/Balance";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import ChatIcon from "@mui/icons-material/Chat";
import {
  addProductToCart,
  COMPARE_STORAGE_KEY,
  FAVORITES_STORAGE_KEY,
  isProductInList,
  loadFavoriteProducts,
  PRODUCTS_LIST_CHANGED_EVENT,
  toggleFavoriteProduct,
  toggleProductInList,
} from "../../utils/productLists";
import { showNotification } from "../../utils/notifications";
import "./ProductCard.css";

export interface Product {
  id: number;

  name?: string;
  title?: string;

  image_url?: string | null;
  image?: string | null;
  imageUrl?: string | null;

  price: number;

  oldPrice?: number | null;
  rating?: number;
  reviewsCount?: number;
  isSale?: boolean;
  isHit?: boolean;
  bonuses?: number;
  description?: string | null;
  is_available?: boolean;
  isAvailable?: boolean;
  category_id?: number;
  categoryId?: number;
}

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCompared, setIsCompared] = useState(false);

  const productTitle = product.name || product.title || "Без назви";
  const productImage = product.image_url || product.image || product.imageUrl || "";
  const productAvailable = product.is_available ?? product.isAvailable ?? false;

  const syncListState = () => {
    setIsFavorite(isProductInList(FAVORITES_STORAGE_KEY, product.id));
    setIsCompared(isProductInList(COMPARE_STORAGE_KEY, product.id));
  };

  useEffect(() => {
    syncListState();
    loadFavoriteProducts().then(syncListState);

    window.addEventListener(PRODUCTS_LIST_CHANGED_EVENT, syncListState);
    window.addEventListener("storage", syncListState);

    return () => {
      window.removeEventListener(PRODUCTS_LIST_CHANGED_EVENT, syncListState);
      window.removeEventListener("storage", syncListState);
    };
  }, [product.id]);

  const checkIsClientLoggedIn = () => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");

    if (!token) {
      showNotification("Спочатку увійдіть в акаунт", "warning");
      return false;
    }

    return true;
  };

  const toggleFavorite = async () => {
    if (!checkIsClientLoggedIn()) return;

    await toggleFavoriteProduct(product);
  };

  const toggleCompare = () => {
    if (!checkIsClientLoggedIn()) return;

    const added = toggleProductInList(COMPARE_STORAGE_KEY, product);
    showNotification(
      added ? "Товар додано до порівняння" : "Товар прибрано з порівняння",
      added ? "success" : "info"
    );
  };

  return (
    <div className="product-card">
      <div className="product-labels">
        {product.isSale && <span className="sale-label">Акція</span>}
        {product.isHit && <span className="hit-label">Хіт</span>}
      </div>

      <div className="product-icons" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className={isFavorite ? "product-icon-btn active" : "product-icon-btn"}
          onClick={toggleFavorite}
          aria-label="Додати в обране"
          title={isFavorite ? "Прибрати з обраного" : "Додати в обране"}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </button>

        <button
          type="button"
          className={isCompared ? "product-icon-btn active" : "product-icon-btn"}
          onClick={toggleCompare}
          aria-label="Додати до порівняння"
          title={isCompared ? "Прибрати з порівняння" : "Додати до порівняння"}
        >
          <BalanceIcon />
        </button>
      </div>

      <div className="product-image-box">
        {productImage && <img src={productImage} alt={productTitle} />}
      </div>

      <p className="product-title">{productTitle}</p>

      <div className="product-info">
        <span className="available">
          {productAvailable ? "⊕ В наявності" : "Немає в наявності"}
        </span>

        <span className="rating">
          <StarIcon />
          {product.rating ?? 0}
          <ChatIcon />
          {product.reviewsCount ?? 0}
        </span>
      </div>

      {product.oldPrice && (
        <div className="old-price">{product.oldPrice} ₴</div>
      )}

      <div className="product-bottom">
        <div>
          <div className="product-price">{product.price} ₴</div>
          <div className="product-bonus">
            ⓑ +{product.bonuses ?? 0} бонусів
          </div>
        </div>

        <button
          className="cart-button"
          onClick={(event) => {
            event.stopPropagation();
            addProductToCart(product);
          }}
        >
          <ShoppingCartIcon />
        </button>
      </div>

      {product.description && (
        <div className="product-hover-description">
          {product.description}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
