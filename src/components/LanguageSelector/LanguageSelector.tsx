import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "./LanguageSelector.css";

const languages = ["Укр", "Eng", "Рус"];

const LanguageSelector = () => {

    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState("Укр");

    const changeLanguage = (lang: string) => {
        setCurrent(lang);
        setOpen(false);
    };

    return (
        <div className="language">

            <button 
                
                className={`language-button ${open ? "open" : ""}`}
                onClick={() => setOpen(!open)}
            >
                {current}
                <KeyboardArrowDownIcon />
            </button>


            {open && (
                <div className="language-menu">

                    {languages.map(lang => (
                        <div 
                            key={lang}
                            className="language-item"
                            onClick={() => changeLanguage(lang)}
                        >
                            {lang}
                        </div>
                    ))}

                </div>
            )}

        </div>
    );
};

export default LanguageSelector;