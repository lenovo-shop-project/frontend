import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";
import Cart from "../Cart/Cart";
import AdminPanel from "../AdminPanel/AdminPanel";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import AuthModal from "../AuthModal/AuthModal";
import SearchOverlay from "../SearchOverlay/SearchOverlay";

import "./Header.css";

const accessories = [
  "Додаткові сервіси",
  "Миші та Килимки",
  "Сумки, рюкзаки, чохли для ноутбуків",
  "Док-станції для ноутбуків",
  "Блоки живлення, зарядні пристрої для ноутбуків",
  "Акумулятори для ноутбуків",
  "Навушники",
  "Клавіатури",
  "Кабелі та перехідники",
  "Чохли для планшетів",
  "Зарядні пристрої для планшетів",
  "Стилуси",
  "Настільні кріплення",
  "Акустика",
  "Веб-камери",
  "Віртуальна реальність",
  "Операційні системи",
  "Офісні програми",
];

const otherProducts = [
  "Інтерактивні Панелі",
  "Моноблоки",
  "Настільні ПК",
  "Монітори",
  "Ігрові консолі",
  "Сервери",
];

const buyerMenu = [
  "Акції",
  "Trade-in планшетів",
  "Для бізнесу",
  "Бонусна програма",
  "Додаткові Сервіси",
  "Форум підтримки",
  "Інструкції з експлуатації",
  "Сервісні центри",
];
interface HeaderProps {
  openLaptopsPage?: () => void;
  openTabletsPage?: () => void;
  openMotorolaPage?: () => void;
}
const Header = ({
  openLaptopsPage,
  openTabletsPage,
  openMotorolaPage,
}: HeaderProps) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [showAuth, setShowAuth] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [isAuth, setIsAuth] = useState(Boolean(localStorage.getItem("token")));
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || "");

  const checkUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAdmin(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setIsAdmin(false);
        return;
      }

      const user = await response.json();

      console.log("USER FROM /me:", user);

const role = String(user.role).toLowerCase();

if (role === "admin") {
  setIsAdmin(true);
} else {
  setIsAdmin(false);
}

      if (user.image_url) {
        localStorage.setItem("avatar", user.image_url);
        setAvatar(user.image_url);
      }
    } catch (error) {
      console.error(error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    const updateAvatar = () => {
      setAvatar(localStorage.getItem("avatar") || "");
    };

    window.addEventListener("avatarChanged", updateAvatar);
    window.addEventListener("storage", updateAvatar);

    return () => {
      window.removeEventListener("avatarChanged", updateAvatar);
      window.removeEventListener("storage", updateAvatar);
    };
  }, []);

  const openSearchByCategory = (value: string) => {
    setShowSearch(true);

    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>(".search-box input");

      if (input) {
        input.value = value;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }, 100);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("avatar");

    setIsAuth(false);
    setIsAdmin(false);
    setAvatar("");
    setShowProfileMenu(false);
    setIsAdminOpen(false);
  };

  const loginSuccess = () => {
    setIsAuth(true);
    checkUser();
  };

  return (
    <>
      <header className="header">
        <nav className="header-menu">
         <button onClick={openLaptopsPage}>
  Ноутбуки
</button>

          <button onClick={openTabletsPage}>
  Планшети
</button>

          <button onClick={openMotorolaPage}>
  Смартфони Motorola
</button>

          <div className="header-dropdown">
            <button>
              Аксесуари <span>+</span>
            </button>

            <div className="header-dropdown-menu large">
              {accessories.map((item) => (
                <button key={item} onClick={() => openSearchByCategory(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="header-dropdown">
            <button>
              Інші продукти <span>+</span>
            </button>

            <div className="header-dropdown-menu">
              {otherProducts.map((item) => (
                <button key={item} onClick={() => openSearchByCategory(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button className="portal-btn">Портал</button>
        </nav>

        <div className="header-actions">
          <div className="header-dropdown buyer-dropdown">
            <button>
              Покупцям <span>+</span>
            </button>

            <div className="header-dropdown-menu buyer-menu">
              {buyerMenu.map((item) => (
                <button key={item}>{item}</button>
              ))}
            </div>
          </div>

          <button className="header-icon-btn" onClick={() => setShowSearch(true)}>
            <SearchIcon />
          </button>

          <div className="profile-wrapper">
            {!isAuth ? (
              <button
                className="header-icon-btn"
                onClick={() => setShowAuth(true)}
              >
                <PersonIcon />
              </button>
            ) : (
              <>
                <button
                  className="avatar-button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  {avatar ? <img src={avatar} alt="avatar" /> : <PersonIcon />}
                </button>

                {showProfileMenu && (
                  <div className="profile-menu">
                    <div className="profile-user">
                      <label className="profile-avatar">
                        {avatar ? <img src={avatar} alt="avatar" /> : "A"}

                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const reader = new FileReader();

                            reader.onload = () => {
                              const result = reader.result as string;
                              localStorage.setItem("avatar", result);
                              setAvatar(result);
                            };

                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>

                      <div>
                        <strong>Мій кабінет</strong>
                        <span>Натисни на аватар, щоб змінити</span>
                      </div>
                    </div>

                   {!isAdmin && (
  <>
    <button>
      <InventoryIcon />
      Мої замовлення
    </button>

    <button
      className="profile-menu-item cart-link"
      onClick={() => {
        setIsCartOpen(true);
        setShowProfileMenu(false);
      }}
    >
      🛒 Кошик
    </button>
  </>
)}

                    {isAdmin && (
                      <button
                        className="profile-menu-item"
                        onClick={() => {
                          setIsAdminOpen(true);
                          setShowProfileMenu(false);
                        }}
                      >
                        ⚙️ Адмін панель
                      </button>
                    )}

                    <button className="logout-btn" onClick={logout}>
                      <LogoutIcon />
                      Вийти
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <LanguageSelector />
        </div>

        {isCartOpen && <Cart close={() => setIsCartOpen(false)} />}
      </header>

     {isAdminOpen && (
  <AdminPanel close={() => setIsAdminOpen(false)} />
)}

      {showAuth && (
        <AuthModal
          close={() => setShowAuth(false)}
          onLoginSuccess={loginSuccess}
        />
      )}

      {showSearch && <SearchOverlay close={() => setShowSearch(false)} />}
    </>
  );
};

export default Header;