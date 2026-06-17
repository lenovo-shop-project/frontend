import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShieldIcon from "@mui/icons-material/Shield";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import "./Benefits.css";

interface Props {
  openBenefitsPage: () => void;
}

const benefits = [
  {
    icon: <LocalShippingIcon />,
    color: "green",
    title: "Безкоштовна доставка до дверей",
  },
  {
    icon: <ShieldIcon />,
    color: "orange",
    title: "Преміум гарантія — заберемо, поремонтуємо, привеземо",
  },
  {
    icon: <FavoriteBorderIcon />,
    color: "red",
    title: "Твоя довіра — наш пріоритет: оплачуй після огляду",
  },
  {
    icon: <CardGiftcardIcon />,
    color: "red",
    title: "+1 рік гарантії на спеціальні пропозиції",
  },
  {
    icon: <MonetizationOnIcon />,
    color: "gold",
    title: "Бонуси за кожну покупку",
  },
  {
    icon: <SupportAgentIcon />,
    color: "blue",
    title: "Кваліфіковані консультанти",
  },
  {
    icon: <AutorenewIcon />,
    color: "purple",
    title: "Легкий Trade-In без очікувань",
  },
  {
    icon: <AccountBalanceIcon />,
    color: "yellow",
    title: "Розстрочка від зручних для Вас банків",
  },
];

const Benefits = ({ openBenefitsPage }: Props) => {
  return (
    <section className="benefits">
      <h2>Переваги Lenovo Shop</h2>

      <div className="benefits-small">
        {benefits.map((item, index) => (
          <div className="benefit-small-card" key={index}>
            <div className={`benefit-icon ${item.color}`}>{item.icon}</div>
            <h4>{item.title}</h4>
          </div>
        ))}
      </div>

      <button className="details-btn" onClick={openBenefitsPage}>
        Детальніше про переваги
      </button>
    </section>
  );
};

export default Benefits;