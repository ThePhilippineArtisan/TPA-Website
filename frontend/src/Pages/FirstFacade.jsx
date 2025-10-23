import React, {useState, useTransition} from 'react';

import KahonKalyo from "/KahonKalyo.png";
import LampoonCover from "../TPA-Releases/2025-Lampoon/2025-Lampoon_Duh-Filipit-Artihan/2025-Lampoon_Duh-Filipit-Artihan-1.png"

import TPACircleLogo from "/favicon.ico"

import PreviousSlide from "../assets/Miniature_Icon_Version/Previous.svg"
import NextSlide from "../assets/Miniature_Icon_Version/Next.svg"

import SecondBGFirstFacade from '../Components/SecondBGFirstFacade.jsx';

import "../CSS/FirstFacade.css"

const FirstFacade = () => {

    const slides = [
        {
        id: 1, 
            header: "KALYO: KAHON — '24 - '25",
            src: KahonKalyo, 
            text1: "Ang kahon ay laberinto ng mga lihim at inaagiw na alaala.",
            text3: "Sa mga sulok ng kuwadrado, matatagpuan ang katotohanan na pilit itinatago.",
            text5: "Ngunit kung tatalikuran, bawat hakbang, bawat yapak ay katumbas ng kartuturan ng mundo ang papasanin",
            text7: "Mapalinlang ang taklob, sapagkat pagbukas nito'y maaring magbalik ng bigat o magpalaya ng diwa."
        },

        {
        id: 2, 
            header: "DUH! FILIPIT ARTIHAN — '24 - '25",
            src: LampoonCover, 
            text1: "❗❗NEW LAMPOON DROP❗❗",
            text2: "if Mommy Oni has 1 million fans, i am one of them",
            text3: "if Mommy Oni has 1 fans, I am the only one",
            text4: "if Mommy Oni has zero fans, I am no longer alive.",
            text5: "till my last breath i'll support MAMA ONI",
            text6: "ito na lampoon saksak nyo sa baga nyo.",
            text7: "kunin sa artisan office or wag it's up 2 u bessy  q",
        }

    ]

    const navigableSlides = slides.slice(0);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isPending, startTransition] = useTransition();

    const [direction, setDirection] = useState("next");

    const handleSlideChange = (dir) => {
    setDirection(dir);
    const slide = document.querySelector(".SlideWrapper");

    slide.classList.add("pending", dir);

    setTimeout(() => {
        slide.classList.remove("pending", dir);

        setActiveIndex((i) =>
        dir === "next"
            ? (i + 1) % slides.length
            : (i - 1 + slides.length) % slides.length
        );

        const newSlide = document.querySelector(".SlideWrapper");
        newSlide.classList.add("enter", dir);

        setTimeout(() => {
        newSlide.classList.remove("enter", dir);
        }, 600); 
    }, 600); 
    };

    const handleNext = () => handleSlideChange("next");
    const handlePrev = () => handleSlideChange("prev");
    const mainSlide = slides[activeIndex];

    return(
        <div className = "Literary-Showcase-First-Facade">
                <div className = "First-BG-First-Facade">
                    <div className = { `Cards SlideWrapper ${direction} ${isPending ? "pending" : ""}`}>
                        <div className="Slide-Navigation">
                            <img 
                                src = {PreviousSlide}
                                alt = "Previous"
                                onClick = {handlePrev}
                            />
                        </div>
 
                        <div className = "DBFF-Headline">
                            
                            <h1> {mainSlide.header} </h1>
                            
                            <div className = "DBFF-Top-Paragraph">
                                 
                                <h2> {mainSlide.text1 && <span>{mainSlide.text1}<br /><br /> </span>} </h2> 
                                <h2> {mainSlide.text2 && <span>{mainSlide.text2}<br /><br /> </span>} </h2>
                                <h2> {mainSlide.text3 && <span>{mainSlide.text3}<br /><br /> </span>} </h2>
                                <h2> {mainSlide.text4 && <span>{mainSlide.text4}<br /><br /> </span>} </h2>
                                
                                <h2> {mainSlide.text5 && <span>{mainSlide.text5}<br /><br /> </span>} </h2>
                                <h2> {mainSlide.text6 && <span>{mainSlide.text6}<br /><br /> </span>} </h2>
                                <h2> {mainSlide.text7 && <span>{mainSlide.text7}<br /><br /> </span>} </h2>
                                <h2> {mainSlide.text8 && <span>{mainSlide.text8}<br /><br /> </span>} </h2>

                            </div>
                        </div>

                        <div className = "Card-Images">
                            <img src = {mainSlide.src} />
                        </div>

                    <div className = "Slide-Navigation">

                        <img 
                            src = {NextSlide}
                            alt = "Next"
                            onClick = {handleNext}
                        />
                        
                    </div>

                    </div>
                </div>
        </div>
    )
}

export default FirstFacade;
