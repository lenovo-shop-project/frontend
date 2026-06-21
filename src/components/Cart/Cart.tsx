import { useEffect, useState } from "react";
import "./Cart.css";

interface CartProps {
  close: () => void;
}

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

const Cart = ({ close }: CartProps) => {
  const [items, setItems] = useState<CartItem[]>([]);

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

  const checkout = () => {
    if (items.length === 0) return;

    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleString("uk-UA"),
      status: "Оплачено",
      items: items,
      total: total,
    };

    const savedOrders = localStorage.getItem("orders");
    const orders = savedOrders ? JSON.parse(savedOrders) : [];

    localStorage.setItem("orders", JSON.stringify([...orders, newOrder]));
    localStorage.removeItem("cart");

    setItems([]);

    alert("Замовлення оформлено та оплачено!");
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

                    <div className="cart-quantity">
                      <button onClick={() => decreaseQuantity(item.id)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item.id)}>+</button>
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

              <button className="cart-pay-btn" onClick={checkout}>
                Оформити замовлення та оплатити
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;