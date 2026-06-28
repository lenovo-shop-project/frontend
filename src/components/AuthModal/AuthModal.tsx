import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { BASE_URL } from "../../config";
import { showNotification } from "../../utils/notifications";
import "./AuthModal.css";

interface Props {
  close: () => void;
  onLoginSuccess: () => void;
}

interface UserResponse {
  id?: number;
  email?: string;
  role?: string;
  image_url?: string | null;
  is_email_verified?: boolean;
}

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const AuthModal = ({ close, onLoginSuccess }: Props) => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [step, setStep] = useState<"form" | "verify">("form");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFileName, setAvatarFileName] = useState("");

  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const normalizedEmail = email.trim().toLowerCase();

  const getAuthErrorMessage = (data: any, fallback: string) => {
    if (typeof data?.detail === "string") return data.detail;

    if (Array.isArray(data?.detail)) {
      return data.detail
        .map((item: any) => item?.msg || item?.message || "Помилка")
        .join(". ");
    }

    return fallback;
  };

  const handleTabChange = (newTab: "login" | "register") => {
    setTab(newTab);
    setStep("form");
    setShowPassword(false);
    setVerificationCode("");

    if (newTab === "login") {
      clearAvatar();
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification("Оберіть саме зображення", "warning");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      showNotification("Зображення має бути не більше 5 МБ", "warning");
      event.target.value = "";
      return;
    }

    setAvatarFile(file);
    setAvatarFileName(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarPreview(reader.result);
      }
    };

    reader.onerror = () => {
      showNotification("Не вдалося прочитати зображення", "error");
      clearAvatar();
      event.target.value = "";
    };

    reader.readAsDataURL(file);
  };

  const clearAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    setAvatarFileName("");
  };

  const saveLoginData = async (token: string, optionalAvatarFile?: File | null) => {
    localStorage.setItem("token", token);
    localStorage.setItem("access_token", token);

    let user: UserResponse | null = null;

    try {
      const meResponse = await fetch(`${BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (meResponse.ok) {
        user = await meResponse.json();
      }
    } catch (error) {
      console.error("GET ME ERROR:", error);
    }

    if (optionalAvatarFile) {
      const uploadedUser = await uploadAvatar(token, optionalAvatarFile);

      if (uploadedUser) {
        user = uploadedUser;
      }
    }

    const avatar = user?.image_url || DEFAULT_AVATAR;
    localStorage.setItem("avatar", avatar);
    window.dispatchEvent(new Event("avatarChanged"));
  };

  const uploadAvatar = async (token: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${BASE_URL}/auth/me/avatar`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        showNotification(
          getAuthErrorMessage(data, "Аватар не вдалося завантажити, але акаунт створено"),
          "warning"
        );
        return null;
      }

      return data as UserResponse;
    } catch (error) {
      console.error("AVATAR UPLOAD ERROR:", error);
      showNotification("Аватар не вдалося завантажити, але акаунт створено", "warning");
      return null;
    }
  };

  const loginAfterVerification = async () => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: normalizedEmail,
        password,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      showNotification(
        getAuthErrorMessage(data, "Email підтверджено. Тепер увійдіть у акаунт."),
        "warning"
      );
      setStep("form");
      setTab("login");
      return;
    }

    await saveLoginData(data.access_token, avatarFile);
    showNotification("Email підтверджено. Вхід виконано успішно", "success");
    onLoginSuccess();
    close();
  };

  const submitLogin = async () => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: normalizedEmail,
        password,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 403) {
        setStep("verify");
        showNotification("Спочатку підтвердіть email кодом з пошти", "warning");
        return;
      }

      showNotification(getAuthErrorMessage(data, "Помилка авторизації"), "error");
      return;
    }

    await saveLoginData(data.access_token, null);
    onLoginSuccess();
    showNotification("Вхід успішний", "success");
    close();
  };

  const requestVerificationCode = async () => {
    const response = await fetch(`${BASE_URL}/auth/resend-verification-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: normalizedEmail,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw {
        status: response.status,
        message: getAuthErrorMessage(data, "Не вдалося відправити новий код"),
      };
    }

    return getAuthErrorMessage(data, "Новий код відправлено на email");
  };

  const submitRegister = async () => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: normalizedEmail,
        password,
        image_url: DEFAULT_AVATAR,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message = getAuthErrorMessage(data, "Не вдалося зареєструватися");
      const lowerMessage = message.toLowerCase();
      const canUseVerification =
        response.status === 409 &&
        (lowerMessage.includes("існу") ||
          lowerMessage.includes("существ") ||
          lowerMessage.includes("код") ||
          lowerMessage.includes("email"));

      if (canUseVerification) {
        setStep("verify");
        setTab("register");
        showNotification(
          "Цей email уже є в базі. Відкрила вікно для коду і пробую надіслати новий код.",
          "warning"
        );

        try {
          const resendMessage = await requestVerificationCode();
          showNotification(resendMessage, "success");
        } catch (error: any) {
          const errorMessage = error?.message || "Не вдалося відправити новий код";
          const lowerErrorMessage = errorMessage.toLowerCase();

          if (
            error?.status === 409 &&
            (lowerErrorMessage.includes("підтвердж") ||
              lowerErrorMessage.includes("подтверж"))
          ) {
            setStep("form");
            setTab("login");
            showNotification(
              "Цей email уже підтверджений. Перейдіть на вкладку входу і увійдіть.",
              "info"
            );
            return;
          }

          showNotification(
            `${errorMessage}. Якщо лист не приходить, перевірте спам або SMTP на бекенді.`,
            "error"
          );
        }

        return;
      }

      showNotification(message, "error");
      return;
    }

    setStep("verify");
    showNotification("Код підтвердження відправлено на вашу пошту", "success");
  };

  const submit = async () => {
    if (!normalizedEmail) {
      showNotification("Введіть email", "warning");
      return;
    }

    if (password.length < 6) {
      showNotification("Пароль має містити мінімум 6 символів", "warning");
      return;
    }

    setIsLoading(true);

    try {
      if (tab === "login") {
        await submitLogin();
      } else {
        await submitRegister();
      }
    } catch (error) {
      console.error(error);
      showNotification("Бекенд не відповідає", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async () => {
    const code = verificationCode.trim();

    if (!/^\d{6}$/.test(code)) {
      showNotification("Введіть 6 цифр з листа", "warning");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          code,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        showNotification(getAuthErrorMessage(data, "Код не підійшов"), "error");
        return;
      }

      await loginAfterVerification();
    } catch (error) {
      console.error("VERIFY EMAIL ERROR:", error);
      showNotification("Не вдалося підтвердити email", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    if (!normalizedEmail) {
      showNotification("Введіть email", "warning");
      return;
    }

    setIsLoading(true);

    try {
      const message = await requestVerificationCode();
      showNotification(message, "success");
    } catch (error: any) {
      console.error("RESEND CODE ERROR:", error);
      showNotification(
        `${error?.message || "Не вдалося відправити код"}. Перевірте папку «Спам» або налаштування SMTP на бекенді.`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-window">
        <button className="auth-close" onClick={close} disabled={isLoading}>
          <CloseIcon />
        </button>

        {step === "verify" ? (
          <div className="verify-email-box">
            <h3>Підтвердіть email</h3>

            <p>
              Ми відправили код підтвердження на <b>{normalizedEmail}</b>.
              Саме сюди потрібно вставити 6 цифр з листа, щоб завершити реєстрацію.
            </p>

            <div className="verify-help">
              Якщо лист не прийшов одразу — перевірте папку «Спам» і зачекайте 1–2 хвилини.
              Якщо користувач уже був створений раніше, натисніть кнопку «Надіслати код ще раз».
            </div>

            <label>Код підтвердження</label>
            <input
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              inputMode="numeric"
              maxLength={6}
            />

            <button className="auth-submit" onClick={verifyEmail} disabled={isLoading}>
              {isLoading ? "Перевіряємо..." : "Підтвердити email"}
            </button>

            <button className="auth-secondary" onClick={resendCode} disabled={isLoading}>
              Відправити код ще раз
            </button>

            <button
              className="auth-link-button"
              onClick={() => {
                setStep("form");
                setTab("login");
              }}
              disabled={isLoading}
            >
              Повернутися до входу
            </button>
          </div>
        ) : (
          <>
            <div className="auth-tabs">
              <button
                className={tab === "login" ? "active" : ""}
                onClick={() => handleTabChange("login")}
                disabled={isLoading}
              >
                Увійти
              </button>

              <button
                className={tab === "register" ? "active" : ""}
                onClick={() => handleTabChange("register")}
                disabled={isLoading}
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
              disabled={isLoading}
            />

            <label>Пароль</label>

            <div className="password-box">
              <input
                placeholder="введіть пароль"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Сховати пароль" : "Показати пароль"}
                disabled={isLoading}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>

            {tab === "register" && (
              <div className="avatar-field">
                <label>Зображення профілю</label>

                <div className="avatar-upload-row">
                  <input
                    id="register-avatar"
                    className="avatar-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={isLoading}
                  />

                  <label className="avatar-upload-button" htmlFor="register-avatar">
                    Обрати з компʼютера
                  </label>

                  <span className="avatar-file-name">
                    {avatarFileName || "Файл не обрано"}
                  </span>
                </div>

                {avatarPreview && (
                  <div className="avatar-preview-box">
                    <img src={avatarPreview} alt="Попередній перегляд аватара" />

                    <button type="button" onClick={clearAvatar} disabled={isLoading}>
                      Видалити
                    </button>
                  </div>
                )}
              </div>
            )}

            <button className="auth-submit" onClick={submit} disabled={isLoading}>
              {isLoading
                ? "Зачекайте..."
                : tab === "login"
                  ? "Увійти"
                  : "Зареєструватися"}
            </button>

            
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
