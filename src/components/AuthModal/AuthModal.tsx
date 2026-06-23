import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { BASE_URL } from "../../config";
import "./AuthModal.css";

interface Props {
  close: () => void;
  onLoginSuccess: () => void;
}

const AuthModal = ({ close, onLoginSuccess }: Props) => {
  const [tab, setTab] = useState<"login" | "register">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [imageUrl, setImageUrl] = useState("");

  const submit = async () => {
    try {
      const url =
        tab === "login"
          ? `${BASE_URL}/auth/login`
          : `${BASE_URL}/auth/register`;

      const body =
        tab === "login"
          ? {
              email: email,
              password: password,
            }
          : {
              email: email,
              password: password,
              image_url:
                imageUrl.trim() !== ""
                  ? imageUrl
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Помилка авторизації");
        return;
      }

      if (tab === "login") {
        localStorage.setItem("token", data.access_token);

        const meResponse = await fetch(`${BASE_URL}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        });

        const me = await meResponse.json();

        if (me.image_url) {
          localStorage.setItem("avatar", me.image_url);
        } else {
          localStorage.setItem(
            "avatar",
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          );
        }

        window.dispatchEvent(new Event("avatarChanged"));

        onLoginSuccess();
        alert("Вхід успішний");
        close();
      } else {
        alert("Реєстрація успішна. Тепер увійди.");
        setTab("login");
        setPassword("");
      }
    } catch (error) {
      console.error(error);
      alert("Бекенд не відповідає");
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-window">
        <button className="auth-close" onClick={close}>
          <CloseIcon />
        </button>

        <div className="auth-tabs">
          <button
            className={tab === "login" ? "active" : ""}
            onClick={() => setTab("login")}
          >
            Увійти
          </button>

          <button
            className={tab === "register" ? "active" : ""}
            onClick={() => setTab("register")}
          >
            Реєстрація
          </button>
        </div>

        <h3>
          {tab === "login"
            ? "Увійти за допомогою E-mail"
            : "Створити акаунт"}
        </h3>

        <label>Email</label>

        <input
          placeholder="example@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Пароль</label>

        <div className="password-box">
          <input
            placeholder="введіть пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <VisibilityIcon />
        </div>

        {tab === "register" && (
          <>
            <label>Зображення профілю</label>

            <input
              placeholder="https://example.com/avatar.png"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </>
        )}

        <button className="auth-submit" onClick={submit}>
          {tab === "login" ? "Увійти" : "Зареєструватися"}
        </button>

        {tab === "login" && <a className="forgot">Нагадати пароль</a>}
      </div>
    </div>
  );
};

export default AuthModal;