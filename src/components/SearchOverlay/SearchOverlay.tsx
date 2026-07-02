import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { catalogUrl } from "../../config";
import "./SearchOverlay.css";

interface Props {
  close: () => void;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

const SearchOverlay = ({ close }: Props) => {
  const [text, setText] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  const search = async () => {
    if (!text.trim()) {
      setProducts([]);
      return;
    }

    try {
      const response = await fetch(
  catalogUrl("/client/products")
);

      if (!response.ok) {
        throw new Error("Помилка пошуку");
      }

      const data = await response.json();

      const query = text.trim().toLowerCase();

      const result = data.filter((item: any) => {
        const name = String(item.name || item.title || "").toLowerCase();
        const description = String(item.description || "").toLowerCase();

        return (
          name.includes(query) ||
          description.includes(query)
        );
      });

      setProducts(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="search-overlay">
      <button
        className="search-close"
        onClick={close}
      >
        <CloseIcon />
      </button>

      <div className="search-box">
        <input
          placeholder="що моделі, carbon x1 ігровий"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              search();
            }
          }}
        />

        <button onClick={search}>
          <SearchIcon />
        </button>
      </div>

      <div className="popular-search">
        <span>Популярно</span>
      </div>

      <div className="search-results">
        {products.map((product) => (
          <div 
            className="search-result-item"
            key={product.id}
          >
            <img src={product.image_url} />

            <div>
              <h4>{product.name}</h4>

              <p>{product.price} ₴</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchOverlay;