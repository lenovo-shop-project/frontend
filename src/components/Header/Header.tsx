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
import { BASE_URL } from "../../config";

import MyOrders from "../MyOrders/MyOrders";
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
const accessoriesSearchMap: Record<
  string,
  { keyword: string; categoryId: number }
> = {
  "Додаткові сервіси": {
    keyword: "сервіс",
    categoryId: 6,
  },

  "Миші та Килимки": {
    keyword: "миша",
    categoryId: 6,
  },

  "Сумки, рюкзаки, чохли для ноутбуків": {
    keyword: "сумка",
    categoryId: 6,
  },

  "Док-станції для ноутбуків": {
    keyword: "док",
    categoryId: 6,
  },

  "Блоки живлення, зарядні пристрої для ноутбуків": {
    keyword: "заряд",
    categoryId: 6,
  },

  "Акумулятори для ноутбуків": {
    keyword: "акумулятор",
    categoryId: 6,
  },

  "Навушники": {
    keyword: "навушники",
    categoryId: 6,
  },

  "Клавіатури": {
    keyword: "клавіатура",
    categoryId: 6,
  },

  "Кабелі та перехідники": {
    keyword: "кабель",
    categoryId: 6,
  },

  "Чохли для планшетів": {
    keyword: "чохол",
    categoryId: 6,
  },
};

const otherProducts = [
  "Інтерактивні Панелі",
  "Моноблоки",
  "Настільні ПК",
  "Монітори",
  "Ігрові консолі",
  "Сервери",
];
const otherProductsSearchMap: Record<string, string> = {
  "Інтерактивні Панелі": "інтерактивна панель",
  "Моноблоки": "моноблок",
  "Настільні ПК": "пк",
  "Монітори": "монітор",
  "Ігрові консолі": "консоль",
  "Сервери": "сервер",
};

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
  openPromotionsPage?: () => void;

  openSearchCategory?: (
    title: string,
    keyword: string,
    categoryId?: number
  ) => void;
}
const Header = ({
  openLaptopsPage,
  openTabletsPage,
  openMotorolaPage,
  openPromotionsPage,
  openSearchCategory,
  
}: HeaderProps) => {
 const [isCartOpen, setIsCartOpen] = useState(false);
const [isOrdersOpen, setIsOrdersOpen] = useState(false);
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
      const response = await fetch(`${BASE_URL}/auth/me`, {
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
  <button
    key={item}
    onClick={() => {
  const search = accessoriesSearchMap[item];

  openSearchCategory?.(
    item,
    search?.keyword || "",
    search?.categoryId
  );
}}
  >
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
  <button
    key={item}
    onClick={() => {
      openSearchCategory?.(
        item,
        otherProductsSearchMap[item] || item
      );
    }}
  >
    {item}
  </button>
))}
            </div>
          </div>

          <button
  className="portal-btn"
  onClick={() => {
    window.open("https://lenovo.ua/", "_blank");
  }}
>
  Портал
</button>
        </nav>

        <div className="header-actions">
          <div className="header-dropdown buyer-dropdown">
            <button>
              Покупцям <span>+</span>
            </button>

            <div className="header-dropdown-menu buyer-menu">
              {buyerMenu.map((item) => (
  <button
    key={item}
    onClick={() => {

      if (item === "Акції") {
        openPromotionsPage?.();
      }

      if (item === "Trade-in планшетів") {
        window.open(
          "https://shop.lenovo.ua/tradein_tabs",
          "_blank"
        );
      }

      if (item === "Для бізнесу") {
        window.open(
          "https://shop.lenovo.ua/smb",
          "_blank"
        );
      }

      if (item === "Бонусна програма") {
        window.open(
          "https://shop.lenovo.ua/bonus-program",
          "_blank"
        );
      }

      if (item === "Додаткові Сервіси") {
        window.open(
          "https://lenovo.ua/lp/services",
          "_blank"
        );
      }

      if (item === "Форум підтримки") {
        window.open(
          "https://forums.lenovo.com/t5/One-Language-Community/ct-p/Community-OLC",
          "_blank"
        );
      }

      if (item === "Інструкції з експлуатації") {
        window.open(
          "https://support.lenovo.com/ua/uk?tabName=Manuals",
          "_blank"
        );
      }

      if (item === "Сервісні центри") {
        window.open(
          "https://service.lenovo.ua/uk/service-centers",
          "_blank"
        );
      }

    }}
  >
    {item}
  </button>
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
    <button
  onClick={() => {
    setIsOrdersOpen(true);
    setShowProfileMenu(false);
  }}
>
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

{isOrdersOpen && (
  <MyOrders close={() => setIsOrdersOpen(false)} />
)}
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