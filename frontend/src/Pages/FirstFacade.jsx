import React, {useState, useTransition} from 'react';

import KahonKalyo from "/KahonKalyo.png";
import LampoonCover from "../TPA-Releases/2025-Lampoon/2025-Lampoon_Duh-Filipit-Artihan/2025-Lampoon_Duh-Filipit-Artihan-1.png"
import NewsLetterCover from "/Newsletter.png"

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
            backgroundSRC: KahonKalyo,
            text1: "Ang kahon ay laberinto ng mga lihim at inaagiw na alaala.",
            text2: "Sa mga sulok ng kuwadrado, matatagpuan ang katotohanan na pilit itinatago.",
            text3: "Ngunit kung tatalikuran, bawat hakbang, bawat yapak ay katumbas ng kartuturan ng mundo ang papasanin",
            text4: "Mapalinlang ang taklob, sapagkat pagbukas nito'y maaring magbalik ng bigat o magpalaya ng diwa."
        },

        {
        id: 2, 
            header: "DUH! FILIPIT ARTIHAN — '24 - '25",
            src: LampoonCover, 
            backgroundSRC: LampoonCover,
            text1: "❗❗NEW LAMPOON DROP❗❗",
            text2: "if Mommy Oni has 1 million fans, i am one of them",
            text3: "if Mommy Oni has 1 fans, I am the only one",
            text4: "if Mommy Oni has zero fans, I am no longer alive.",
            text5: "till my last breath i'll support MAMA ONI",
            text6: "ito na lampoon saksak nyo sa baga nyo.",
            text7: "kunin sa artisan office or wag it's up 2 u bessy  q",
        },

        {
        id: 3,
            header: "NEWSLETTER BATCH 1: '24 - '25",
            src: NewsLetterCover,
            backgroundSRC: NewsLetterCover,
            text1: "The Newsletter for the academic year 2024–2025 has launched its issue, focusing on the university's previous academic year.",
            text2: "This issue features a collection of news articles, significant campus events, and insightful stories relevant within and across the country.",
            text3: "TUPians, don’t get lost in the noise.",
            text4: "In this time when misinformation and disinformation are spreading fast, being informed is your form of resistance.",
            text5: "The Philippine Artisan proudly presents its Newsletter for A.Y. 2024–2025, covering pressing news and compelling features that will voice out truth and expose issues within and beyond our university.",
            text6: "Don’t miss out and get your own copies now!"
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
                ? (i + 1) % slides.length // if dir is next, move on
                : ((i - 1) % slides.length + slides.length) % slides.length // if dir is prev, move back
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
            <div className="First-BG-First-Facade">
            {/* Background image with blur */}
            <div
                style={{
                backgroundImage: `url(${mainSlide.backgroundSRC})`,
                backgroundSize: "35rem",
                backgroundPosition: "center",
                filter: "blur(10px)",
                position: "absolute",
                inset: 0,
                zIndex: -2
                }}
            />

            {/* Dark overlay */}
            <div
                style={{
                backgroundColor: "rgba(0, 0, 0, 0.67)", // adjust opacity
                position: "absolute",
                inset: 0,
                zIndex: -1
                }}
            />

                    <div 
                    className = { `Cards 
                    SlideWrapper ${direction} 
                    ${isPending ? "pending" : ""}`}
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
                                 
                                <p> {mainSlide.text1 && <span>{mainSlide.text1}<br /><br /> </span>} </p> 
                                <p> {mainSlide.text2 && <span>{mainSlide.text2}<br /><br /> </span>} </p>
                                <p> {mainSlide.text3 && <span>{mainSlide.text3}<br /><br /> </span>} </p>
                                <p> {mainSlide.text4 && <span>{mainSlide.text4}<br /><br /> </span>} </p>
                                
                                <p> {mainSlide.text5 && <span>{mainSlide.text5}<br /><br /> </span>} </p>
                                <p> {mainSlide.text6 && <span>{mainSlide.text6}<br /><br /> </span>} </p>
                                <p> {mainSlide.text7 && <span>{mainSlide.text7}<br /><br /> </span>} </p>
                                <p> {mainSlide.text8 && <span>{mainSlide.text8}<br /><br /> </span>} </p>

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
