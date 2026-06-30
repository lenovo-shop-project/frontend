import { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BalanceIcon from "@mui/icons-material/Balance";
import "./ProductDetails.css";
import { authUrl, catalogUrl } from "../../config";
import { showConfirm, showNotification } from "../../utils/notifications";
import {
  COMPARE_STORAGE_KEY,
  FAVORITES_STORAGE_KEY,
  isProductInList,
  loadFavoriteProducts,
  PRODUCTS_LIST_CHANGED_EVENT,
  toggleFavoriteProduct,
  toggleProductInList,
} from "../../utils/productLists";

interface Product {
  id: number;
  name?: string;
  title?: string;
  description?: string | null;
  price?: number;
  image_url?: string | null;
  image?: string | null;
  imageUrl?: string | null;
  stock?: number;
  is_available?: boolean;
}

interface ReviewUser {
  id?: number;
  email?: string;
}

interface Review {
  id: number;
  rating?: number;
  text?: string;
  comment?: string;
  user_id?: number;
  owner_id?: number;
  author_id?: number;
  user?: ReviewUser;
  created_at?: string;
  admin_response?: string | null;
  admin_reply?: string | null;
  answer?: string | null;
  admin_response_created_at?: string | null;
}

interface CurrentUser {
  id?: number;
  email?: string;
  role?: string;
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

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewRating, setEditReviewRating] = useState(5);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCompared, setIsCompared] = useState(false);

  const productName = product.name || product.title || "Товар";
  const productImage = product.image_url || product.image || product.imageUrl || "";
  const productPrice = Number(product.price || 0);
  const CREDIT_MONTHS = 10;
  const creditMonthlyPayment = Math.round(productPrice * 0.1);
  const creditTotalPrice = creditMonthlyPayment * CREDIT_MONTHS;

  const getToken = () => {
    return localStorage.getItem("access_token") || localStorage.getItem("token");
  };

  const loadCurrentUser = async () => {
    const token = getToken();

    if (!token) {
      setCurrentUser(null);
      return;
    }

    try {
      const response = await fetch(authUrl("/auth/me"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setCurrentUser(null);
        return;
      }

      const user = await response.json();
      setCurrentUser(user);
    } catch (error) {
      console.error("CURRENT USER ERROR:", error);
      setCurrentUser(null);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await fetch(
        catalogUrl(`/client/products/${product.id}/reviews`)
      );

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

  const syncListState = () => {
    setIsFavorite(isProductInList(FAVORITES_STORAGE_KEY, product.id));
    setIsCompared(isProductInList(COMPARE_STORAGE_KEY, product.id));
  };

  useEffect(() => {
    loadReviews();
    loadCurrentUser();
    setEditingReviewId(null);
    setEditReviewText("");
    setEditReviewRating(5);
    syncListState();
    loadFavoriteProducts().then(syncListState);

    window.addEventListener(PRODUCTS_LIST_CHANGED_EVENT, syncListState);
    window.addEventListener("storage", syncListState);

    return () => {
      window.removeEventListener(PRODUCTS_LIST_CHANGED_EVENT, syncListState);
      window.removeEventListener("storage", syncListState);
    };
  }, [product.id]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("uk-UA");
  };

  const getReviewText = (review: Review) => {
    return review.text || review.comment || "";
  };

  const getAdminResponse = (review: Review) => {
    return review.admin_response || review.admin_reply || review.answer || "";
  };

  const getReviewOwnerId = (review: Review) => {
    return review.user_id ?? review.owner_id ?? review.author_id ?? review.user?.id;
  };

  const canEditReview = (review: Review) => {
    const currentUserId = currentUser?.id;
    const reviewOwnerId = getReviewOwnerId(review);
    const role = String(currentUser?.role || "").toLowerCase();

    if (!currentUserId || !reviewOwnerId) return false;
    if (role === "admin" || role === "userrole.admin") return false;

    return Number(currentUserId) === Number(reviewOwnerId);
  };

  const checkIsClientLoggedIn = () => {
    const token = getToken();

    if (!token) {
      showNotification("Спочатку увійдіть в акаунт", "warning");
      return false;
    }

    return true;
  };

  const toggleFavorite = async () => {
    if (!checkIsClientLoggedIn()) return;

    await toggleFavoriteProduct({
      ...product,
      price: productPrice,
    });
  };

  const toggleCompare = () => {
    if (!checkIsClientLoggedIn()) return;

    const added = toggleProductInList(COMPARE_STORAGE_KEY, {
      ...product,
      price: productPrice,
    });

    showNotification(
      added ? "Товар додано до порівняння" : "Товар прибрано з порівняння",
      added ? "success" : "info"
    );
  };

  const checkCanAddToCart = async () => {
    const token = getToken();

    if (!token) {
      showNotification("Спочатку увійдіть в акаунт", "warning");
      return false;
    }

    try {
      const response = await fetch(authUrl("/auth/me"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        showNotification("Сесія закінчилась. Вийдіть і зайдіть в акаунт заново.", "error");
        return false;
      }

      const user = await response.json();
      const role = String(user.role || "").toLowerCase();

      if (role === "admin" || role === "userrole.admin") {
        showNotification("Адмін не може додавати товари в кошик", "warning");
        return false;
      }
    } catch (error) {
      console.error("CHECK USER ERROR:", error);
      showNotification("Не вдалося перевірити користувача", "error");
      return false;
    }

    if (product.is_available === false) {
      showNotification("Цього товару немає в наявності", "warning");
      return false;
    }

    return true;
  };

  const addItemToCart = (cartItem: {
    id: number;
    product_id?: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
    credit?: boolean;
    months?: number;
    monthlyPayment?: number;
  }) => {
    const oldCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = oldCart.find((item: any) => item.id === cartItem.id);

    const updatedCart = existing
      ? oldCart.map((item: any) =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...oldCart, cartItem];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const addToCart = async () => {
    const canAdd = await checkCanAddToCart();

    if (!canAdd) return;

    addItemToCart({
      id: product.id,
      title: productName,
      price: productPrice,
      image: productImage,
      quantity: 1,
    });

    showNotification("Товар додано в кошик", "success");
  };

  const addCreditToCart = async () => {
    const canAdd = await checkCanAddToCart();

    if (!canAdd) return;

    addItemToCart({
      id: product.id * 1000 + CREDIT_MONTHS,
      product_id: product.id,
      title: `${productName} (кредит ${CREDIT_MONTHS} міс)`,
      price: creditTotalPrice,
      image: productImage,
      quantity: 1,
      credit: true,
      months: CREDIT_MONTHS,
      monthlyPayment: creditMonthlyPayment,
    });

    showNotification(
      `Товар у кредит додано в кошик. Сума: ${formatPrice(creditTotalPrice)} ₴`,
      "success"
    );
  };

  const createReview = async () => {
    const token = getToken();

    if (!token) {
      showNotification("Щоб залишити відгук, увійдіть в акаунт", "warning");
      return;
    }

    if (!reviewText.trim()) {
      showNotification("Напишіть текст відгуку", "warning");
      return;
    }

    const response = await fetch(
      catalogUrl(`/client/products/${product.id}/reviews`),
      {
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
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.log("CREATE REVIEW ERROR:", data);

      if (response.status === 401) {
        showNotification("Сесія закінчилась. Вийдіть і зайдіть в акаунт заново.", "error");
        return;
      }

      showNotification(data?.detail || "Не вдалося додати відгук", "error");
      return;
    }

    showNotification("Відгук додано", "success");

    setReviewText("");
    setReviewRating(5);

    loadReviews();
  };

  const startEditReview = (review: Review) => {
    setEditingReviewId(review.id);
    setEditReviewText(getReviewText(review));
    setEditReviewRating(review.rating || 5);
  };

  const cancelEditReview = () => {
    setEditingReviewId(null);
    setEditReviewText("");
    setEditReviewRating(5);
  };

  const updateReview = async (reviewId: number) => {
    const token = getToken();

    if (!token) {
      showNotification("Щоб редагувати відгук, увійдіть в акаунт", "warning");
      return;
    }

    if (!editReviewText.trim()) {
      showNotification("Текст відгуку не може бути порожнім", "warning");
      return;
    }

    const response = await fetch(catalogUrl(`/client/reviews/${reviewId}`), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating: editReviewRating,
        text: editReviewText,
        comment: editReviewText,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.log("UPDATE REVIEW ERROR:", data);
      showNotification(data?.detail || "Не вдалося змінити відгук", "error");
      return;
    }

    showNotification("Відгук змінено", "success");
    cancelEditReview();
    loadReviews();
  };

  const deleteReview = async (reviewId: number) => {
    const token = getToken();

    if (!token) {
      showNotification("Щоб видалити відгук, увійдіть в акаунт", "warning");
      return;
    }

    const confirmed = await showConfirm(
      "Видалити цей відгук?",
      "Видалення відгуку",
      "Видалити",
      "Скасувати"
    );

    if (!confirmed) return;

    const response = await fetch(catalogUrl(`/client/reviews/${reviewId}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.log("DELETE REVIEW ERROR:", data);
      showNotification(data?.detail || "Не вдалося видалити відгук", "error");
      return;
    }

    showNotification("Відгук видалено", "success");

    if (editingReviewId === reviewId) {
      cancelEditReview();
    }

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

        <div className="product-details-title-row">
          <h1>{productName}</h1>

          <div className="product-details-actions">
            <button
              type="button"
              className={isFavorite ? "details-icon-action active" : "details-icon-action"}
              onClick={toggleFavorite}
            >
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              {isFavorite ? "В обраному" : "В обране"}
            </button>

            <button
              type="button"
              className={isCompared ? "details-icon-action active" : "details-icon-action"}
              onClick={toggleCompare}
            >
              <BalanceIcon />
              {isCompared ? "У порівнянні" : "Порівняти"}
            </button>
          </div>
        </div>

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

              <button className="details-credit-btn" onClick={addCreditToCart}>
                В кредит від {formatPrice(creditMonthlyPayment)} ₴/міс
              </button>

              <div className="details-options">
                {["10 міс", "5%", "trade-in", "bonus"].map((item) => (
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
                {editingReviewId === review.id ? (
                  <div className="review-edit-form">
                    <b>Редагування відгуку</b>

                    <div className="rating-buttons edit-rating-buttons">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          className={editReviewRating === num ? "active-rating" : ""}
                          onClick={() => setEditReviewRating(num)}
                        >
                          {num} ⭐
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={editReviewText}
                      onChange={(e) => setEditReviewText(e.target.value)}
                    />

                    <div className="review-actions">
                      <button
                        className="review-save-btn"
                        onClick={() => updateReview(review.id)}
                      >
                        Зберегти
                      </button>

                      <button
                        className="review-cancel-btn"
                        onClick={cancelEditReview}
                      >
                        Скасувати
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="review-card-top">
                      <b>Оцінка: {review.rating || "-"} ⭐</b>

                      {canEditReview(review) && (
                        <div className="review-actions">
                          <button
                            className="review-edit-btn"
                            onClick={() => startEditReview(review)}
                          >
                            Редагувати
                          </button>

                          <button
                            className="review-delete-btn"
                            onClick={() => deleteReview(review.id)}
                          >
                            Видалити
                          </button>
                        </div>
                      )}
                    </div>

                    <p>{getReviewText(review) || "Без тексту"}</p>

                    {getAdminResponse(review) && (
                      <div className="review-admin-response">
                        <b>Відповідь адміністратора:</b>
                        <p>{getAdminResponse(review)}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;