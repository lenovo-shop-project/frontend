import { useState } from "react";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import { salesUrl } from "../../config";
import { showNotification } from "../../utils/notifications";
import "./LeftBanner.css";

const LeftBanner = () => {
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [phoneDone, setPhoneDone] = useState(false);
  const [phone, setPhone] = useState("");
  const [isSending, setIsSending] = useState(false);

  const getToken = () => {
    return localStorage.getItem("access_token") || localStorage.getItem("token");
  };

  const sendPhone = async () => {
    const token = getToken();

    if (!token) {
      showNotification("Спочатку увійдіть в акаунт", "warning");
      return;
    }

    if (phone.trim().length < 5) {
      showNotification("Введіть номер телефону", "warning");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(salesUrl("/client/phone-requests"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone_number: phone.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        showNotification(data?.detail || "Не вдалося відправити номер", "error");
        return;
      }

      setPhoneDone(true);
      showNotification("Запит на дзвінок відправлено адміну", "success");
    } catch (error) {
      console.error("SEND PHONE REQUEST ERROR:", error);
      showNotification("Не вдалося відправити номер", "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="left-banner">
        <span>Lenovo | shop</span>
      </div>

      <button
        className="phone-button"
        onClick={() => {
          setPhoneOpen(true);
          setPhoneDone(false);
        }}
      >
        <PhoneInTalkIcon />
      </button>

      {phoneOpen && (
        <div className="phone-modal">
          {!phoneDone ? (
            <>
              <button
                className="phone-modal-close"
                onClick={() => setPhoneOpen(false)}
                disabled={isSending}
              >
                ×
              </button>

              <h3>Зворотний дзвінок</h3>

              <p>
                Введіть номер телефону, і наш оператор звʼяжеться з вами. Email ми візьмемо з акаунта.
              </p>

              <input
                placeholder="+380..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSending}
              />

              <button className="phone-modal-send" onClick={sendPhone} disabled={isSending}>
                {isSending ? "Відправляємо..." : "Відправити"}
              </button>
            </>
          ) : (
            <div className="phone-success">
              <h3>Дякуємо!</h3>

              <p>З вами звʼяжеться оператор.</p>

              <button
                onClick={() => {
                  setPhoneOpen(false);
                  setPhone("");
                  setPhoneDone(false);
                }}
              >
                Добре
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default LeftBanner;
