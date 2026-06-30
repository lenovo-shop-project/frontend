import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BalanceIcon from "@mui/icons-material/Balance";
import Cart from "../Cart/Cart";
import AdminPanel from "../AdminPanel/AdminPanel";

import AuthModal from "../AuthModal/AuthModal";
import SearchOverlay from "../SearchOverlay/SearchOverlay";
import { authUrl } from "../../config";
import { showNotification } from "../../utils/notifications";

import MyOrders from "../MyOrders/MyOrders";
import FavoritesPanel from "../FavoritesPanel/FavoritesPanel";
import ComparePanel from "../ComparePanel/ComparePanel";
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

  "Зарядні пристрої для планшетів": {
    keyword: "заряд",
    categoryId: 6,
  },

  "Стилуси": {
    keyword: "стилус",
    categoryId: 6,
  },

  "Настільні кріплення": {
    keyword: "кріплення",
    categoryId: 6,
  },

  "Акустика": {
    keyword: "акустика|колонки",
    categoryId: 6,
  },

  "Веб-камери": {
    keyword: "камера|web",
    categoryId: 6,
  },

  "Віртуальна реальність": {
    keyword: "vr|віртуаль",
    categoryId: 6,
  },

  "Операційні системи": {
    keyword: "windows|операцій",
    categoryId: 6,
  },

  "Офісні програми": {
    keyword: "office|офіс",
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

const otherProductsSearchMap: Record<
  string,
  { title: string; keyword: string; categoryId: number }
> = {
  "Інтерактивні Панелі": {
    title: "Інтерактивні панелі",
    keyword: "",
    categoryId: 8,
  },
  "Моноблоки": {
    title: "Моноблоки",
    keyword: "",
    categoryId: 9,
  },
  "Настільні ПК": {
    title: "Комп’ютери",
    keyword: "",
    categoryId: 10,
  },
  "Монітори": {
    title: "Монітори",
    keyword: "",
    categoryId: 5,
  },
  "Ігрові консолі": {
    title: "Ігрові консолі",
    keyword: "",
    categoryId: 4,
  },
  "Сервери": {
    title: "Сервери",
    keyword: "",
    categoryId: 7,
  },
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
  openPromotionsPage?: () => void;

  openSearchCategory?: (
    title: string,
    keyword: string,
    categoryId?: number
  ) => void;
}

const Header = ({
  openPromotionsPage,
  openSearchCategory,
}: HeaderProps) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [showAuth, setShowAuth] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [isAuth, setIsAuth] = useState(Boolean(localStorage.getItem("token")));
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || "");
  const [userEmail, setUserEmail] = useState("");

  const checkUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAdmin(false);
      return;
    }

    try {
      const response = await fetch(authUrl("/auth/me"), {
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

      const emailFromUser = String(user.email || "").trim().toLowerCase();
      setUserEmail(emailFromUser);

      const role = String(user.role).toLowerCase();

      if (role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }

      const savedAvatar = emailFromUser
        ? localStorage.getItem(`avatar:${emailFromUser}`)
        : "";
      const nextAvatar = savedAvatar || user.image_url || "";

      if (nextAvatar) {
        localStorage.setItem("avatar", nextAvatar);
        setAvatar(nextAvatar);
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
    setUserEmail("");
    setShowProfileMenu(false);
    setIsAdminOpen(false);
    setIsCartOpen(false);
    setIsOrdersOpen(false);
    setIsFavoritesOpen(false);
    setIsCompareOpen(false);
  };

  const loginSuccess = () => {
    setIsAuth(true);
    checkUser();
  };

  const openHeaderSearch = (
    title: string,
    keyword: string,
    categoryId: number
  ) => {
    openSearchCategory?.(title, keyword, categoryId);
  };

  const uploadAvatar = async (file?: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification("Оберіть саме зображення", "warning");
      return;
    }

    const token =
      localStorage.getItem("access_token") || localStorage.getItem("token");

    if (!token) {
      showNotification("Спочатку увійдіть в акаунт", "warning");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(authUrl("/auth/me/avatar"), {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        showNotification(data?.detail || "Не вдалося змінити аватар", "error");
        return;
      }

      const nextAvatar = data.image_url || "";

      if (nextAvatar) {
        localStorage.setItem("avatar", nextAvatar);

        if (userEmail) {
          localStorage.setItem(`avatar:${userEmail}`, nextAvatar);
        }

        setAvatar(nextAvatar);
        window.dispatchEvent(new Event("avatarChanged"));
      }

      showNotification("Аватар оновлено", "success");
    } catch (error) {
      console.error("AVATAR UPDATE ERROR:", error);
      showNotification("Не вдалося змінити аватар", "error");
    }
  };

  return (
    <>
      <header className="header">
        <nav className="header-menu">
          <button onClick={() => openHeaderSearch("Ноутбуки", "", 1)}>
            Ноутбуки
          </button>

          <button onClick={() => openHeaderSearch("Планшети", "", 2)}>
            Планшети
          </button>

          <button
            onClick={() => openHeaderSearch("Смартфони Motorola", "", 3)}
          >
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
                    const search = otherProductsSearchMap[item];

                    openSearchCategory?.(
                      search?.title || item,
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
                      window.open("https://shop.lenovo.ua/tradein_tabs", "_blank");
                    }

                    if (item === "Для бізнесу") {
                      window.open("https://shop.lenovo.ua/smb", "_blank");
                    }

                    if (item === "Бонусна програма") {
                      window.open(
                        "https://shop.lenovo.ua/bonus-program",
                        "_blank"
                      );
                    }

                    if (item === "Додаткові Сервіси") {
                      window.open("https://lenovo.ua/lp/services", "_blank");
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

          <button
            className="header-icon-btn"
            onClick={() => setShowSearch(true)}
          >
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
                          onChange={(e) => uploadAvatar(e.target.files?.[0])}
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

                        <button
                          className="profile-menu-item"
                          onClick={() => {
                            setIsFavoritesOpen(true);
                            setShowProfileMenu(false);
                          }}
                        >
                          <FavoriteBorderIcon />
                          Обране
                        </button>

                        <button
                          className="profile-menu-item"
                          onClick={() => {
                            setIsCompareOpen(true);
                            setShowProfileMenu(false);
                          }}
                        >
                          <BalanceIcon />
                          Порівняння
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
        </div>

        {isCartOpen && <Cart close={() => setIsCartOpen(false)} />}

        {isOrdersOpen && <MyOrders close={() => setIsOrdersOpen(false)} />}

        {isFavoritesOpen && (
          <FavoritesPanel close={() => setIsFavoritesOpen(false)} />
        )}

        {isCompareOpen && <ComparePanel close={() => setIsCompareOpen(false)} />}
      </header>

      {isAdminOpen && <AdminPanel close={() => setIsAdminOpen(false)} />}

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