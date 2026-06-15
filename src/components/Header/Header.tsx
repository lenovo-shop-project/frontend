import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import SearchOverlay from "../SearchOverlay/SearchOverlay";
import "./Header.css";
import AuthModal from "../AuthModal/AuthModal";
const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen,setAuthOpen] = useState(false);

  return (
    <>
      <header className="header">
        <nav className="header-menu">
  <a>Ноутбуки</a>
  <a>Планшети</a>
  <a>Смартфони Motorola</a>

  <div className="nav-dropdown-wrapper">
    <button className="nav-dropdown-button">Аксесуари +</button>

    <div className="nav-dropdown accessories-dropdown">
      <div>Додаткові сервіси</div>
      <div>Миші та Килимки</div>
      <div>Сумки, рюкзаки, чохли для ноутбуків</div>
      <div>Док-станції для ноутбуків</div>
      <div>Блоки живлення, зарядні пристрої для ноутбуків</div>
      <div>Акумулятори для ноутбуків</div>
      <div>Навушники</div>
      <div>Клавіатури</div>
      <div>Кабелі та перехідники</div>
      <div>Чохли для планшетів</div>
      <div>Зарядні пристрої для планшетів</div>
      <div>Стилуси</div>
      <div>Настільні кріплення</div>
      <div>Акустика</div>
      <div>Веб-камери</div>
      <div>Віртуальна реальність</div>
      <div>Операційні системи</div>
      <div>Офісні програми</div>
    </div>
  </div>

  <div className="nav-dropdown-wrapper">
    <button className="nav-dropdown-button">Інші продукти +</button>

    <div className="nav-dropdown products-dropdown">
      <div>Інтерактивні Панелі</div>
      <div>Моноблоки</div>
      <div>Настільні ПК</div>
      <div>Монітори</div>
      <div>Ігрові консолі</div>
      <div>Сервери</div>
    </div>
  </div>

  <button className="portal-button">Портал</button>
</nav>

        <div className="header-actions">
          <div className="buyer-menu-wrapper">
            <button className="buyer-button">Покупцям +</button>

            <div className="buyer-dropdown">
              <div>Акції</div>
              <div>Trade-in планшетів</div>
              <div>Для бізнесу</div>
              <div>Бонусна програма</div>
              <div>Додаткові Сервіси</div>
              <div>Форум підтримки</div>
              <div>Інструкції з експлуатації</div>
              <div>Сервісні центри</div>
            </div>
          </div>

          <button
            className="icon-button"
            type="button"
            onClick={() => setSearchOpen(true)}
          >
            <SearchIcon />
          </button>

          <button
           className="icon-button"
            onClick={()=>setAuthOpen(true)}
           >
             <PersonIcon/>
            </button>

          <LanguageSelector />
        </div>
      </header>

      {searchOpen && <SearchOverlay close={() => setSearchOpen(false)} />}
     {authOpen && <AuthModal close={()=>setAuthOpen(false)}/>
}
    </>
  );
};

export default Header;