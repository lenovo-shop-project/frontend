import { useEffect, useState } from "react";
import {
  getVisibleSitePromotions,
  SITE_CONTENT_CHANGED_EVENT,
  type SitePromotion,
} from "../../utils/siteContent";
import "./PromotionsPage.css";

interface Props {
  goHome: () => void;
}

const PromotionsPage = ({ goHome }: Props) => {
  const [activeTab, setActiveTab] = useState<"active" | "archive">("active");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [promotions, setPromotions] = useState<SitePromotion[]>(() =>
    getVisibleSitePromotions()
  );

  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 4,
    minutes: 45,
    seconds: 35,
  });

  const reloadPromotions = () => {
    setPromotions(getVisibleSitePromotions());
  };

  useEffect(() => {
    window.addEventListener(SITE_CONTENT_CHANGED_EVENT, reloadPromotions);
    window.addEventListener("storage", reloadPromotions);

    return () => {
      window.removeEventListener(SITE_CONTENT_CHANGED_EVENT, reloadPromotions);
      window.removeEventListener("storage", reloadPromotions);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }

        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }

        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }

        if (prev.days > 0) {
          return {
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        }

        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const types = Array.from(new Set(promotions.map((promo) => promo.type)));
  const categories = Array.from(
    new Set(promotions.map((promo) => promo.category))
  );

  const filteredPromotions = promotions.filter((promo) => {
    if (activeTab === "active" && promo.is_archive) return false;
    if (activeTab === "archive" && !promo.is_archive) return false;

    const typeMatch =
      selectedTypes.length === 0 || selectedTypes.includes(promo.type);

    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(promo.category);

    return typeMatch && categoryMatch;
  });

  return (
    <main className="promotions-page">
      <button className="promotions-back" onClick={goHome}>
        ← На головну
      </button>

      <div className="promotions-breadcrumbs">Головна / Акції</div>

      <h1>
        Акції <span>(знайдено {filteredPromotions.length} акції)</span>
      </h1>

      <div className="promotions-layout">
        <aside className="promotions-filters">
          <div className="promotions-tabs">
            <button
              className={activeTab === "active" ? "active" : ""}
              onClick={() => setActiveTab("active")}
            >
              Діючі акції
            </button>

            <button
              className={activeTab === "archive" ? "active" : ""}
              onClick={() => setActiveTab("archive")}
            >
              Архівні акції
            </button>
          </div>

          <div className="promo-filter-block">
            <h3>Тип</h3>

            {types.map((type) => (
              <label key={type}>
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => toggleType(type)}
                />
                {type}
              </label>
            ))}
          </div>

          <div className="promo-filter-block">
            <h3>Категорії</h3>

            {categories.map((category) => (
              <label key={category}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                />
                {category}
              </label>
            ))}
          </div>
        </aside>

        <section className="promotions-list">
          {filteredPromotions.map((promo) => (
            <article className="promo-card" key={promo.id}>
              <div className="promo-image-box">
                <img src={promo.image} alt={promo.title} />

                <div className="promo-timer">
                  <div>
                    <b>{String(timeLeft.days).padStart(2, "0")}</b>
                    <span>днів</span>
                  </div>

                  <span>:</span>

                  <div>
                    <b>{String(timeLeft.hours).padStart(2, "0")}</b>
                    <span>годин</span>
                  </div>

                  <span>:</span>

                  <div>
                    <b>{String(timeLeft.minutes).padStart(2, "0")}</b>
                    <span>хвилин</span>
                  </div>

                  <span>:</span>

                  <div>
                    <b>{String(timeLeft.seconds).padStart(2, "0")}</b>
                    <span>секунд</span>
                  </div>
                </div>
              </div>

              <div className="promo-title">{promo.title}</div>
            </article>
          ))}

          {filteredPromotions.length === 0 && (
            <div className="empty-promotions">Акцій поки немає</div>
          )}
        </section>
      </div>
    </main>
  );
};

export default PromotionsPage;
