import "./CategoryGrid.css";

interface CategoryGridProps {
  openSearchCategory?: (
    title: string,
    keyword: string,
    categoryId?: number
  ) => void;
}

const categories = [
  {
    title: "Ноутбуки",
    image: "/images/categories/laptops.png",
    items: [
      { label: "Всі Ноутбуки ›", title: "Ноутбуки", keyword: "", categoryId: 1 },
      { label: "ThinkPad", title: "ThinkPad", keyword: "thinkpad", categoryId: 1 },
      { label: "ThinkBook", title: "ThinkBook", keyword: "thinkbook", categoryId: 1 },
      { label: "Legion", title: "Legion", keyword: "legion", categoryId: 1 },
      { label: "LOQ ›", title: "LOQ", keyword: "loq", categoryId: 1 },
      { label: "Yoga", title: "Yoga", keyword: "yoga", categoryId: 1 },
      { label: "IdeaPad", title: "IdeaPad", keyword: "ideapad", categoryId: 1 },
    ],
  },
  {
    title: "Планшети",
    image: "/images/categories/tablets.png",
    items: [
      { label: "Всі Планшети ›", title: "Планшети", keyword: "", categoryId: 2 },
      { label: "Ігрові", title: "Ігрові планшети", keyword: "ігровий", categoryId: 2 },
      { label: "Для розваг ›", title: "Планшети для розваг", keyword: "розваг", categoryId: 2 },
      { label: "Для навчання", title: "Планшети для навчання", keyword: "навчання", categoryId: 2 },
      { label: "Високопродуктивні", title: "Високопродуктивні планшети", keyword: "потужний", categoryId: 2 },
    ],
  },
  {
    title: "Смартфони MOTOROLA",
    image: "/images/categories/motorola.png",
    items: [
      { label: "Всі Смартфони ›", title: "Смартфони Motorola", keyword: "", categoryId: 3 },
      { label: "Moto Razr", title: "Moto Razr", keyword: "razr", categoryId: 3 },
      { label: "Moto ThinkPhone", title: "Moto ThinkPhone", keyword: "thinkphone", categoryId: 3 },
      { label: "Moto Edge ›", title: "Moto Edge", keyword: "edge", categoryId: 3 },
      { label: "Moto E", title: "Moto E", keyword: "moto e", categoryId: 3 },
      { label: "Moto G", title: "Moto G", keyword: "moto g", categoryId: 3 },
    ],
  },
  {
    title: "Комп’ютери",
    image: "/images/categories/computers.png",
    items: [
      { label: "Всі Комп’ютери ›", title: "Комп’ютери", keyword: "", categoryId: 10 },
      { label: "ThinkCentre", title: "ThinkCentre", keyword: "thinkcentre", categoryId: 10 },
      { label: "ThinkEdge", title: "ThinkEdge", keyword: "thinkedge", categoryId: 10 },
      { label: "ThinkStation", title: "ThinkStation", keyword: "thinkstation", categoryId: 10 },
      { label: "Legion", title: "Комп’ютери Legion", keyword: "legion", categoryId: 10 },
      { label: "LOQ ›", title: "Комп’ютери LOQ", keyword: "loq", categoryId: 10 },
    ],
  },
  {
    title: "Моноблоки",
    image: "/images/categories/monoblocks.png",
    items: [
      { label: "Всі Моноблоки ›", title: "Моноблоки", keyword: "", categoryId: 9 },
      { label: "ThinkCentre", title: "Моноблоки ThinkCentre", keyword: "thinkcentre", categoryId: 9 },
      { label: "YOGA", title: "Моноблоки Yoga", keyword: "yoga", categoryId: 9 },
      { label: "IdeaCentre", title: "IdeaCentre", keyword: "ideacentre", categoryId: 9 },
      { label: "Lenovo A/V", title: "Lenovo A/V", keyword: "lenovo", categoryId: 9 },
    ],
  },
  {
    title: "Монітори",
    image: "/images/categories/monitors.png",
    items: [
      { label: "Всі Монітори ›", title: "Монітори", keyword: "", categoryId: 5 },
      { label: "Think", title: "Монітори Think", keyword: "think", categoryId: 5 },
      { label: "Legion", title: "Монітори Legion", keyword: "legion", categoryId: 5 },
      { label: "Lenovo ›", title: "Монітори Lenovo", keyword: "lenovo", categoryId: 5 },
    ],
  },
  {
    title: "Ігрові консолі",
    image: "/images/categories/consoles.png",
    items: [
      { label: "Всі Ігрові консолі ›", title: "Ігрові консолі", keyword: "", categoryId: 4 },
      { label: "Legion Go", title: "Legion Go", keyword: "legion go", categoryId: 4 },
      { label: "Аксесуари", title: "Аксесуари для консолей", keyword: "аксесуар", categoryId: 6 },
    ],
  },
  {
    title: "Інтерактивні Панелі",
    image: "/images/categories/panels.png",
    items: [
      { label: "Всі Панелі ›", title: "Інтерактивні Панелі", keyword: "", categoryId: 8 },
      { label: "ThinkVision T86", title: "ThinkVision T86", keyword: "t86", categoryId: 8 },
      { label: "ThinkVision T75", title: "ThinkVision T75", keyword: "t75", categoryId: 8 },
      { label: "ThinkVision T65", title: "ThinkVision T65", keyword: "t65", categoryId: 8 },
    ],
  },
  {
    title: "Сервери",
    image: "/images/categories/servers.png",
    items: [
      { label: "Всі Сервери ›", title: "Сервери", keyword: "", categoryId: 7 },
      { label: "ThinkSystem ST50", title: "ThinkSystem ST50", keyword: "st50", categoryId: 7 },
      { label: "ThinkSystem ST250", title: "ThinkSystem ST250", keyword: "st250", categoryId: 7 },
      { label: "ThinkSystem SR630", title: "ThinkSystem SR630", keyword: "sr630", categoryId: 7 },
    ],
  },
  {
    title: "Аксесуари",
    image: "/images/categories/accessories.png",
    items: [
      { label: "Всі Аксесуари ›", title: "Аксесуари", keyword: "", categoryId: 6 },
      { label: "Додаткові сервіси ›", title: "Додаткові сервіси", keyword: "сервіс", categoryId: 6 },
      { label: "Миші та Килимки", title: "Миші та килимки", keyword: "миша", categoryId: 6 },
      { label: "Сумки, рюкзаки і чохли", title: "Сумки та чохли", keyword: "сумка", categoryId: 6 },
      { label: "Док-станції для ноутбуків", title: "Док-станції", keyword: "док", categoryId: 6 },
      { label: "Блоки живлення ›", title: "Блоки живлення", keyword: "блок живлення", categoryId: 6 },
      { label: "Акумулятори для ноутбуків", title: "Акумулятори", keyword: "акумулятор", categoryId: 6 },
      { label: "Навушники", title: "Навушники", keyword: "навушники", categoryId: 6 },
      { label: "Клавіатури", title: "Клавіатури", keyword: "клавіатура", categoryId: 6 },
      { label: "Чохли для планшетів", title: "Чохли для планшетів", keyword: "чохол", categoryId: 6 },
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
                    openSearchCategory?.(
                      item.title,
                      item.keyword,
                      item.categoryId
                    )
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