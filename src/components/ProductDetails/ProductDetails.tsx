import { useEffect, useState } from "react";
import "./ProductDetails.css";
import { BASE_URL } from "../../config";
interface Product {
  id: number;
  name?: string;
  title?: string;
  description?: string | null;
  price?: number;
  image_url?: string | null;
  image?: string | null;
  stock?: number;
  is_available?: boolean;
}

interface Review {
  id: number;
  rating?: number;
  text?: string;
  comment?: string;
  user_id?: number;
  created_at?: string;
}

interface Props {
  product: Product;
  close: () => void;
}

const ProductDetails = ({ product, close }: Props) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeOption, setActiveOption] = useState("");

  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const productName = product.name || product.title || "Товар";
  const productImage = product.image_url || product.image || "";
  const productPrice = Number(product.price || 0);

  const loadReviews = async () => {
    try {
      const response = await fetch(`${BASE_URL}/client/products/${product.id}/reviews`);

      if (!response.ok) {
        console.log("REVIEWS LOAD ERROR:", response.status);
        return;
      }

      const data = await response.json();

      console.log("PRODUCT REVIEWS:", data);

      setReviews(Array.isArray(data) ? data : data.reviews || []);
    } catch (error) {
      console.error("REVIEWS ERROR:", error);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [product.id]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("uk-UA");
  };

  const addToCart = () => {
    const oldCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = oldCart.find((item: any) => item.id === product.id);

    const updatedCart = existing
      ? oldCart.map((item: any) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [
          ...oldCart,
          {
            id: product.id,
            title: productName,
            price: productPrice,
            image: productImage,
            quantity: 1,
          },
        ];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert("Товар додано в кошик");
  };

  const createReview = async () => {
    const token =
      localStorage.getItem("access_token") ||
      localStorage.getItem("token");

    if (!token) {
      alert("Щоб залишити відгук, увійдіть в акаунт");
      return;
    }

    if (!reviewText.trim()) {
      alert("Напишіть текст відгуку");
      return;
    }

    const response = await fetch(`${BASE_URL}/client/products/${product.id}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating: reviewRating,
        text: reviewText,
        comment: reviewText,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
  console.log("CREATE REVIEW ERROR:", data);

  if (response.status === 401) {
    alert("Сесія закінчилась. Вийдіть і зайдіть в акаунт заново.");
    return;
  }

  alert(data?.detail || "Не вдалося додати відгук");
  return;
}

    alert("Відгук додано");

    setReviewText("");
    setReviewRating(5);

    loadReviews();
  };

  return (
    <div className="product-details-overlay">
      <div className="product-details-modal">
        <button className="product-details-close" onClick={close}>
          ✕
        </button>

        <div className="product-details-breadcrumbs">
          Головна / Товар / {productName}
        </div>

        <h1>{productName}</h1>

        <div className="product-details-main">
          <div className="product-details-left">
            {productImage ? (
              <img
                className="product-details-image"
                src={productImage}
                alt={productName}
              />
            ) : (
              <div className="product-details-no-image">
                Фото товару відсутнє
              </div>
            )}

            <div className="product-details-description">
              <h2>Опис</h2>
              <p>{product.description || "Опис товару відсутній"}</p>
            </div>
          </div>

          <aside className="product-details-buy">
            <div className="product-badges">
              <div>🎁 Отримай промокод на другу покупку</div>
              <div>🛡️ Преміум гарантія 24 місяці</div>
              <div>🚚 Безкоштовна доставка до дверей</div>
            </div>

            <div className="buy-card">
              <p className="product-available">
                {product.is_available !== false
                  ? "● В наявності"
                  : "● Немає в наявності"}
              </p>

              <div className="product-code">код товару: {product.id}</div>

              <div className="product-details-price">
                {formatPrice(productPrice)} ₴
              </div>

              <div className="bonus-line">
                🪙 +{Math.round(productPrice * 0.01)} бонусів
              </div>

              <button className="details-buy-btn" onClick={addToCart}>
                🛒 Купити
              </button>

              <button className="details-one-click-btn">
                Купити в один клік
              </button>

              <button className="details-credit-btn">
                В кредит від {formatPrice(Math.round(productPrice * 0.1))} ₴/міс
              </button>

              <div className="details-options">
                {["24 міс", "5%", "trade-in", "bonus"].map((item) => (
                  <button
                    key={item}
                    className={activeOption === item ? "selected" : ""}
                    onClick={() => setActiveOption(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="details-info-box">
              <b>🛡️ Преміум гарантія 24 місяці</b>
              <p>Заберемо. Поремонтуємо. Привеземо.</p>
            </div>

            <div className="details-info-box">
              <b>🚚 Безкоштовна доставка до дверей</b>
              <p>Доставка по Україні.</p>
            </div>

            <div className="details-info-box">
              <b>💳 Оплата</b>
              <p>Онлайн, карткою або після огляду.</p>
            </div>
          </aside>
        </div>

        <div className="product-details-reviews">
          <h2>Відгуки</h2>

          <div className="review-form">
            <h3>Залишити відгук</h3>

            <div className="rating-buttons">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  className={reviewRating === num ? "active-rating" : ""}
                  onClick={() => setReviewRating(num)}
                >
                  {num} ⭐
                </button>
              ))}
            </div>

            <textarea
              placeholder="Напишіть ваш відгук"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <button className="send-review-btn" onClick={createReview}>
              Надіслати відгук
            </button>
          </div>

          {reviews.length === 0 ? (
            <p className="no-reviews">Відгуків поки немає</p>
          ) : (
            reviews.map((review) => (
              <div className="review-card" key={review.id}>
                <b>Оцінка: {review.rating || "-"} ⭐</b>
                <p>{review.text || review.comment || "Без тексту"}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
