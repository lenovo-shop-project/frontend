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
  const [page, setPage] = useState<"home" | "benefits">("home");

  if (page === "benefits") {
    return (
      <>
        <LeftBanner />
        <RightFixedButtons />
        <TopPromoSlider />
        <Header />
        <BenefitsPage goHome={() => setPage("home")} />
      </>
    );
  }

  return (
    <>
      <LeftBanner />
      <RightFixedButtons />

      <TopPromoSlider />
      <Header />

      <main className="page-content">

  <div className="container">

    <MainSearch />

    <Banners />

    <CategoryGrid />

    <ProductGrid />

    <Benefits 
      openBenefitsPage={() => setPage("benefits")}
    />

    <LenovoInfo />

  </div>

  <Footer />

</main>
    </>
  );
}

export default App;