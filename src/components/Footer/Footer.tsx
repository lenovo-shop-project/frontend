import LaptopIcon from "@mui/icons-material/Laptop";
import TabletMacIcon from "@mui/icons-material/TabletMac";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <nav className="footer-top-links">
          <a>Доставка та оплата</a>
          <a>Повернення та обмін</a>
          <a>Гарантійна політика</a>
          <a>Переваги Lenovo Shop</a>
          <a>Контакти</a>
        </nav>

        <div className="footer-contacts">
          <div>
            <p>Контакт-центр з 8:30 до 20:30</p>
            <p>В суботу: з 9:00 до 20:00</p>
            <p>В неділю: з 9:30 до 19:30</p>
          </div>

          <div className="footer-phone">0 800 30 00 33</div>

          <div className="footer-email">online-shop@lenovo.ua</div>
        </div>

        <div className="footer-menu">
          <div className="footer-column">
            <div className="footer-title">
              <LaptopIcon />
              <span>Ноутбуки</span>
            </div>
            <a>Ігрові ноутбуки</a>
            <a>Для бізнесу</a>
            <a>Тонкі і легкі</a>
            <a>Для роботи та навчання</a>
            <a>Мультимедійні</a>
            <a>ThinkPad</a>
            <a>Legion</a>
            <a>Yoga</a>
            <a>IdeaPad</a>
            <a>Ультрабуки</a>
          </div>

          <div className="footer-column">
            <div className="footer-title">
              <TabletMacIcon />
              <span>Планшети</span>
            </div>
            <a>Трансформери</a>
            <a>Планшети з 3G</a>
            <a>Планшети на Windows</a>
            <a>Планшети на Android</a>
          </div>

          <div className="footer-column">
            <div className="footer-title">
              <PhoneIphoneIcon />
              <span>Смартфони</span>
            </div>

            <div className="footer-title second">
              <DesktopWindowsIcon />
              <span>Моноблоки</span>
            </div>

            <div className="footer-title second">
              <DesktopWindowsIcon />
              <span>Настільні ПК</span>
            </div>

            <div className="footer-title second">
              <DesktopWindowsIcon />
              <span>Монітори</span>
            </div>

            <div className="footer-title second">
              <CardGiftcardIcon />
              <span>Аксесуари</span>
            </div>
          </div>

          <div className="footer-column">
            <div className="footer-title portal-title">
              <span className="portal-icon">L</span>
              <span>Портал</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Lenovo Україна</span>
          <a>Конфіденційність</a>
          <a>Правила використання</a>
          <a>Оферта</a>
          <a>Кукі</a>
          <a>Укр⌄</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;