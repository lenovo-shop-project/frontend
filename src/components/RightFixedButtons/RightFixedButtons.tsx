import { useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ChatIcon from "@mui/icons-material/Chat";
import "./RightFixedButtons.css";

const RightFixedButtons = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatDone, setChatDone] = useState(false);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
              >
                ×
              </button>

              <h3>Команда Shop Lenovo</h3>

              <p>
                Вітаємо 👋 <br />
                Надішліть своє питання сюди
              </p>

              <textarea placeholder="Ваше питання" />

              <input placeholder="Ваш email" />

              <button
                className="send-support"
                onClick={() => setChatDone(true)}
              >
                Відправити
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