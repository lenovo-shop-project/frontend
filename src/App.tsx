import { useState } from "react";

import LeftBanner from "./components/LeftBanner/LeftBanner";
import TopPromoSlider from "./components/TopPromoSlider/TopPromoSlider";
import Header from "./components/Header/Header";

import MainSearch from "./components/MainSearch/MainSearch";
import Banners from "./components/Banners/Banners";
import CategoryGrid from "./components/CategoryGrid/CategoryGrid";
import ProductGrid from "./components/ProductGrid/ProductGrid";
import Benefits from "./components/Benefits/Benefits";
import LenovoInfo from "./components/LenovoInfo/LenovoInfo";
import BenefitsPage from "./pages/BenefitsPage/BenefitsPage";
import Footer from "./components/Footer/Footer";
import RightFixedButtons from "./components/RightFixedButtons/RightFixedButtons";

import "./App.css";

function App() {
  const [page, setPage] =
    useState<"home" | "benefits" | "laptops" | "tablets" | "motorola">("home");

  if (page === "benefits") {
    return (
      <>
        <LeftBanner />
        <RightFixedButtons />
        <TopPromoSlider />

        <Header
          openLaptopsPage={() => setPage("laptops")}
          openTabletsPage={() => setPage("tablets")}
        />

        <BenefitsPage goHome={() => setPage("home")} />
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
        />

        <main className="page-content">
          <div className="container">
            <button
              className="back-home-btn"
              onClick={() => setPage("home")}
            >
              ← На головну
            </button>

            <MainSearch />
            <Banners />

            <ProductGrid
              title="Ноутбуки"
              categoryKeyword="ноутбук"
              showPagination={true}
            />
          </div>

          <Footer />
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
      />

      <main className="page-content">
        <div className="container">
          <button
            className="back-home-btn"
            onClick={() => setPage("home")}
          >
            ← На головну
          </button>

          <MainSearch />
          <Banners />

          <ProductGrid
  title="Смартфони Motorola"
  categoryKeyword="motorola"
  showPagination={true}
  filterType="motorola"
/>
        </div>

        <Footer />
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
        />

        <main className="page-content">
          <div className="container">
            <button
              className="back-home-btn"
              onClick={() => setPage("home")}
            >
              ← На головну
            </button>

            <MainSearch />
            <Banners />

            <ProductGrid
  title="Планшети"
  categoryKeyword="планшет"
  showPagination={true}
  filterType="tablet"
/>
          </div>

          <Footer />
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
      />

      <main className="page-content">
        <div className="container">
          <MainSearch />
          <Banners />
          <CategoryGrid />
          <ProductGrid />

          <Benefits openBenefitsPage={() => setPage("benefits")} />

          <LenovoInfo />
        </div>

        <Footer />
      </main>
    </>
  );
}

export default App;