import LeftBanner from "./components/LeftBanner/LeftBanner";
import TopPromoSlider from "./components/TopPromoSlider/TopPromoSlider";
import Header from "./components/Header/Header";
import MainSearch from "./components/MainSearch/MainSearch";
import Banners from "./components/Banners/Banners";
import "./App.css";
import CategoryGrid from "./components/CategoryGrid/CategoryGrid";

function App() {
  return (
    <>
      <LeftBanner />
      <TopPromoSlider />
      <Header />

      <main className="page-content">
        <MainSearch />
        <Banners />
        <CategoryGrid />
      </main>
    </>
  );
}

export default App;