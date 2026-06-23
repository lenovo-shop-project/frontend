import "./ContactsPage.css";

interface Props {
  goHome: () => void;
}

const ContactsPage = ({ goHome }: Props) => {
  return (
    <main className="contacts-page">
      <button className="contacts-back" onClick={goHome}>
        ← На головну
      </button>

      <div className="contacts-breadcrumbs">
        Головна / Контакти
      </div>

      <h1>Контакти</h1>

      <section className="contacts-content">
        <h2>Контактні номери телефонів</h2>

        <ul className="contacts-list">
          <li>
            <b>(0-800) 30-00-33</b> — Гаряча лінія. По Україні безкоштовно.
            <br />
            З 8:30 до 20:30
            <br />
            В суботу: з 9:00 до 20:00
            <br />
            В неділю: з 9:30 до 19:30
          </li>

          <li>
            <b>(044) 390-01-93*</b>
            <br />
            З 8:30 до 20:30
            <br />
            В суботу: з 9:00 до 20:00
            <br />
            В неділю: з 9:30 до 19:30
            <br />
            <small>
              *Вартість дзвінків згідно з тарифом вашого оператора.
            </small>
          </li>

          <li>
            <a
              onClick={() =>
                window.open(
                  "https://service.lenovo.ua/uk/service-centers",
                  "_blank"
                )
              }
            >
              Авторизовані сервісні центри Lenovo в Україні
            </a>
          </li>
        </ul>

        <div className="support-red-box">
          Служба технічної підтримки Lenovo: (0-800) 800-148
        </div>

        <p className="contacts-email-text">
          Усі коментарі та пропозиції щодо співробітництва просимо надсилати
          за адресою:{" "}
          <a href="mailto:online-shop@lenovo.ua">
            online-shop@lenovo.ua
          </a>
        </p>
      </section>
    </main>
  );
};

export default ContactsPage;