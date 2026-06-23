import { useState } from "react";
import PromotionsPage from "./pages/PromotionsPage/PromotionsPage";
import LeftBanner from "./components/LeftBanner/LeftBanner";
import TopPromoSlider from "./components/TopPromoSlider/TopPromoSlider";
import Header from "./components/Header/Header";
import DeliveryPaymentPage from "./pages/DeliveryPaymentPage/DeliveryPaymentPage";
import MainSearch from "./components/MainSearch/MainSearch";
import Banners from "./components/Banners/Banners";
import CategoryGrid from "./components/CategoryGrid/CategoryGrid";
import ProductGrid from "./components/ProductGrid/ProductGrid";
import Benefits from "./components/Benefits/Benefits";
import LenovoInfo from "./components/LenovoInfo/LenovoInfo";
import BenefitsPage from "./pages/BenefitsPage/BenefitsPage";
import Footer from "./components/Footer/Footer";
import RightFixedButtons from "./components/RightFixedButtons/RightFixedButtons";
import ReturnExchangePage from "./pages/ReturnExchangePage/ReturnExchangePage";
import "./App.css";
import ContactsPage from "./pages/ContactsPage/ContactsPage";
function App() {
  const [page, setPage] =
   useState<
  "home" | "benefits" | "laptops" | "tablets" | "motorola" | "promotions" | "deliveryPayment" | "searchCategory" |
 "returnExchange"|"contacts"
>("home");
const footerProps = {
  openDeliveryPaymentPage: () => setPage("deliveryPayment"),
  openReturnExchangePage: () => setPage("returnExchange"),
  openBenefitsPage: () => setPage("benefits"),
  openContactsPage: () => setPage("contacts"),
  openSearchCategory: (title: string, keyword: string) => {
  setCategoryTitle(title);
  setCategoryKeyword(keyword);
  setPage("searchCategory");
},
};
const [categoryTitle, setCategoryTitle] = useState("");
const [categoryKeyword, setCategoryKeyword] = useState("");
  if (page === "benefits") {
    return (
      <>
        <LeftBanner />
        <RightFixedButtons />
        <TopPromoSlider />

        <Header
          openLaptopsPage={() => setPage("laptops")}
          openTabletsPage={() => setPage("tablets")}
          openPromotionsPage={() => setPage("promotions")}
          openSearchCategory={(title, keyword) => {
  setCategoryTitle(title);
  setCategoryKeyword(keyword);
  setPage("searchCategory");
}}
          
        />

        <BenefitsPage goHome={() => setPage("home")} />
      </>
    );
  }
  if (page === "returnExchange") {
  return (
    <>
      <LeftBanner />
      <RightFixedButtons />
      <TopPromoSlider />

      <Header
        openLaptopsPage={() => setPage("laptops")}
        openTabletsPage={() => setPage("tablets")}
        openMotorolaPage={() => setPage("motorola")}
        openPromotionsPage={() => setPage("promotions")}
      />

      <ReturnExchangePage
        goHome={() => setPage("home")}
        openDeliveryPaymentPage={() =>
          setPage("deliveryPayment")
        }
      />

     <Footer {...footerProps} 
        openDeliveryPaymentPage={() =>
          setPage("deliveryPayment")
        }
        openReturnExchangePage={() =>
          setPage("returnExchange")
        }
      />
    </>
  );
}
if (page === "contacts") {
  return (
    <>
      <LeftBanner />
      <RightFixedButtons />
      <TopPromoSlider />

      <Header
        openLaptopsPage={() => setPage("laptops")}
        openTabletsPage={() => setPage("tablets")}
        openMotorolaPage={() => setPage("motorola")}
        openPromotionsPage={() => setPage("promotions")}
      />

      <ContactsPage
        goHome={() => setPage("home")}
      />

      <Footer {...footerProps} 
        openDeliveryPaymentPage={() =>
          setPage("deliveryPayment")
        }

        openReturnExchangePage={() =>
          setPage("returnExchange")
        }

        openBenefitsPage={() =>
          setPage("benefits")
        }

        openContactsPage={() =>
          setPage("contacts")
        }
      />

    </>
  );
}
  if (page === "deliveryPayment") {
  return (
    <>
      <LeftBanner />
      <RightFixedButtons />
      <TopPromoSlider />

      <Header
        openLaptopsPage={() => setPage("laptops")}
        openTabletsPage={() => setPage("tablets")}
        openMotorolaPage={() => setPage("motorola")}
        openPromotionsPage={() => setPage("promotions")}
      />

      <DeliveryPaymentPage goHome={() => setPage("home")} />

      <Footer {...footerProps}  openDeliveryPaymentPage={() => setPage("deliveryPayment")} />
    </>
  );
}
  if (page === "promotions") {
  return (
    <>
      <LeftBanner />
      <RightFixedButtons />
      <TopPromoSlider />

      <Header
        openLaptopsPage={() => setPage("laptops")}
        openTabletsPage={() => setPage("tablets")}
        openPromotionsPage={() => setPage("promotions")}
        openSearchCategory={(title, keyword) => {
  setCategoryTitle(title);
  setCategoryKeyword(keyword);
  setPage("searchCategory");
}}

      />

      <PromotionsPage goHome={() => setPage("home")} />
    </>
  );
}

  if (page === "laptops") {
    return (
      <>
        <LeftBanner />
        <RightFixedButtons />
        <TopPromoSlider />

        <Header
          openLaptopsPage={() => setPage("laptops")}
          openTabletsPage={() => setPage("tablets")}
          openMotorolaPage={() => setPage("motorola")}
          openPromotionsPage={() => setPage("promotions")}
          openSearchCategory={(title, keyword) => {
  setCategoryTitle(title);
  setCategoryKeyword(keyword);
  setPage("searchCategory");
}}
        />

        <main className="page-content">
          <div className="container">
            <button
              className="back-home-btn"
              onClick={() => setPage("home")}
            >
              ← На головну
            </button>

            <MainSearch
  onSearch={(value) => {
    setCategoryTitle(`Пошук: ${value}`);
    setCategoryKeyword(value);
    setPage("searchCategory");
  }}
/>
            <Banners />

            <ProductGrid
              title="Ноутбуки"
              categoryKeyword="ноутбук"
              showPagination={true}
            />
          </div>

          <Footer {...footerProps} />
        </main>
      </>
    );
  }
  if (page === "motorola") {
  return (
    <>
      <LeftBanner />
      <RightFixedButtons />
      <TopPromoSlider />

      <Header
        openLaptopsPage={() => setPage("laptops")}
        openTabletsPage={() => setPage("tablets")}
        openMotorolaPage={() => setPage("motorola")}
        openPromotionsPage={() => setPage("promotions")}
        openSearchCategory={(title, keyword) => {
  setCategoryTitle(title);
  setCategoryKeyword(keyword);
  setPage("searchCategory");
}}
      />

      <main className="page-content">
        <div className="container">
          <button
            className="back-home-btn"
            onClick={() => setPage("home")}
          >
            ← На головну
          </button>

          <MainSearch
  onSearch={(value) => {
    setCategoryTitle(`Пошук: ${value}`);
    setCategoryKeyword(value);
    setPage("searchCategory");
  }}
/>
          <Banners />

          <ProductGrid
  title="Смартфони Motorola"
  categoryKeyword="motorola"
  showPagination={true}
  filterType="motorola"
/>
        </div>

        <Footer {...footerProps} />
      </main>
    </>
  );
}
if (page === "searchCategory") {
  return (
    <>
      <LeftBanner />
      <RightFixedButtons />
      <TopPromoSlider />

      <Header
        openLaptopsPage={() => setPage("laptops")}
        openTabletsPage={() => setPage("tablets")}
        openMotorolaPage={() => setPage("motorola")}
        openPromotionsPage={() => setPage("promotions")}
        openSearchCategory={(title, keyword) => {
          setCategoryTitle(title);
          setCategoryKeyword(keyword);
          setPage("searchCategory");
        }}
      />

      <main className="page-content">
        <div className="container">
          <button
            className="back-home-btn"
            onClick={() => setPage("home")}
          >
            ← На головну
          </button>

          <MainSearch
  onSearch={(value) => {
    setCategoryTitle(`Пошук: ${value}`);
    setCategoryKeyword(value);
    setPage("searchCategory");
  }}
/>
          <Banners />

          <ProductGrid
  title={categoryTitle}
  categoryKeyword={categoryKeyword}
  showPagination={true}
  filterType="simple"
/>
        </div>

        <Footer {...footerProps} />
      </main>
    </>
  );
}

  if (page === "tablets") {
    return (
      <>
        <LeftBanner />
        <RightFixedButtons />
        <TopPromoSlider />

        <Header
          openLaptopsPage={() => setPage("laptops")}
          openTabletsPage={() => setPage("tablets")}
          openMotorolaPage={() => setPage("motorola")}
          openPromotionsPage={() => setPage("promotions")}
          openSearchCategory={(title, keyword) => {
  setCategoryTitle(title);
  setCategoryKeyword(keyword);
  setPage("searchCategory");
}}
        />

        <main className="page-content">
          <div className="container">
            <button
              className="back-home-btn"
              onClick={() => setPage("home")}
            >
              ← На головну
            </button>

            <MainSearch
  onSearch={(value) => {
    setCategoryTitle(`Пошук: ${value}`);
    setCategoryKeyword(value);
    setPage("searchCategory");
  }}
/>
            <Banners />

            <ProductGrid
  title="Планшети"
  categoryKeyword="планшет"
  showPagination={true}
  filterType="tablet"
/>
          </div>

          <Footer {...footerProps} />
        </main>
      </>
    );
  }
  

  return (
    <>
      <LeftBanner />
      <RightFixedButtons />
      <TopPromoSlider />

      <Header
        openLaptopsPage={() => setPage("laptops")}
        openTabletsPage={() => setPage("tablets")}
        openMotorolaPage={() => setPage("motorola")}
        openPromotionsPage={() => setPage("promotions")}
        openSearchCategory={(title, keyword) => {
  setCategoryTitle(title);
  setCategoryKeyword(keyword);
  setPage("searchCategory");
}}
      />

      <main className="page-content">
        <div className="container">
          <MainSearch
  onSearch={(value) => {
    setCategoryTitle(`Пошук: ${value}`);
    setCategoryKeyword(value);
    setPage("searchCategory");
  }}
/>
          <Banners />
          <CategoryGrid />
          <ProductGrid />

          <Benefits openBenefitsPage={() => setPage("benefits")} />

          <LenovoInfo />
        </div>

       <Footer {...footerProps} 
 openDeliveryPaymentPage={() =>
   setPage("deliveryPayment")
 }

 openReturnExchangePage={() =>
   setPage("returnExchange")
 }

 openBenefitsPage={() =>
   setPage("benefits")
 }

 openContactsPage={() =>
   setPage("contacts")
 }
/>
      </main>
    </>
  );
}

export default App;