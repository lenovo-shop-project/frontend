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

interface FooterSearchItem {
  label: string;
  title: string;
  keyword: string;
  categoryId: number;
}

const laptopLinks: FooterSearchItem[] = [
  { label: "Ігрові ноутбуки", title: "Ігрові ноутбуки", keyword: "ігров", categoryId: 1 },
  { label: "Для бізнесу", title: "Ноутбуки для бізнесу", keyword: "бізнес|business", categoryId: 1 },
  { label: "Тонкі і легкі", title: "Тонкі і легкі ноутбуки", keyword: "тонк|легк", categoryId: 1 },
  { label: "Для роботи та навчання", title: "Ноутбуки для роботи та навчання", keyword: "робот|навчан", categoryId: 1 },
  { label: "Мультимедійні", title: "Мультимедійні ноутбуки", keyword: "мультимед", categoryId: 1 },
  { label: "ThinkPad", title: "ThinkPad", keyword: "thinkpad", categoryId: 1 },
  { label: "Legion", title: "Legion", keyword: "legion", categoryId: 1 },
  { label: "Yoga", title: "Yoga", keyword: "yoga", categoryId: 1 },
  { label: "IdeaPad", title: "IdeaPad", keyword: "ideapad", categoryId: 1 },
  { label: "Ультрабуки", title: "Ультрабуки", keyword: "ультра", categoryId: 1 },
];

const tabletLinks: FooterSearchItem[] = [
  { label: "Трансформери", title: "Планшети трансформери", keyword: "трансформ", categoryId: 2 },
  { label: "Планшети з 3G", title: "Планшети з 3G", keyword: "3g|lte|sim", categoryId: 2 },
  { label: "Планшети на Windows", title: "Планшети на Windows", keyword: "windows", categoryId: 2 },
  { label: "Планшети на Android", title: "Планшети на Android", keyword: "android", categoryId: 2 },
];

const Footer = ({
  openDeliveryPaymentPage,
  openReturnExchangePage,
  openBenefitsPage,
  openContactsPage,
  openSearchCategory,
}: FooterProps) => {
  const openFooterSearch = (title: string, keyword: string, categoryId: number) => {
    openSearchCategory?.(title, keyword, categoryId);

    setTimeout(() => {
      document
        .getElementById("product-grid-anchor")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const renderLink = (item: FooterSearchItem) => (
    <button
      key={item.label}
      type="button"
      className="footer-link"
      onClick={() => openFooterSearch(item.title, item.keyword, item.categoryId)}
    >
      {item.label}
    </button>
  );

  return (
    <footer className="footer">
      <div className="footer-inner">
        <nav className="footer-top-links">
          <button type="button" onClick={openDeliveryPaymentPage}>Доставка та оплата</button>
          <button type="button" onClick={openReturnExchangePage}>Повернення та обмін</button>

          <button
            type="button"
            onClick={() => window.open("https://shop.lenovo.ua/warranty-policy", "_blank")}
          >
            Гарантійна політика
          </button>

          <button type="button" onClick={openBenefitsPage}>Переваги Lenovo Shop</button>
          <button type="button" onClick={openContactsPage}>Контакти</button>
        </nav>

        <div className="footer-contacts">
          <div className="footer-work-time">
            <p>Контакт-центр з 8:30 до 20:30</p>
            <p>В суботу: з 9:00 до 20:00</p>
            <p>В неділю: з 9:30 до 19:30</p>
          </div>

          <button
            type="button"
            className="footer-phone"
            onClick={() => window.open("tel:0800300033")}
          >
            0 800 30 00 33
          </button>

          <button
            type="button"
            className="footer-email"
            onClick={() => window.open("mailto:online-shop@lenovo.ua")}
          >
            online-shop@lenovo.ua
          </button>
        </div>

        <div className="footer-menu">
          <div className="footer-column">
            <button
              type="button"
              className="footer-title"
              onClick={() => openFooterSearch("Ноутбуки", "", 1)}
            >
              <LaptopIcon />
              <span>Ноутбуки</span>
            </button>

            {laptopLinks.map(renderLink)}
          </div>

          <div className="footer-column">
            <button
              type="button"
              className="footer-title"
              onClick={() => openFooterSearch("Планшети", "", 2)}
            >
              <TabletMacIcon />
              <span>Планшети</span>
            </button>

            {tabletLinks.map(renderLink)}
          </div>

          <div className="footer-column footer-main-categories">
            <button
              type="button"
              className="footer-title"
              onClick={() => openFooterSearch("Смартфони Motorola", "", 3)}
            >
              <PhoneIphoneIcon />
              <span>Смартфони</span>
            </button>

            <button
              type="button"
              className="footer-title second"
              onClick={() => openFooterSearch("Комп’ютери", "", 10)}
            >
              <DesktopWindowsIcon />
              <span>Комп’ютери</span>
            </button>

            <button
              type="button"
              className="footer-title second"
              onClick={() => openFooterSearch("Моноблоки", "", 9)}
            >
              <DesktopWindowsIcon />
              <span>Моноблоки</span>
            </button>

            <button
              type="button"
              className="footer-title second"
              onClick={() => openFooterSearch("Монітори", "", 5)}
            >
              <DesktopWindowsIcon />
              <span>Монітори</span>
            </button>

            <button
              type="button"
              className="footer-title second"
              onClick={() => openFooterSearch("Ігрові консолі", "", 4)}
            >
              <DesktopWindowsIcon />
              <span>Ігрові консолі</span>
            </button>
          </div>

          <div className="footer-column footer-main-categories">
            <button
              type="button"
              className="footer-title"
              onClick={() => openFooterSearch("Інтерактивні панелі", "", 8)}
            >
              <DesktopWindowsIcon />
              <span>Інтерактивні панелі</span>
            </button>

            <button
              type="button"
              className="footer-title second"
              onClick={() => openFooterSearch("Сервери", "", 7)}
            >
              <DesktopWindowsIcon />
              <span>Сервери</span>
            </button>

            <button
              type="button"
              className="footer-title second"
              onClick={() => openFooterSearch("Аксесуари", "", 6)}
            >
              <CardGiftcardIcon />
              <span>Аксесуари</span>
            </button>

            <button
              type="button"
              className="footer-title second portal-title"
              onClick={() => window.open("https://lenovo.ua/", "_blank")}
            >
              <span className="portal-icon">L</span>
              <span>Портал</span>
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Lenovo Україна</span>
          <button type="button">Конфіденційність</button>
          <button type="button">Правила використання</button>
          <button type="button">Оферта</button>
          <button type="button">Кукі</button>
          <button type="button">Укр⌄</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
