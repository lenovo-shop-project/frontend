import { useState } from "react";
import PromotionsPage from "./pages/PromotionsPage/PromotionsPage";
import LeftBanner from "./components/LeftBanner/LeftBanner";
import TopPromoSlider from "./components/TopPromoSlider/TopPromoSlider";
import Header from "./components/Header/Header";
import DeliveryPaymentPage from "./pages/DeliveryPaymentPage/DeliveryPaymentPage";
import MainSearch from "./components/MainSearch/MainSearch";

import CategoryGrid from "./components/CategoryGrid/CategoryGrid";
import ProductGrid from "./components/ProductGrid/ProductGrid";
import Benefits from "./components/Benefits/Benefits";
import LenovoInfo from "./components/LenovoInfo/LenovoInfo";
import BenefitsPage from "./pages/BenefitsPage/BenefitsPage";
import Footer from "./components/Footer/Footer";
import RightFixedButtons from "./components/RightFixedButtons/RightFixedButtons";
import ReturnExchangePage from "./pages/ReturnExchangePage/ReturnExchangePage";
import ContactsPage from "./pages/ContactsPage/ContactsPage";
import Banners from "./components/Banners/Banners";
import "./App.css";

function App() {
  const [page, setPage] = useState<
    | "home"
    | "benefits"
    | "laptops"
    | "tablets"
    | "motorola"
    | "promotions"
    | "deliveryPayment"
    | "searchCategory"
    | "returnExchange"
    | "contacts"
  >("home");

  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryKeyword, setCategoryKeyword] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

  const scrollToProducts = () => {
    setTimeout(() => {
      document
        .getElementById("product-grid-anchor")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const openSearchCategory = (
    title: string,
    keyword: string,
    id?: number
  ) => {
    setCategoryTitle(title);
    setCategoryKeyword(keyword);
    setCategoryId(id);
    setPage("searchCategory");
    scrollToProducts();
  };

  const openSiteSearch = (value: string) => {
    setCategoryTitle(`Пошук: ${value}`);
    setCategoryKeyword(value);
    setCategoryId(undefined);
    setPage("searchCategory");
    scrollToProducts();
  };

  const headerProps = {
    openPromotionsPage: () => setPage("promotions"),
    openSearchCategory,
  };

  const footerProps = {
    openDeliveryPaymentPage: () => setPage("deliveryPayment"),
    openReturnExchangePage: () => setPage("returnExchange"),
    openBenefitsPage: () => setPage("benefits"),
    openContactsPage: () => setPage("contacts"),
    openSearchCategory,
  };

  if (page === "benefits") {
    return (
      <>
        <LeftBanner />
        <RightFixedButtons />
        <TopPromoSlider />

        <Header {...headerProps} />

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

        <Header {...headerProps} />

        <ReturnExchangePage
          goHome={() => setPage("home")}
          openDeliveryPaymentPage={() => setPage("deliveryPayment")}
        />

        <Footer {...footerProps} />
      </>
    );
  }

  if (page === "contacts") {
    return (
      <>
        <LeftBanner />
        <RightFixedButtons />
        <TopPromoSlider />

        <Header {...headerProps} />

        <ContactsPage goHome={() => setPage("home")} />

        <Footer {...footerProps} />
      </>
    );
  }

  if (page === "deliveryPayment") {
    return (
      <>
        <LeftBanner />
        <RightFixedButtons />
        <TopPromoSlider />

        <Header {...headerProps} />

        <DeliveryPaymentPage goHome={() => setPage("home")} />

        <Footer {...footerProps} />
      </>
    );
  }

  if (page === "promotions") {
    return (
      <>
        <LeftBanner />
        <RightFixedButtons />
        <TopPromoSlider />

        <Header {...headerProps} />

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

        <Header {...headerProps} />

        <main className="page-content">
          <div className="container">
            <MainSearch onSearch={openSiteSearch} />

            <Banners />

            <ProductGrid
              title="Ноутбуки"
              categoryId={1}
              showPagination={true}
              onClose={() => setPage("home")}
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

        <Header {...headerProps} />

        <main className="page-content">
          <div className="container">
            <MainSearch onSearch={openSiteSearch} />

            <Banners />

            <ProductGrid
              title="Смартфони Motorola"
              categoryId={3}
              showPagination={true}
              filterType="motorola"
              onClose={() => setPage("home")}
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

        <Header {...headerProps} />

        <main className="page-content">
          <div className="container">
            <MainSearch onSearch={openSiteSearch} />

            <Banners />

            <ProductGrid
              title={categoryTitle}
              categoryKeyword={categoryKeyword}
              categoryId={categoryId}
              showPagination={true}
              filterType="simple"
              onClose={() => setPage("home")}
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

        <Header {...headerProps} />

        <main className="page-content">
          <div className="container">
            <MainSearch onSearch={openSiteSearch} />

            <Banners />

            <ProductGrid
              title="Планшети"
              categoryId={2}
              showPagination={true}
              filterType="tablet"
              onClose={() => setPage("home")}
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

      <Header {...headerProps} />

      <main className="page-content">
        <div className="container">
          <MainSearch onSearch={openSiteSearch} />

          <Banners />

          <CategoryGrid openSearchCategory={openSearchCategory} />

          <ProductGrid />

          <Benefits openBenefitsPage={() => setPage("benefits")} />

          <LenovoInfo />
        </div>

        <Footer {...footerProps} />
      </main>
    </>
  );
}

export default App;