import "./CategoryGrid.css";

interface CategoryGridProps {
  openSearchCategory?: (title: string, keyword: string) => void;
}

const categories = [
  {
    title: "Ноутбуки",
    image: "/src/assets/images/categories/laptops.png",
    items: [
      { label: "Всі Ноутбуки ›", title: "Ноутбуки", keyword: "ноутбук" },
      { label: "ThinkPad", title: "ThinkPad", keyword: "thinkpad" },
      { label: "ThinkBook", title: "ThinkBook", keyword: "thinkbook" },
      { label: "Legion", title: "Legion", keyword: "legion" },
      { label: "LOQ ›", title: "LOQ", keyword: "loq" },
      { label: "Yoga", title: "Yoga", keyword: "yoga" },
      { label: "IdeaPad", title: "IdeaPad", keyword: "ideapad" },
    ],
  },
  {
    title: "Планшети",
    image: "/src/assets/images/categories/tablets.png",
    items: [
      { label: "Всі Планшети ›", title: "Планшети", keyword: "планшет" },
      { label: "Ігрові", title: "Ігрові планшети", keyword: "ігровий" },
      { label: "Для розваг ›", title: "Планшети для розваг", keyword: "розваг" },
      { label: "Для навчання", title: "Планшети для навчання", keyword: "навчання" },
      { label: "Високопродуктивні", title: "Високопродуктивні планшети", keyword: "потужний" },
    ],
  },
  {
    title: "Смартфони MOTOROLA",
    image: "/src/assets/images/categories/motorola.png",
    items: [
      { label: "Всі Смартфони ›", title: "Смартфони Motorola", keyword: "motorola" },
      { label: "Moto Razr", title: "Moto Razr", keyword: "razr" },
      { label: "Moto ThinkPhone", title: "Moto ThinkPhone", keyword: "thinkphone" },
      { label: "Moto Edge ›", title: "Moto Edge", keyword: "edge" },
      { label: "Moto E", title: "Moto E", keyword: "moto e" },
      { label: "Moto G", title: "Moto G", keyword: "moto g" },
    ],
  },
  {
    title: "Комп’ютери",
    image: "/src/assets/images/categories/computers.png",
    items: [
      { label: "Всі Комп’ютери ›", title: "Комп’ютери", keyword: "пк" },
      { label: "ThinkCentre", title: "ThinkCentre", keyword: "thinkcentre" },
      { label: "ThinkEdge", title: "ThinkEdge", keyword: "thinkedge" },
      { label: "ThinkStation", title: "ThinkStation", keyword: "thinkstation" },
      { label: "Legion", title: "Комп’ютери Legion", keyword: "legion" },
      { label: "LOQ ›", title: "Комп’ютери LOQ", keyword: "loq" },
    ],
  },
  {
    title: "Моноблоки",
    image: "/src/assets/images/categories/monoblocks.png",
    items: [
      { label: "Всі Моноблоки ›", title: "Моноблоки", keyword: "моноблок" },
      { label: "ThinkCentre", title: "Моноблоки ThinkCentre", keyword: "thinkcentre" },
      { label: "YOGA", title: "Моноблоки Yoga", keyword: "yoga" },
      { label: "IdeaCentre", title: "IdeaCentre", keyword: "ideacentre" },
      { label: "Lenovo A/V", title: "Lenovo A/V", keyword: "lenovo" },
    ],
  },
  {
    title: "Монітори",
    image: "/src/assets/images/categories/monitors.png",
    items: [
      { label: "Всі Монітори ›", title: "Монітори", keyword: "монітор" },
      { label: "Think", title: "Монітори Think", keyword: "think" },
      { label: "Legion", title: "Монітори Legion", keyword: "legion" },
      { label: "Lenovo ›", title: "Монітори Lenovo", keyword: "lenovo" },
    ],
  },
  {
    title: "Ігрові консолі",
    image: "/src/assets/images/categories/consoles.png",
    items: [
      { label: "Всі Ігрові консолі ›", title: "Ігрові консолі", keyword: "консоль" },
      { label: "Legion Go", title: "Legion Go", keyword: "legion go" },
      { label: "Аксесуари", title: "Аксесуари для консолей", keyword: "аксесуар" },
    ],
  },
  {
    title: "Інтерактивні Панелі",
    image: "/src/assets/images/categories/panels.png",
    items: [
      { label: "Всі Панелі ›", title: "Інтерактивні Панелі", keyword: "панель" },
      { label: "ThinkVision T86", title: "ThinkVision T86", keyword: "t86" },
      { label: "ThinkVision T75", title: "ThinkVision T75", keyword: "t75" },
      { label: "ThinkVision T65", title: "ThinkVision T65", keyword: "t65" },
    ],
  },
  {
    title: "Сервери",
    image: "/src/assets/images/categories/servers.png",
    items: [
      { label: "Всі Сервери ›", title: "Сервери", keyword: "сервер" },
      { label: "ThinkSystem ST50", title: "ThinkSystem ST50", keyword: "st50" },
      { label: "ThinkSystem ST250", title: "ThinkSystem ST250", keyword: "st250" },
      { label: "ThinkSystem SR630", title: "ThinkSystem SR630", keyword: "sr630" },
    ],
  },
  {
    title: "Аксесуари",
    image: "/src/assets/images/categories/accessories.png",
    items: [
      { label: "Всі Аксесуари ›", title: "Аксесуари", keyword: "аксесуар" },
      { label: "Додаткові сервіси ›", title: "Додаткові сервіси", keyword: "сервіс" },
      { label: "Миші та Килимки", title: "Миші та килимки", keyword: "миша" },
      { label: "Сумки, рюкзаки і чохли", title: "Сумки та чохли", keyword: "сумка" },
      { label: "Док-станції для ноутбуків", title: "Док-станції", keyword: "док" },
      { label: "Блоки живлення ›", title: "Блоки живлення", keyword: "блок живлення" },
      { label: "Акумулятори для ноутбуків", title: "Акумулятори", keyword: "акумулятор" },
      { label: "Навушники", title: "Навушники", keyword: "навушники" },
      { label: "Клавіатури", title: "Клавіатури", keyword: "клавіатура" },
      { label: "Чохли для планшетів", title: "Чохли для планшетів", keyword: "чохол" },
    ],
  },
];

const CategoryGrid = ({ openSearchCategory }: CategoryGridProps) => {
  return (
    <section className="category-section">
      <div className="category-grid">
        {categories.map((category) => (
          <div className="category-card" key={category.title}>
            <img src={category.image} alt={category.title} />

            <div className="category-title">{category.title}</div>

            <div className="category-hover">
              {category.items.map((item) => (
                <button
                  className="category-hover-item"
                  key={item.label}
                  onClick={() =>
                    openSearchCategory?.(item.title, item.keyword)
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;