import React, {useState, useEffect} from 'react';
import { supabase } from "../supabaseClient"

import PreviousSlide from "../assets/Miniature_Icon_Version/Previous.svg"
import NextSlide from "../assets/Miniature_Icon_Version/Next.svg"

import RollingHeadlines from "../Components/RollingHeadlines.jsx";
import "../CSS/FirstFacade.css"

let cachedSlides = null

const preloadImages = (slidesArray) => {
    slidesArray.forEach((slide) => { // for each slide, do this arrow function
        if(slide.image_url){
            const img = new Image()
            img.src = slide.image_url
        }
        if(slide.backgroundSRC){
            const img = new Image()
            img.src = slide.backgroundSRC
        }
    }) 
}

const FirstFacade = () => {

    const [slides, setSlides] = useState(cachedSlides || [])
    const artisanLogo = slides.find(logo => logo.order === 999);


    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(null); // "next" | "prev"
    const [phase, setPhase] = useState("idle"); // "idle" | "exit" | "enter"
    
    useEffect(() => {
        const fetchSlides = async () => {
            let { data, error } = await supabase
            .from('homepage_slides')
            .select('*')
            .eq('is_visible', true)
            .order('order', { ascending: true })

            if (error) {
                console.log('Error fetching slides: ', error)
            } else{
                setSlides(data)
            }
        }
        fetchSlides()
    }, [])

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
    if (phase !== "idle" || slides.length === 0) return;

    const timer = setTimeout(() => {
        setDirection("next");
        setPhase("exit");
    }, 15000);

    return () => clearTimeout(timer);
    }, [phase, activeIndex, slides.length]);

    if(slides.length === 0){
        return(<div className="Literary-Showcase-First-Facade">
                <div className="Artisan-Logo-First-Facade">
                    <p> Loading... </p>
                </div>
                <RollingHeadlines />
            </div>
        )
    }

    const mainSlide = slides[activeIndex]

    return(
        <div className = "Literary-Showcase-First-Facade">
            <div className = "Artisan-Logo-First-Facade">
                <img 
                    key = {artisanLogo.order}
                    src = {artisanLogo.image_url}
                    id = "ArtisanLogo"
                />
            </div>
                <RollingHeadlines />
            <div className = "First-BG-First-Facade">
                <div 
                style = {{
                    backgroundImage: `url(${mainSlide.backgroundSRC})`,
                    filter: "blur(5px)",
                    position: "absolute",
                    inset: 0,
                    zIndex: -2,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                ></div>
                
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
                    <div className="Slide-Navigation">
                        <img 
                            src = {PreviousSlide}
                            alt = "Previous"
                            onClick = {handlePrev}
                        />
                    </div>

                <div className={`Cards SlideWrapper ${
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

                    <div className = "DBFF-Headline">
                        <p> {mainSlide.header} </p>
                        <div className = "DBFF-Text">
                            <p style = {{fontSize: "1.5rem"}}> <i> {mainSlide.text1 && <span>{mainSlide.text1} </span>}</i> </p> <br></br>
                            <p> {mainSlide.text2 && <span>{mainSlide.text2} </span>} </p>
                            <p> {mainSlide.text3 && <span>{mainSlide.text3} </span>} </p>
                            <p> {mainSlide.text4 && <span>{mainSlide.text4} </span>} </p>
                            <p> {mainSlide.text5 && <span>{mainSlide.text5} </span>} </p>
                            <p> {mainSlide.text6 && <span>{mainSlide.text6} </span>} </p>
                            <p> {mainSlide.text7 && <span>{mainSlide.text7} </span>} </p>
                            <p> {mainSlide.text8 && <span>{mainSlide.text8} </span>} </p>
                        </div>
                    </div>

                    <div className = "Card-Images" style={{ "--cover-img": `url(${mainSlide.image_url})` }}>
                        <img
                            key = {mainSlide.id}
                            loading = "lazy" 
                            src = {mainSlide.image_url}
                            alt = {mainSlide.header}
                        /> 
                    </div>

                </div>
                    <div className="Slide-Navigation">
                        <img 
                            src = {NextSlide}
                            alt = "Next"
                            onClick = {handleNext}
                        />
                    </div>

            </div>
        </div>
    )
}

export default FirstFacade;
