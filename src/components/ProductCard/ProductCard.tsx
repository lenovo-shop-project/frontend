import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BalanceIcon from "@mui/icons-material/Balance";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import ChatIcon from "@mui/icons-material/Chat";
import "./ProductCard.css";

export interface Product {
  id: number;
  title: string;
  imageUrl: string;
  price: number;
  oldPrice?: number | null;
  rating?: number;
  reviewsCount?: number;
  isSale?: boolean;
  isHit?: boolean;
  isAvailable?: boolean;
  bonuses?: number;
}

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
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
        <img src={product.imageUrl} alt={product.title} />
      </div>

      <p className="product-title">{product.title}</p>

      <div className="product-info">
        <span className="available">
          {product.isAvailable ? "⊕ В наявності" : "Немає в наявності"}
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
          <div className="product-bonus">ⓑ +{product.bonuses ?? 0} бонусів</div>
        </div>

        <button className="cart-button">
          <ShoppingCartIcon />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;