import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <nav className="header-menu">
        <a>Ноутбуки</a>
        <a>Планшети</a>
        <a>Смартфони Motorola</a>
        <a>Аксесуари +</a>
        <a>Інші продукти +</a>
        <button>Портал</button>
      </nav>

      <div className="header-actions">
        <button className="buyer-button">Покупцям +</button>
        <button className="icon-button">
          <SearchIcon />
        </button>
        <button className="icon-button">
          <PersonIcon />
        </button>
        <LanguageSelector />
      </div>
    </header>
  );
};

export default Header;