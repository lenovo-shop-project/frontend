import { useEffect, useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "./Banners.css";

import banner11 from "../../assets/images/1.1.png";
import banner12 from "../../assets/images/1.2.png";

import banner21 from "../../assets/images/2.1.png";
import banner22 from "../../assets/images/2.2.png";
import banner23 from "../../assets/images/2.3.png";
import banner24 from "../../assets/images/2.4.png";

const topBanners = [banner11, banner12];
const bottomBanners = [banner21, banner22, banner23, banner24];

const Banners = () => {
    const [topIndex, setTopIndex] = useState(0);
    const [bottomIndex, setBottomIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTopIndex((prev) => (prev + 1) % topBanners.length);
            setBottomIndex((prev) => (prev + 1) % bottomBanners.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const prevTop = () => {
        setTopIndex((prev) => (prev - 1 + topBanners.length) % topBanners.length);
    };

    const nextTop = () => {
        setTopIndex((prev) => (prev + 1) % topBanners.length);
    };

    const prevBottom = () => {
        setBottomIndex((prev) => (prev - 1 + bottomBanners.length) % bottomBanners.length);
    };

    const nextBottom = () => {
        setBottomIndex((prev) => (prev + 1) % bottomBanners.length);
    };

    return (
        <section className="banners-section">
            <h2>Акції</h2>

            <div className="banner-slider">
                <div
                    className="slider-track"
                    style={{ transform: `translateX(-${topIndex * 100}%)` }}
                >
                    {topBanners.map((banner, index) => (
                        <img key={index} src={banner} alt="Акційний банер" />
                    ))}
                </div>

                <button className="banner-arrow left" onClick={prevTop}>
                    <KeyboardArrowLeftIcon />
                </button>

                <button className="banner-arrow right" onClick={nextTop}>
                    <KeyboardArrowRightIcon />
                </button>
            </div>

            <div className="banner-dots">
                {topBanners.map((_, index) => (
                    <button
                        key={index}
                        className={topIndex === index ? "active" : ""}
                        onClick={() => setTopIndex(index)}
                    />
                ))}
            </div>

            <div className="banner-slider bottom-banner">
                <div
                    className="slider-track"
                    style={{ transform: `translateX(-${bottomIndex * 100}%)` }}
                >
                    {bottomBanners.map((banner, index) => (
                        <img key={index} src={banner} alt="Trade-in банер" />
                    ))}
                </div>

                <button className="banner-arrow left" onClick={prevBottom}>
                    <KeyboardArrowLeftIcon />
                </button>

                <button className="banner-arrow right" onClick={nextBottom}>
                    <KeyboardArrowRightIcon />
                </button>
            </div>

            <div className="banner-dots">
                {bottomBanners.map((_, index) => (
                    <button
                        key={index}
                        className={bottomIndex === index ? "active" : ""}
                        onClick={() => setBottomIndex(index)}
                    />
                ))}
            </div>
        </section>
    );
};

export default Banners;