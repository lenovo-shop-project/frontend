import { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import PaidIcon from "@mui/icons-material/Paid";
import "./TopPromoSlider.css";

const promoItems = [
  {
    text: "Твоя довіра — наш пріоритет: оплачуй після огляду",
    icon: <FavoriteBorderIcon />,
    color: "#f40000",
  },
  {
    text: "Ексклюзивні умови на trade-in планшетів",
    icon: <AutorenewIcon />,
    color: "#6a00b9",
  },
  {
    text: "+1 рік гарантії на спеціальні пропозиції",
    icon: <CardGiftcardIcon />,
    color: "#f40000",
  },
  {
    text: "Вмикай вигоду: до 5% бонусами на SHOP.LENOVO.UA",
    icon: <PaidIcon />,
    color: "#d8a51d",
  },
];

const TopPromoSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % promoItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="top-promo-slider">
      <div key={activeIndex} className="promo-slide">
        <div
          className="promo-icon"
          style={{ backgroundColor: promoItems[activeIndex].color }}
        >
          {promoItems[activeIndex].icon}
        </div>

        <span>{promoItems[activeIndex].text}</span>
      </div>
    </div>
  );
};

export default TopPromoSlider;