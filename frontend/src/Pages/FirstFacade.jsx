import React, {useState, useEffect} from 'react';

import KahonKalyo from "/KahonKalyo.png";
import Kalyo from "../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-100.png"
import LampoonCover from "../TPA-Releases/2025-Lampoon/2025-Lampoon_Duh-Filipit-Artihan/2025-Lampoon_Duh-Filipit-Artihan-1.png"
import NewsLetterCover from "/Newsletter.png"
import TabulaRasaCover from "/Tabula_Rasa.png";
import ArtisanLogo from "/TPA-LEFT_BLUE.png"

import PreviousSlide from "../assets/Miniature_Icon_Version/Previous.svg"
import NextSlide from "../assets/Miniature_Icon_Version/Next.svg"

import SecondBGFirstFacade from '../Components/SecondBGFirstFacade.jsx';

import "../CSS/FirstFacade.css"

const FirstFacade = () => {
    const slides = [
        {
        id: 1, 
            header: "KAHON — '24 - '25",
            src: KahonKalyo, 
            backgroundSRC: KahonKalyo,
            text1: "Ang kahon ay laberinto ng mga lihim at inaagiw na alaala.",
            text2: "Sa mga sulok ng kuwadrado, matatagpuan ang katotohanan na pilit itinatago.",
            text3: "Ngunit kung tatalikuran, bawat hakbang, bawat yapak ay katumbas ng kartuturan ng mundo ang papasanin",
            text4: "Mapalinlang ang taklob, sapagkat pagbukas nito'y maaring magbalik ng bigat o magpalaya ng diwa."
        },

        {
        id: 2,
            header: "Kalyo ? — '24 - '25",
            src: Kalyo, 
            backgroundSRC: Kalyo,
            text1: "Ang kahon ay laberinto ng mga lihim at inaagiw na alaala.",
            text2: "Sa mga sulok ng kuwadrado, matatagpuan ang katotohanan na pilit itinatago.",
            text3: "Ngunit kung tatalikuran, bawat hakbang, bawat yapak ay katumbas ng kartuturan ng mundo ang papasanin",
            text4: "Mapalinlang ang taklob, sapagkat pagbukas nito'y maaring magbalik ng bigat o magpalaya ng diwa."
        },

        {
        id: 3, 
            header: "DUH! FILIPIT ARTIHAN — '24 - '25",
            src: LampoonCover, 
            backgroundSRC: LampoonCover,
            text1: "The new lampoon  is now available, daring to tickle your funny bone and challenge your wit.",
            text2: "❗❗NEW LAMPOON DROP❗❗",
            text3: "if Mommy Oni has 1 million fans, i am one of them",
            text4: "if Mommy Oni has 1 fans, I am the only one",
            text5: "if Mommy Oni has zero fans, I am no longer alive.",
            text6: "till my last breath i'll support MAMA ONI",
            text7: "ito na lampoon saksak nyo sa baga nyo.",
            text8: "kunin sa artisan office or wag it's up 2 u bessy  q",
        },

        {
        id: 4,
            header: "NEWSLETTER BATCH 1: '24 - '25",
            src: NewsLetterCover,
            backgroundSRC: NewsLetterCover,
            text1: "The Newsletter for the academic year 2024–2025 has launched its issue, focusing on the university's previous academic year.",
            text2: "This issue features a collection of news articles, significant campus events, and insightful stories relevant within and across the country.",
            text4: "In this time when misinformation and disinformation are spreading fast, being informed is your form of resistance.",
            text6: "Don’t miss out and get your own copies now!"
        },

        {
        id: 5,
                header: "TABULA RASA: SINGAW — '23 - '24",
                src: TabulaRasaCover,
                backgroundSRC: TabulaRasaCover,
                text1: "Sa tindi ng masangsang na amoy, ang pagpikit at ang taingang-kawali'y 'di sapat.",
                text3: "Sa mga panahong puno ng kulimlim at pagbabago, kailangang sa buhay na patuloy ang pag-agos tayo kukuha ng kutya sa mga bosabos.",
                text5: "Kumuha na ng inyong libreng kopya ng mga koleksyon ng opisyal na grapikong portfolio ng The Philippine Artisan."
        }
    ]

    const navigableSlides = slides.slice(0);

    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(null); // "next" | "prev"
    const [phase, setPhase] = useState("idle"); // "idle" | "exit" | "enter"

    const handleNext = () => {
        if (phase !== "idle") return;
        setDirection("next");
        setPhase("exit");
    };

    const handlePrev = () => {
        if (phase !== "idle") return;
        setDirection("prev");
        setPhase("exit");
    };

    useEffect(() => {
    if (phase !== "idle") return;

    const timer = setTimeout(() => {
        setDirection("next");
        setPhase("exit");
    }, 15000);

    return () => clearTimeout(timer);
    }, [phase, activeIndex]);


    const mainSlide = slides[activeIndex];

    return(
        <div className = "Literary-Showcase-First-Facade">
            <div className = "Artisan-Logo-First-Facade">
                <img 
                    src = {ArtisanLogo}
                />
            </div>
            <div className="First-BG-First-Facade">
                
                {/* Background image with blur 
                <div
                    style={{
                    backgroundColor: "rgba(192, 192, 192, 1)",
                    backgroundImage: `url(${mainSlide.backgroundSRC})`,
                    backgroundSize: "30rem",
                    backgroundPosition: "center",
                    transform: "rotate(3deg)",
                    filter: "blur(10px)",
                    position: "absolute",
                    inset: 0,
                    zIndex: -2
                    }}
                />
                */}
                {/* Dark overlay                 
                
                <div
                    style={{
                    backgroundImage: `url(${starsBackground})`,
                    backgroundPosition: "center",
                    position: "absolute",
                    inset: 0,
                    zIndex: -1
                    }}
                />
                
                */}

                <div
                    key={activeIndex}
                    className={`Cards SlideWrapper ${
                        phase === "exit" ? `exit ${direction}` : ""
                    } ${
                        phase === "enter" ? direction : ""
                    }`}
                    onAnimationEnd={() => {
                        if (phase === "exit") {
                        setActiveIndex((i) =>
                            direction === "next"
                            ? (i + 1) % slides.length
                            : (i - 1 + slides.length) % slides.length
                        );
                        setPhase("enter");
                        } else if (phase === "enter") {
                        setPhase("idle");
                        setDirection(null);
                        }
                    }}
                    >
                    <div className="Slide-Navigation">
                        <img 
                            src = {PreviousSlide}
                            alt = "Previous"
                            onClick = {handlePrev}
                        />
                    </div>
                        
                    <div className = "DBFF-Headline">
                        <p> {mainSlide.header} </p>
                        <div className = "DBFF-Text">
                            <p> <i> {mainSlide.text1 && <span>{mainSlide.text1} </span>}</i> </p>
                            <p> {mainSlide.text2 && <span>{mainSlide.text2} </span>} </p>
                            <p> {mainSlide.text3 && <span>{mainSlide.text3} </span>} </p>
                            <p> {mainSlide.text4 && <span>{mainSlide.text4} </span>} </p>
                            <p> {mainSlide.text5 && <span>{mainSlide.text5} </span>} </p>
                            <p> {mainSlide.text6 && <span>{mainSlide.text6} </span>} </p>
                            <p> {mainSlide.text7 && <span>{mainSlide.text7} </span>} </p>
                            <p> {mainSlide.text8 && <span>{mainSlide.text8} </span>} </p>
                        </div>
                    </div>

                    <div className = "Card-Images">
                        <img
                            loading = "lazy" 
                            src = {mainSlide.src} 
                        /> 
                    </div>

                    <div className="Slide-Navigation">
                        <img 
                            src = {NextSlide}
                            alt = "Previous"
                            onClick = {handleNext}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FirstFacade;
