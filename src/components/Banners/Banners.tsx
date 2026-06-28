import { useEffect, useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  fetchBackendCatalogBanner,
  getActiveSiteBanners,
  SITE_CONTENT_CHANGED_EVENT,
  type SiteBanner,
} from "../../utils/siteContent";
import "./Banners.css";

const Banners = () => {
  const [topBanners, setTopBanners] = useState<SiteBanner[]>(() =>
    getActiveSiteBanners("top")
  );
  const [bottomBanners, setBottomBanners] = useState<SiteBanner[]>(() =>
    getActiveSiteBanners("bottom")
  );

  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);

  const reloadBanners = async () => {
    const localTopBanners = getActiveSiteBanners("top");
    const backendBanner = await fetchBackendCatalogBanner();

    setTopBanners(backendBanner ? [backendBanner, ...localTopBanners] : localTopBanners);
    setBottomBanners(getActiveSiteBanners("bottom"));
  };

  useEffect(() => {
    reloadBanners();

    window.addEventListener(SITE_CONTENT_CHANGED_EVENT, reloadBanners);
    window.addEventListener("storage", reloadBanners);

    return () => {
      window.removeEventListener(SITE_CONTENT_CHANGED_EVENT, reloadBanners);
      window.removeEventListener("storage", reloadBanners);
    };
  }, []);

  useEffect(() => {
    if (topIndex >= topBanners.length) setTopIndex(0);
  }, [topBanners.length, topIndex]);

  useEffect(() => {
    if (bottomIndex >= bottomBanners.length) setBottomIndex(0);
  }, [bottomBanners.length, bottomIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTopIndex((prev) =>
        topBanners.length > 0 ? (prev + 1) % topBanners.length : 0
      );
      setBottomIndex((prev) =>
        bottomBanners.length > 0 ? (prev + 1) % bottomBanners.length : 0
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [topBanners.length, bottomBanners.length]);

  const prevTop = () => {
    setTopIndex((prev) =>
      topBanners.length > 0
        ? (prev - 1 + topBanners.length) % topBanners.length
        : 0
    );
  };

  const nextTop = () => {
    setTopIndex((prev) =>
      topBanners.length > 0 ? (prev + 1) % topBanners.length : 0
    );
  };

  const prevBottom = () => {
    setBottomIndex((prev) =>
      bottomBanners.length > 0
        ? (prev - 1 + bottomBanners.length) % bottomBanners.length
        : 0
    );
  };

  const nextBottom = () => {
    setBottomIndex((prev) =>
      bottomBanners.length > 0 ? (prev + 1) % bottomBanners.length : 0
    );
  };

  return (
    <section className="banners-section">
      <h2>Акції</h2>

      <div className="banner-slider">
        <div
          className="slider-track"
          style={{ transform: `translateX(-${topIndex * 100}%)` }}
        >
          {topBanners.map((banner) => (
            <img key={banner.id} src={banner.image} alt={banner.title} />
          ))}
        </div>

        {topBanners.length > 1 && (
          <>
            <button className="banner-arrow left" onClick={prevTop}>
              <KeyboardArrowLeftIcon />
            </button>

            <button className="banner-arrow right" onClick={nextTop}>
              <KeyboardArrowRightIcon />
            </button>
          </>
        )}
      </div>

      {topBanners.length > 1 && (
        <div className="banner-dots">
          {topBanners.map((banner, index) => (
            <button
              key={banner.id}
              className={topIndex === index ? "active" : ""}
              onClick={() => setTopIndex(index)}
            />
          ))}
        </div>
      )}

      <div className="banner-slider bottom-banner">
        <div
          className="slider-track"
          style={{ transform: `translateX(-${bottomIndex * 100}%)` }}
        >
          {bottomBanners.map((banner) => (
            <img key={banner.id} src={banner.image} alt={banner.title} />
          ))}
        </div>

        {bottomBanners.length > 1 && (
          <>
            <button className="banner-arrow left" onClick={prevBottom}>
              <KeyboardArrowLeftIcon />
            </button>

            <button className="banner-arrow right" onClick={nextBottom}>
              <KeyboardArrowRightIcon />
            </button>
          </>
        )}
      </div>

      {bottomBanners.length > 1 && (
        <div className="banner-dots">
          {bottomBanners.map((banner, index) => (
            <button
              key={banner.id}
              className={bottomIndex === index ? "active" : ""}
              onClick={() => setBottomIndex(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Banners;
