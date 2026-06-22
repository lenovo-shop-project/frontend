import { useState } from "react";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StorefrontIcon from "@mui/icons-material/Storefront";
import "./DeliveryPaymentPage.css";

interface Props {
  goHome: () => void;
}

const DeliveryPaymentPage = ({ goHome }: Props) => {
  const [tab, setTab] = useState<"delivery" | "payment">("delivery");
  const [city, setCity] = useState("Київ");
  const [deliveryMethod, setDeliveryMethod] = useState("Самовивіз з Нової Пошти");
  const [paymentMethod, setPaymentMethod] = useState("Онлайн оплата Visa/Mastercard");

  const cities = ["Київ", "Дніпро", "Харків", "Львів", "Запоріжжя", "Одеса", "Луцьк"];

  const departments = [
    "Відділення №1: вул. Пирогівський шлях, 135",
    "Відділення №2: вул. Богатирська, 11",
    "Відділення №5: вул. Слобідська, 15",
    "Відділення №14: вул. Верховинна, 69",
    "Відділення №25: вул. Федорова, 32",
  ];

  return (
    <main className="delivery-page">
      <button className="delivery-back" onClick={goHome}>
        ← На головну
      </button>

      <div className="delivery-breadcrumbs">Головна / Доставка та оплата</div>

      <h1>Доставка та оплата</h1>

      <div className="delivery-tabs">
        <button
          className={tab === "delivery" ? "active" : ""}
          onClick={() => setTab("delivery")}
        >
          <LocalShippingIcon />
          Доставка
        </button>

        <button
          className={tab === "payment" ? "active" : ""}
          onClick={() => setTab("payment")}
        >
          <CreditCardIcon />
          Оплата
        </button>
      </div>

      {tab === "delivery" && (
        <>
          <section className="delivery-section">
            <h3>Виберіть місто доставки</h3>

            <select value={city} onChange={(e) => setCity(e.target.value)}>
              {cities.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <div className="city-buttons">
              {cities.map((item) => (
                <button
                  key={item}
                  className={city === item ? "active" : ""}
                  onClick={() => setCity(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className="delivery-section">
            <h3>Виберіть спосіб доставки</h3>

            <div className="delivery-methods">
              {[
                "Самовивіз з Нової Пошти",
                "Кур'єром Нової Пошти",
                "Самовивіз з наших пунктів",
                "Кур'єром Lenovo",
              ].map((item) => (
                <button
                  key={item}
                  className={deliveryMethod === item ? "active" : ""}
                  onClick={() => setDeliveryMethod(item)}
                >
                  <StorefrontIcon />
                  <span>
                    <b>{item}</b>
                    <small>1-3 дні · Безкоштовно</small>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="delivery-details">
            <h3>Деталі та умови доставки</h3>

            <p>
              Доставка займає 1-3 дні. Точну дату доставки після оформлення
              замовлення повідомить менеджер інтернет-магазину.
            </p>

            <ul>
              <li>Замовлення вартістю понад 50 000 грн можна оплатити онлайн.</li>
              <li>Адресна доставка можлива після підтвердження замовлення.</li>
              <li>При отриманні товару необхідно мати документ, що посвідчує особу.</li>
            </ul>
          </section>

          <section className="delivery-section">
            <h3>Відділення Нової Пошти у місті {city}</h3>

            <select>
              <option>Виберіть відділення</option>
              {departments.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <div className="department-list">
              {departments.map((item) => (
                <div key={item}>
                  <b>{item}</b>
                  <span>Щоденно до 20:00</span>
                </div>
              ))}
            </div>
          </section>

          <section className="blue-links">
            <h3>Доступні способи оплати товару</h3>
            <a>Готівкою</a>
            <a>Безготівкова оплата для фізичних осіб</a>
            <a>Онлайн оплата Visa/Mastercard</a>
            <a>Карткою при отриманні</a>
            <a>Кредит або оплата частинами</a>
          </section>
        </>
      )}

      {tab === "payment" && (
        <>
          <section className="payment-methods">
            {[
              "Онлайн оплата Visa/Mastercard",
              "Готівкою",
              "Карткою при отриманні",
              "Кредит або оплата частинами",
              "Безготівкова оплата для фізичних осіб",
            ].map((item) => (
              <button
                key={item}
                className={paymentMethod === item ? "active" : ""}
                onClick={() => setPaymentMethod(item)}
              >
                <CreditCardIcon />
                {item}
              </button>
            ))}
          </section>

          <section className="payment-text">
            <h3>{paymentMethod}</h3>

            <p>
              До оплати на сайті приймаються карти Visa і MasterCard. При
              оформленні замовлення необхідно вибрати зручний спосіб оплати.
            </p>

            <p>
              Після підтвердження замовлення вас буде перенаправлено на
              захищену сторінку банку для оплати.
            </p>

            <h4>Збереження ваших персональних даних гарантується:</h4>

            <ul>
              <li>дотриманням міжнародних стандартів безпеки електронних платежів;</li>
              <li>технологією одноразових паролів One-time password;</li>
              <li>моніторингом платежів 24/7 онлайн.</li>
            </ul>
          </section>

          <section className="blue-links">
            <h3>Доступні способи доставки</h3>
            <a>Самовивіз з Нової Пошти</a>
            <a>Кур'єром Нової Пошти</a>
            <a>Самовивіз з наших пунктів</a>
            <a>Кур'єром Lenovo</a>
          </section>
        </>
      )}
    </main>
  );
};

export default DeliveryPaymentPage;