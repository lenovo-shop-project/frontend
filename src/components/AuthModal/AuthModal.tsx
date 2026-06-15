import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./AuthModal.css";

interface Props {
  close: () => void;
}

const AuthModal = ({ close }: Props) => {
  const [tab, setTab] = useState<"login" | "register">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
    if (tab === "login") {
      console.log("LOGIN", email, password);

      // PYTHON LOGIN
      //
      // POST http://localhost:8000/auth/login
      //
      // FastAPI:
      // @app.post("/auth/login")
      //
      // body:
      // {
      //   email,
      //   password
      // }
    } else {
      console.log("REGISTER", email, password);

      //  PYTHON REGISTER
      //
      // POST http://localhost:8000/auth/register
      //
      // FastAPI:
      // @app.post("/auth/register")
      //
      // body:
      // {
      //   email,
      //   password
      // }
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

        <button className="auth-submit" onClick={submit}>
          {tab === "login" ? "Увійти" : "Зареєструватися"}
        </button>

        {tab === "login" && <a className="forgot">Нагадати пароль</a>}
      </div>
    </div>
  );
};

export default AuthModal;