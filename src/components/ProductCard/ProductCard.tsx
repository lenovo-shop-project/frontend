import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BalanceIcon from "@mui/icons-material/Balance";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import ChatIcon from "@mui/icons-material/Chat";
import { BASE_URL } from "../../config";
import "./ProductCard.css";

export interface Product {
  id: number;

  name?: string;
  title?: string;

  image_url?: string | null;
  imageUrl?: string;

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
}

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const productTitle = product.name || product.title || "Без назви";
  const productImage = product.image_url || product.imageUrl || "";
  const productAvailable = product.is_available ?? product.isAvailable ?? false;

  const addToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Спочатку увійдіть в акаунт");
      return;
    }

    const response = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = await response.json();

    const role = String(user.role || "").toLowerCase();

    if (role === "admin" || role === "userrole.admin") {
      alert("Адмін не може додавати товари в кошик");
      return;
    }

    if (!productAvailable) {
      alert("Цього товару немає в наявності");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingProduct = cart.find(
      (item: any) => item.id === product.id
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        title: productTitle,
        price: product.price,
        image: productImage,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Товар додано у кошик");
  };

  return (
    <div className="product-card">
      <div className="product-labels">
        {product.isSale && <span className="sale-label">Акція</span>}
        {product.isHit && <span className="hit-label">Хіт</span>}
      </div>

      <div className="product-icons">
        <FavoriteBorderIcon />
        <BalanceIcon />
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

        <button className="cart-button" onClick={addToCart}>
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