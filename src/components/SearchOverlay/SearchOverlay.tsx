import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import "./SearchOverlay.css";

interface Props {
  close: () => void;
}

const SearchOverlay = ({ close }: Props) => {

  const [text, setText] = useState("");

  const search = () => {

    console.log("Шукаємо:", text);

    // ТУТ БУДЕ ЗАПИТ НА BACKEND fetch
   

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
          onChange={(e)=>setText(e.target.value)}
        />

        <button onClick={search}>
          <SearchIcon />
        </button>

      </div>


      <div className="popular-search">

        <span>Популярно</span>

       

      </div>


    </div>
  );
};

export default SearchOverlay;