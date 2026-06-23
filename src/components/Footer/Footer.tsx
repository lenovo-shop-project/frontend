import LaptopIcon from "@mui/icons-material/Laptop";
import TabletMacIcon from "@mui/icons-material/TabletMac";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import "./Footer.css";

interface FooterProps {
  openDeliveryPaymentPage?: () => void;
  openReturnExchangePage?: () => void;
  openBenefitsPage?: () => void;
  openContactsPage?: () => void;
  openSearchCategory?: (
    title: string,
    keyword: string,
    categoryId?: number
  ) => void;
}

const Footer = ({
  openDeliveryPaymentPage,
  openReturnExchangePage,
  openBenefitsPage,
  openContactsPage,
  openSearchCategory,
}: FooterProps) => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <nav className="footer-top-links">
          <a onClick={openDeliveryPaymentPage}>Доставка та оплата</a>
          <a onClick={openReturnExchangePage}>Повернення та обмін</a>

          <a
            onClick={() =>
              window.open("https://shop.lenovo.ua/warranty-policy", "_blank")
            }
          >
            Гарантійна політика
          </a>

          <a onClick={openBenefitsPage}>Переваги Lenovo Shop</a>
          <a onClick={openContactsPage}>Контакти</a>
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

            <a onClick={() => openSearchCategory?.("Ігрові ноутбуки", "ігровий", 1)}>
              Ігрові ноутбуки
            </a>
            <a onClick={() => openSearchCategory?.("Для бізнесу", "бізнес", 1)}>
              Для бізнесу
            </a>
            <a onClick={() => openSearchCategory?.("Тонкі і легкі", "тонкий", 1)}>
              Тонкі і легкі
            </a>
            <a onClick={() => openSearchCategory?.("Для роботи та навчання", "робота", 1)}>
              Для роботи та навчання
            </a>
            <a onClick={() => openSearchCategory?.("Мультимедійні", "мультимедіа", 1)}>
              Мультимедійні
            </a>
            <a onClick={() => openSearchCategory?.("ThinkPad", "thinkpad", 1)}>
              ThinkPad
            </a>
            <a onClick={() => openSearchCategory?.("Legion", "legion", 1)}>
              Legion
            </a>
            <a onClick={() => openSearchCategory?.("Yoga", "yoga", 1)}>
              Yoga
            </a>
            <a onClick={() => openSearchCategory?.("IdeaPad", "ideapad", 1)}>
              IdeaPad
            </a>
            <a onClick={() => openSearchCategory?.("Ультрабуки", "ультрабук", 1)}>
              Ультрабуки
            </a>
          </div>

          <div className="footer-column">
            <div className="footer-title">
              <TabletMacIcon />
              <span>Планшети</span>
            </div>

            <a onClick={() => openSearchCategory?.("Трансформери", "трансформер", 2)}>
              Трансформери
            </a>
            <a onClick={() => openSearchCategory?.("Планшети з 3G", "3g", 2)}>
              Планшети з 3G
            </a>
            <a onClick={() => openSearchCategory?.("Планшети Windows", "windows", 2)}>
              Планшети на Windows
            </a>
            <a onClick={() => openSearchCategory?.("Планшети Android", "android", 2)}>
              Планшети на Android
            </a>
          </div>

          <div className="footer-column">
            <div
              className="footer-title"
              onClick={() => openSearchCategory?.("Смартфони Motorola", "motorola", 3)}
            >
              <PhoneIphoneIcon />
              <span>Смартфони</span>
            </div>

            <div
              className="footer-title second"
              onClick={() => openSearchCategory?.("Моноблоки", "моноблок", 9)}
            >
              <DesktopWindowsIcon />
              <span>Моноблоки</span>
            </div>

            <div
              className="footer-title second"
              onClick={() => openSearchCategory?.("Настільні ПК", "пк", 10)}
            >
              <DesktopWindowsIcon />
              <span>Настільні ПК</span>
            </div>

            <div
              className="footer-title second"
              onClick={() => openSearchCategory?.("Монітори", "монітор", 5)}
            >
              <DesktopWindowsIcon />
              <span>Монітори</span>
            </div>

            <div
              className="footer-title second"
              onClick={() => openSearchCategory?.("Аксесуари", "", 6)}
            >
              <CardGiftcardIcon />
              <span>Аксесуари</span>
            </div>
          </div>

          <div className="footer-column">
            <div
              className="footer-title portal-title"
              onClick={() => window.open("https://lenovo.ua/", "_blank")}
            >
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