import { useEffect, useState } from "react";
import {
  CATALOG_API_URL,
  catalogUrl,
  salesUrl,
} from "../../config";
import { showConfirm, showNotification } from "../../utils/notifications";
import "./MyOrders.css";

interface OrderItem {
  id?: number;
  product_id?: number;
  product_name?: string;
  name?: string;
  image_url?: string | null;
  quantity?: number;
  price?: number | string;
  unit_price?: number | string;
}

interface Order {
  id: number;
  status: string;
  total_price?: number | string;
  total_amount?: number | string;
  created_at?: string;
  items?: OrderItem[];
}

interface CatalogProduct {
  id: number;
  name?: string;
  title?: string;
  image_url?: string | null;
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

  const getToken = () => {
    return localStorage.getItem("access_token") ||
      localStorage.getItem("token");
  };

  const getLocalOrderStatus = (
    orderId: number,
    backendStatus: string
  ) => {
    const savedStatuses = localStorage.getItem("local_order_statuses");
    const statuses = savedStatuses ? JSON.parse(savedStatuses) : {};

    return statuses[orderId] || backendStatus;
  };

  const saveLocalOrderStatus = (
    orderId: number,
    status: string
  ) => {
    const savedStatuses = localStorage.getItem("local_order_statuses");
    const statuses = savedStatuses ? JSON.parse(savedStatuses) : {};

    statuses[orderId] = status;

    localStorage.setItem(
      "local_order_statuses",
      JSON.stringify(statuses)
    );
  };

  const getImageUrl = (imageUrl?: string | null) => {
    if (!imageUrl) return "";

    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://") ||
      imageUrl.startsWith("data:") ||
      imageUrl.startsWith("blob:")
    ) {
      return imageUrl;
    }

    const normalizedPath = imageUrl.startsWith("/")
      ? imageUrl
      : `/${imageUrl}`;

    return `${CATALOG_API_URL}${normalizedPath}`;
  };

  const loadOrders = async () => {
    const token = getToken();

    try {
      const response = await fetch(
        salesUrl("/client/orders"),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.log(
          "ORDERS ERROR:",
          response.status,
          await response.text()
        );

        showNotification(
          "Не вдалося завантажити замовлення",
          "error"
        );
        return;
      }

      const data: Order[] = await response.json();

      const productIds = Array.from(
        new Set(
          data.flatMap((order) =>
            (order.items || [])
              .map((item) => item.product_id)
              .filter(
                (productId): productId is number =>
                  typeof productId === "number"
              )
          )
        )
      );

      const products = await Promise.all(
        productIds.map(async (productId) => {
          try {
            const productResponse = await fetch(
              catalogUrl(`/client/products/${productId}`),
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!productResponse.ok) {
              console.warn(
                `PRODUCT ${productId} ERROR:`,
                productResponse.status
              );

              return null;
            }

            return await productResponse.json() as CatalogProduct;
          } catch (error) {
            console.error(
              `LOAD PRODUCT ${productId} ERROR:`,
              error
            );

            return null;
          }
        })
      );

      const productsMap = new Map<number, CatalogProduct>();

      products.forEach((product) => {
        if (product) {
          productsMap.set(Number(product.id), product);
        }
      });

      const ordersWithProductInfo = data.map((order) => ({
        ...order,

        status: getLocalOrderStatus(
          order.id,
          order.status
        ),

        items: (order.items || []).map((item) => {
          const product = item.product_id
            ? productsMap.get(Number(item.product_id))
            : undefined;

          return {
            ...item,

            product_name:
              item.product_name ||
              item.name ||
              product?.name ||
              product?.title,

            image_url:
              item.image_url ||
              product?.image_url ||
              null,
          };
        }),
      }));

      console.log("ORDERS:", ordersWithProductInfo);

      setOrders(ordersWithProductInfo);
    } catch (error) {
      console.error("LOAD ORDERS ERROR:", error);

      showNotification(
        "Не вдалося завантажити замовлення",
        "error"
      );
    }
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

    showNotification(
      "Замовлення оплачено",
      "success"
    );
  };

  const cancelOrder = async (orderId: number) => {
    const ok = await showConfirm(
      "Скасувати це замовлення?",
      "Скасування замовлення",
      "Скасувати замовлення",
      "Назад"
    );

    if (!ok) return;

    const token = getToken();

    const response = await fetch(
      salesUrl(`/client/orders/${orderId}/cancel`),
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      showNotification(
        data?.detail ||
          "Не вдалося скасувати замовлення",
        "error"
      );

      return;
    }

    saveLocalOrderStatus(orderId, "cancelled");

    showNotification(
      "Замовлення скасовано",
      "success"
    );

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
                      {order.created_at ||
                        "Дата не вказана"}
                    </p>
                  </div>

                  <span
                    className={`order-status ${order.status}`}
                  >
                    {statusUa[order.status] ||
                      order.status}
                  </span>
                </div>

                <div className="order-items">
                  {order.items &&
                  order.items.length > 0 ? (
                    order.items.map((item, index) => {
                      const imageUrl = getImageUrl(
                        item.image_url
                      );

                      return (
                        <div
                          className="order-item"
                          key={item.id || index}
                        >
                          <div className="order-product">
                            {imageUrl ? (
                              <img
                                className="order-product-image"
                                src={imageUrl}
                                alt={
                                  item.product_name ||
                                  item.name ||
                                  "Товар"
                                }
                              />
                            ) : (
                              <div className="order-product-placeholder">
                                Немає фото
                              </div>
                            )}

                            <span className="order-product-name">
                              {item.product_name ||
                                item.name ||
                                `Товар #${item.product_id}`}
                            </span>
                          </div>

                          <span>
                            {item.quantity ?? 1} шт.
                          </span>

                          <span>
                            {item.price ??
                              item.unit_price ??
                              0}{" "}
                            ₴
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="order-no-items">
                      Товари не деталізовані
                    </p>
                  )}
                </div>

                <div className="order-total">
                  Разом:
                  <b>
                    {" "}
                    {order.total_price ??
                      order.total_amount ??
                      0}{" "}
                    ₴
                  </b>
                </div>

                {order.status === "created" && (
                  <button
                    className="cancel-order-btn"
                    onClick={() =>
                      payOrder(order.id)
                    }
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
                      onClick={() =>
                        cancelOrder(order.id)
                      }
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