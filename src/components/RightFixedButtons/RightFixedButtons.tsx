import { useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ChatIcon from "@mui/icons-material/Chat";
import { BASE_URL } from "../../config";
import { showNotification } from "../../utils/notifications";
import "./RightFixedButtons.css";

const RightFixedButtons = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatDone, setChatDone] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const getToken = () => {
    return localStorage.getItem("access_token") || localStorage.getItem("token");
  };

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const sendMessage = async () => {
    const token = getToken();

    if (!token) {
      showNotification("Спочатку увійдіть в акаунт", "warning");
      return;
    }

    if (message.trim().length < 2) {
      showNotification("Напишіть повідомлення", "warning");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(`${BASE_URL}/client/contact-messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: message.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        showNotification(data?.detail || "Не вдалося відправити звернення", "error");
        return;
      }

      setChatDone(true);
      setMessage("");
      showNotification("Звернення відправлено адміну", "success");
    } catch (error) {
      console.error("SEND CONTACT MESSAGE ERROR:", error);
      showNotification("Не вдалося відправити звернення", "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="right-fixed-buttons">
        <button className="right-fixed-button" onClick={scrollTop}>
          <KeyboardArrowUpIcon />
        </button>

        <button
          className="right-fixed-button chat-button"
          onClick={() => setChatOpen(true)}
        >
          <ChatIcon />
          <span></span>
        </button>
      </div>

      {chatOpen && (
        <div className="support-window">
          {!chatDone ? (
            <>
              <button
                className="close-support"
                onClick={() => setChatOpen(false)}
                disabled={isSending}
              >
                ×
              </button>

              <h3>Команда Shop Lenovo</h3>

              <p>
                Вітаємо 👋 <br />
                Напишіть питання, а email ми візьмемо з вашого акаунта.
              </p>

              <textarea
                placeholder="Ваше питання"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSending}
              />

              <button
                className="send-support"
                onClick={sendMessage}
                disabled={isSending}
              >
                {isSending ? "Відправляємо..." : "Відправити"}
              </button>
            </>
          ) : (
            <div className="success-message">
              <h3>✅ Звернення прийняте</h3>

              <p>Очікуйте відповідь впродовж доби</p>

              <button
                onClick={() => {
                  setChatDone(false);
                  setChatOpen(false);
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

export default RightFixedButtons;
