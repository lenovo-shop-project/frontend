import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ChatIcon from "@mui/icons-material/Chat";
import "./RightFixedButtons.css";

const RightFixedButtons = () => {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="right-fixed-buttons">
      <button className="right-fixed-button" onClick={scrollTop}>
        <KeyboardArrowUpIcon />
      </button>

      <button className="right-fixed-button chat-button">
        <ChatIcon />
        <span></span>
      </button>
    </div>
  );
};

export default RightFixedButtons;