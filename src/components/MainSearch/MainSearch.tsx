import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import "./MainSearch.css";

interface MainSearchProps {
  onSearch?: (value: string) => void;
}

const MainSearch = ({ onSearch }: MainSearchProps) => {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    const value = search.trim();

    if (!value) {
      alert("Введіть слово для пошуку");
      return;
    }

    onSearch?.(value);
  };

  return (
    <div className="main-search">
      <input
        placeholder="Пошук на сайті"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />

      <button onClick={handleSearch}>
        <SearchIcon />
      </button>
    </div>
  );
};

export default MainSearch;