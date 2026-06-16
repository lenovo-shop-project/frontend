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

   //  ЗАПИТ НА FASTAPI 
//
// GET http://localhost:8000/products/search?query=
// 
// Приклад FastAPI:
//
// @app.get("/products/search")
// async def search_products(query: str):
//     return products
//
// fetch(`http://localhost:8000/products/search?query=${text}`)
//      .then(res => res.json())
//      .then(data => {
//          // setProducts(data)
//      })
   

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