import "./CategoryGrid.css";

const categories = [
  {
    title: "Ноутбуки",
    image: "/src/assets/images/categories/laptops.png",
    items: ["Всі Ноутбуки ›", "ThinkPad", "ThinkBook", "Legion", "LOQ ›", "Yoga", "ideaPad"],
  },
  {
    title: "Планшети",
    image: "/src/assets/images/categories/tablets.png",
    items: ["Всі Планшети ›", "Ігрові", "Для розваг ›", "Для навчання", "Високопродуктивні"],
  },
  {
    title: "Смартфони MOTOROLA",
    image: "/src/assets/images/categories/motorola.png",
    items: ["Всі Смартфони ›", "Moto Razr", "Moto ThinkPhone", "Moto Edge ›", "Moto E", "Moto G"],
  },
  {
    title: "Комп’ютери",
    image: "/src/assets/images/categories/computers.png",
    items: ["Всі Комп’ютери ›", "ThinkCentre", "ThinkEdge", "ThinkStation", "Legion", "LOQ ›"],
  },
  {
    title: "Моноблоки",
    image: "/src/assets/images/categories/monoblocks.png",
    items: ["Всі Моноблоки ›", "ThinkCentre", "YOGA", "ideaCentre", "Lenovo A/V"],
  },
  {
    title: "Монітори",
    image: "/src/assets/images/categories/monitors.png",
    items: ["Всі Монітори ›", "Think", "Legion", "Lenovo ›"],
  },
  {
    title: "Ігрові консолі",
    image: "/src/assets/images/categories/consoles.png",
    items: ["Всі Ігрові консолі ›", "Legion Go", "Аксесуари"],
  },
  {
    title: "Інтерактивні Панелі",
    image: "/src/assets/images/categories/panels.png",
    items: ["Всі Панелі ›", "ThinkVision T86", "ThinkVision T75", "ThinkVision T65"],
  },
  {
    title: "Сервери",
    image: "/src/assets/images/categories/servers.png",
    items: ["Всі Сервери ›", "ThinkSystem ST50", "ThinkSystem ST250", "ThinkSystem SR630"],
  },
  {
    title: "Аксесуари",
    image: "/src/assets/images/categories/accessories.png",
    items: [
      "Всі Аксесуари ›",
      "Додаткові сервіси ›",
      "Миші та Килимки",
      "Сумки, рюкзаки і чохли",
      "Док-станції для ноутбуків",
      "Блоки живлення ›",
      "Акумулятори для ноутбуків",
      "Навушники",
      "Клавіатури",
      "Чохли для планшетів",
    ],
  },
];

const CategoryGrid = () => {
  return (
    <section className="category-section">
      <div className="category-grid">
        {categories.map((category) => (
          <div className="category-card" key={category.title}>
            <img src={category.image} alt={category.title} />

            <div className="category-title">{category.title}</div>

            <div className="category-hover">
              {category.items.map((item) => (
                <div className="category-hover-item" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;