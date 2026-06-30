import { useEffect, useState } from "react";
import { salesUrl } from "../../config";
import { showConfirm, showNotification } from "../../utils/notifications";
import "./MyOrders.css";

interface OrderItem {
  id?: number;
  product_id?: number;
  product_name?: string;
  name?: string;
  quantity?: number;
  price?: number;
  unit_price?: number;
}

interface Order {
  id: number;
  status: string;
  total_price?: number;
  total_amount?: number;
  created_at?: string;
  items?: OrderItem[];
}

interface MyOrdersProps {
  close: () => void;
}

const statusUa: Record<string, string> = {
  created: "Створене",
  paid: "Оплачене",
  shipped: "Відправлене",
  completed: "Завершене",
  cancelled: "Скасоване",
};

const MyOrders = ({ close }: MyOrdersProps) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const getLocalOrderStatus = (orderId: number, backendStatus: string) => {
    const savedStatuses = localStorage.getItem("local_order_statuses");
    const statuses = savedStatuses ? JSON.parse(savedStatuses) : {};

    return statuses[orderId] || backendStatus;
  };

  const saveLocalOrderStatus = (orderId: number, status: string) => {
    const savedStatuses = localStorage.getItem("local_order_statuses");
    const statuses = savedStatuses ? JSON.parse(savedStatuses) : {};

    statuses[orderId] = status;

    localStorage.setItem("local_order_statuses", JSON.stringify(statuses));
  };

  const loadOrders = async () => {
    const token =
      localStorage.getItem("access_token") ||
      localStorage.getItem("token");

    const response = await fetch(`${salesUrl}/client/orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.log(
        "ORDERS ERROR:",
        response.status,
        await response.text()
      );

      showNotification("Не вдалося завантажити замовлення", "error");
      return;
    }

    const data = await response.json();

    const ordersWithLocalStatuses = data.map((order: Order) => ({
      ...order,
      status: getLocalOrderStatus(order.id, order.status),
    }));

    console.log("ORDERS:", ordersWithLocalStatuses);

    setOrders(ordersWithLocalStatuses);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const payOrder = async (orderId: number) => {
    const ok = await showConfirm(
      "Оплатити це замовлення?",
      "Оплата замовлення",
      "Оплатити",
      "Скасувати"
    );

    if (!ok) return;

    saveLocalOrderStatus(orderId, "paid");

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "paid",
            }
          : order
      )
    );

    showNotification("Замовлення оплачено", "success");
  };

  const cancelOrder = async (orderId: number) => {
    const ok = await showConfirm(
      "Скасувати це замовлення?",
      "Скасування замовлення",
      "Скасувати замовлення",
      "Назад"
    );

    if (!ok) return;

    const token =
      localStorage.getItem("access_token") ||
      localStorage.getItem("token");

    const response = await fetch(
      `${salesUrl}/client/orders/${orderId}/cancel`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      showNotification(data?.detail || "Не вдалося скасувати замовлення", "error");
      return;
    }

    saveLocalOrderStatus(orderId, "cancelled");

    showNotification("Замовлення скасовано", "success");
    loadOrders();
  };

  return (
    <div className="orders-overlay">
      <div className="orders-window">
        <button 
          className="orders-close" 
          onClick={close}
        >
          ✕
        </button>

        <h2>Мої замовлення</h2>

        {orders.length === 0 ? (
          <div className="orders-empty">
            У вас ще немає замовлень
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div 
                className="order-card" 
                key={order.id}
              >
                <div className="order-card-top">
                  <div>
                    <h3>
                      Замовлення №{order.id}
                    </h3>

                    <p>
                      {order.created_at || "Дата не вказана"}
                    </p>
                  </div>

                  <span 
                    className={`order-status ${order.status}`}
                  >
                    {statusUa[order.status] || order.status}
                  </span>
                </div>

                <div className="order-items">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div 
                        className="order-item" 
                        key={item.id || index}
                      >
                        <span>
                          {
                            item.product_name ||
                            item.name ||
                            `Товар #${item.product_id}`
                          }
                        </span>

                        <span>
                          {item.quantity || 1} шт.
                        </span>

                        <span>
                          {item.price ?? item.unit_price ?? 0} ₴
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="order-no-items">
                      Товари не деталізовані
                    </p>
                  )}
                </div>

                <div className="order-total">
                  Разом: 
                  <b> {order.total_price ?? order.total_amount ?? 0} ₴</b>
                </div>

                {order.status === "created" && (
                  <button
                    className="cancel-order-btn"
                    onClick={() => payOrder(order.id)}
                  >
                    Оплатити
                  </button>
                )}

                {order.status !== "cancelled" &&
                 order.status !== "completed" &&
                 order.status !== "shipped" &&
                 order.status !== "paid" && (
                  <button
                    className="cancel-order-btn"
                    onClick={() => cancelOrder(order.id)}
                  >
                    Скасувати замовлення
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;