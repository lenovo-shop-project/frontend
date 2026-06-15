import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import "./LeftBanner.css";

const LeftBanner = () => {
  return (
    <>
      <div className="left-banner">
        <span>Lenovo | shop</span>
      </div>

      <button className="phone-button">
        <PhoneInTalkIcon />
      </button>
    </>
  );
};

export default LeftBanner;