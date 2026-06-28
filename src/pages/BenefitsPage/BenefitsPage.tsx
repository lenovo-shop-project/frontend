import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShieldIcon from "@mui/icons-material/Shield";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./BenefitsPage.css";

interface Props {
  goHome: () => void;
}

const benefits = [
  {
    icon: <LocalShippingIcon />,
    color: "green",
    title: "Безкоштовна доставка до дверей",
    text: "Безкоштовна адресна доставка гарантує, що всі ваші покупки будуть доставлені прямо до ваших дверей.",
  },
  {
    icon: <ShieldIcon />,
    color: "orange",
    title: "Преміум гарантія — заберемо, поремонтуємо, привеземо",
    text: "Послуга преміум гарантії включає ремонт, перевірку пристрою та комфортний сервіс.",
  },
  {
    icon: <FavoriteBorderIcon />,
    color: "red",
    title: "Твоя довіра — наш пріоритет: оплачуй після огляду",
    text: "Купуйте зручно та безпечно: спочатку перевіряйте товар, а потім оплачуйте.",
  },
  {
    icon: <CardGiftcardIcon />,
    color: "red",
    title: "+1 рік гарантії на спеціальні пропозиції",
    text: "На окремі акційні товари можна отримати додатковий рік гарантійного обслуговування.",
  },
  {
    icon: <MonetizationOnIcon />,
    color: "gold",
    title: "Бонуси за кожну покупку",
    text: "Отримуйте бонуси за покупки та використовуйте їх для наступних замовлень.",
  },
  {
    icon: <SupportAgentIcon />,
    color: "blue",
    title: "Кваліфіковані консультанти",
    text: "Фахівці допоможуть підібрати ноутбук, планшет, смартфон або аксесуари під ваші задачі.",
  },
  {
    icon: <AutorenewIcon />,
    color: "purple",
    title: "Легкий Trade-In без очікувань",
    text: "Обмінюйте старий пристрій і отримуйте вигоду при купівлі нового товару.",
  },
  {
    icon: <AccountBalanceIcon />,
    color: "yellow",
    title: "Розстрочка від зручних для Вас банків",
    text: "Купуйте техніку Lenovo частинами через партнерські банки.",
  },
];

const BenefitsPage = ({ goHome }: Props) => {
  return (
    <main className="benefits-page">
      <button className="back-button" onClick={goHome}>
        <ArrowBackIcon />
        На головну
      </button>

      <h1>8 переваг, чому треба обрати shop.lenovo.ua</h1>

      <div className="benefits-page-grid">
        {benefits.map((item, index) => (
          <div className="benefits-page-card" key={index}>
            <div className={`benefits-page-icon ${item.color}`}>
              {item.icon}
            </div>

            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default BenefitsPage;