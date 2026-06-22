import { useState } from "react";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import "./LeftBanner.css";

const LeftBanner = () => {
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [phoneDone, setPhoneDone] = useState(false);
  const [phone, setPhone] = useState("");

  const sendPhone = () => {
    if (!phone.trim()) {
      alert("Введіть номер телефону");
      return;
    }

    setPhoneDone(true);
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
              >
                ×
              </button>

              <h3>Зворотний дзвінок</h3>

              <p>
                Введіть номер телефону, і наш оператор зв'яжеться з вами.
              </p>

              <input
                placeholder="+380..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <button className="phone-modal-send" onClick={sendPhone}>
                Відправити
              </button>
            </>
          ) : (
            <div className="phone-success">
              <h3>Дякуємо!</h3>

              <p>З вами зв'яжеться оператор.</p>

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