import { useEffect, useState } from "react";
import { authUrl, salesUrl } from "../../config";
import { showNotification } from "../../utils/notifications";
import "./Cart.css";

interface CartProps {
  close: () => void;
}

interface CartItem {
  id: number;
  product_id?: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  credit?: boolean;
  months?: number;
  monthlyPayment?: number;
}

const ORDER_CONTACT_EMAILS_KEY = "order_contact_emails";

const Cart = ({ close }: CartProps) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderEmail, setOrderEmail] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
  };

  const getToken = () => {
    return localStorage.getItem("access_token") || localStorage.getItem("token");
  };

  const increaseQuantity = (id: number) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );

    saveCart(newItems);
  };

  const decreaseQuantity = (id: number) => {
    const newItems = items
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);

    saveCart(newItems);
  };

  const removeItem = (id: number) => {
    const newItems = items.filter((item) => item.id !== id);
    saveCart(newItems);
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const getAccountEmail = async () => {
    const token = getToken();

    if (!token) return "";

    try {
      setIsEmailLoading(true);

      const response = await fetch(authUrl("/auth/me"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return "";

      const user = await response.json();

      return String(user.email || "").trim();
    } catch (error) {
      console.error("GET ACCOUNT EMAIL ERROR:", error);
      return "";
    } finally {
      setIsEmailLoading(false);
    }
  };

  const openOrderModal = async () => {
    if (items.length === 0) return;

    const token = getToken();

    if (!token) {
      showNotification("Спочатку увійдіть в акаунт", "warning");
      return;
    }

    setIsOrderModalOpen(true);

    if (!orderEmail.trim()) {
      const accountEmail = await getAccountEmail();
      setOrderEmail(accountEmail);
    }
  };

  const closeOrderModal = () => {
    if (isSubmittingOrder) return;

    setIsOrderModalOpen(false);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const saveOrderContactEmail = (
    orderId: number | string | undefined,
    email: string
  ) => {
    if (!orderId || !email.trim()) return;

    try {
      const saved = localStorage.getItem(ORDER_CONTACT_EMAILS_KEY);
      const parsed = saved ? JSON.parse(saved) : {};

      localStorage.setItem(
        ORDER_CONTACT_EMAILS_KEY,
        JSON.stringify({
          ...parsed,
          [String(orderId)]: email.trim(),
        })
      );
    } catch (error) {
      console.error("SAVE ORDER CONTACT EMAIL ERROR:", error);
    }
  };

  const createOrderRequest = async (body: object, token: string) => {
    const response = await fetch(salesUrl("/client/orders"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);

    return { response, data };
  };

  const submitOrder = async () => {
    if (items.length === 0) return;

    const token = getToken();

    if (!token) {
      showNotification("Спочатку увійдіть в акаунт", "warning");
      return;
    }

    const preparedEmail = orderEmail.trim();

    if (!isValidEmail(preparedEmail)) {
      showNotification("Введіть коректний email для уточнення доставки", "warning");
      return;
    }

    const orderItems = items.map((item) => ({
      product_id: item.product_id || item.id,
      quantity: item.quantity,
    }));

    setIsSubmittingOrder(true);

    try {
      const orderBodyWithEmail = {
        items: orderItems,
        contact_email: preparedEmail,
      };

      console.log("CREATE ORDER BODY:", orderBodyWithEmail);

      let { response, data } = await createOrderRequest(orderBodyWithEmail, token);

      if (!response.ok && response.status === 422) {
        console.warn(
          "Backend does not accept contact_email yet. Retrying order without extra email field."
        );

        ({ response, data } = await createOrderRequest(
          { items: orderItems },
          token
        ));
      }

      console.log("CREATE ORDER RESPONSE:", data);

      if (!response.ok) {
        showNotification(data?.detail || "Не вдалося оформити замовлення", "error");
        return;
      }

      saveOrderContactEmail(data?.id || data?.order_id, preparedEmail);

      localStorage.removeItem("cart");
      setItems([]);
      setIsOrderModalOpen(false);

      showNotification(
        "Замовлення оформлено. Ми використаємо цей email для уточнення доставки.",
        "success"
      );
      close();
    } catch (error) {
      console.error("CREATE ORDER ERROR:", error);
      showNotification("Не вдалося оформити замовлення", "error");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <div className="cart-overlay">
      <div className="cart-window">
        <div className="cart-header">
          <h2>Кошик</h2>
          <button onClick={close}>×</button>
        </div>

        {items.length === 0 ? (
          <p className="cart-empty">Кошик поки порожній</p>
        ) : (
          <>
            <div className="cart-list">
              {items.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.title} />

                  <div className="cart-info">
                    <h4>{item.title}</h4>
                    <p>{item.price} грн</p>

                    {item.credit && item.months && item.monthlyPayment && (
                      <p className="cart-credit-info">
                        Кредит: {item.monthlyPayment} грн/міс × {item.months} платежів
                      </p>
                    )}

                    <div className="cart-quantity">
                      <button onClick={() => decreaseQuantity(item.id)}>
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button onClick={() => increaseQuantity(item.id)}>
                        +
                      </button>
                    </div>

                    <button
                      className="cart-remove"
                      onClick={() => removeItem(item.id)}
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <h3>Разом: {total} грн</h3>

              <button className="cart-pay-btn" onClick={openOrderModal}>
                Оформити замовлення
              </button>
            </div>
          </>
        )}
      </div>

      {isOrderModalOpen && (
        <div className="order-modal-backdrop" onMouseDown={closeOrderModal}>
          <div className="order-modal" onMouseDown={(event) => event.stopPropagation()}>
            <button
              className="order-modal-close"
              onClick={closeOrderModal}
              disabled={isSubmittingOrder}
            >
              ×
            </button>

            <h3>Підтвердження замовлення</h3>

            <p>
              Введіть актуальний email для уточнення доставки, оплати або
              наявності товару.
            </p>

            <label>Email для звʼязку</label>
            <input
              type="email"
              value={orderEmail}
              onChange={(event) => setOrderEmail(event.target.value)}
              placeholder="example@mail.com"
              disabled={isSubmittingOrder || isEmailLoading}
            />

            {isEmailLoading && (
              <span className="order-email-loading">
                Підставляємо email з акаунта...
              </span>
            )}

            <div className="order-modal-total">
              До замовлення: <b>{total} грн</b>
            </div>

            <button
              className="order-submit-btn"
              onClick={submitOrder}
              disabled={isSubmittingOrder}
            >
              {isSubmittingOrder ? "Оформлюємо..." : "Підтвердити замовлення"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;