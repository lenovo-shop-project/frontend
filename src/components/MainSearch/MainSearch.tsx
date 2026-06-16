import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import "./MainSearch.css";

const MainSearch = () => {

    const [search, setSearch] = useState("");

    const handleSearch = () => {

        console.log("SEARCH:", search);


        // FASTAPI ПОШУК ТОВАРІВ
        //
        // GET http://localhost:8000/products/search?name=
        // fetch(
        //  `http://localhost:8000/products/search?name=${search}`
        // )
        //
        // backend:
        //
        // @app.get("/products/search")
        // async def search_products(name:str):
        //
    }


    return (

        <div className="main-search">


            <input
                placeholder="Пошук на сайті"
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
            />


            <button onClick={handleSearch}>

                <SearchIcon/>

            </button>


        </div>

    )
}


export default MainSearch;