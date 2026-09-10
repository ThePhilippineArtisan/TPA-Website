import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from "../supabaseClient"

import PreviousSlide from "../assets/Miniature_Icon_Version/Previous.svg"
import NextSlide from "../assets/Miniature_Icon_Version/Next.svg"

import RollingHeadlines from "../Components/RollingHeadlines.jsx";
import "../CSS/FirstFacade.css"

let cachedSlides = null

const preloadImages = (slidesArray) => {
    slidesArray.forEach((slide) => {
        if (slide.image_url) {
            const img = new Image()
            img.src = slide.image_url
        }
        if (slide.backgroundSRC) {
            const img = new Image()
            img.src = slide.backgroundSRC
        }
    }) 
}

const FirstFacade = () => {

    const [slides, setSlides] = useState(cachedSlides || [])
    const artisanLogo = slides.find(logo => logo.order === 999);
    const carouselSlides = slides.filter(slide => slide.order !== 999);

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
            } else {
                const fetched = data || []
                setSlides(fetched)
                cachedSlides = fetched
                preloadImages(fetched)
            }
        }
        fetchSlides()
    }, [])

    const handleNext = () => {
        if (phase !== "idle" || carouselSlides.length <= 1) return;
        setDirection("next");
        setPhase("exit");
    };

    const handlePrev = () => {
        if (phase !== "idle" || carouselSlides.length <= 1) return;
        setDirection("prev");
        setPhase("exit");
    };

    // Auto-advance slides every 15s
    useEffect(() => {
        if (phase !== "idle" || carouselSlides.length <= 1) return;

        const timer = setTimeout(() => {
            setDirection("next");
            setPhase("exit");
        }, 15000);

        return () => clearTimeout(timer);
    }, [phase, activeIndex, carouselSlides.length]);

    // Safety fallback: guarantee transition returns to "idle" even if animation events are dropped
    useEffect(() => {
        if (phase === "idle" || carouselSlides.length === 0) return;

        const safety = setTimeout(() => {
            if (phase === "exit") {
                setActiveIndex((i) =>
                    direction === "next"
                        ? (i + 1) % carouselSlides.length
                        : (i - 1 + carouselSlides.length) % carouselSlides.length
                );
                setPhase("enter");
            } else if (phase === "enter") {
                setPhase("idle");
                setDirection(null);
            }
        }, 300);

        return () => clearTimeout(safety);
    }, [phase, direction, carouselSlides.length]);

    const handleAnimationEnd = (e) => {
        // Only respond to animations ending on the SlideWrapper itself
        if (e.target !== e.currentTarget) return;

        if (phase === "exit") {
            setActiveIndex((i) =>
                direction === "next"
                    ? (i + 1) % carouselSlides.length
                    : (i - 1 + carouselSlides.length) % carouselSlides.length
            );
            setPhase("enter");
        } else if (phase === "enter") {
            setPhase("idle");
            setDirection(null);
        }
    };

    if (slides.length === 0) {
        return (
            <div className="Literary-Showcase-First-Facade">
                <div className="Artisan-Logo-First-Facade">
                    <p> Loading... </p>
                </div>
                <RollingHeadlines />
            </div>
        );
    }

    const safeIndex = carouselSlides.length > 0 ? activeIndex % carouselSlides.length : 0;
    const mainSlide = carouselSlides[safeIndex] || slides[0];

    const animationClass = phase === "exit"
        ? `exit-${direction}`
        : phase === "enter"
        ? `enter-${direction}`
        : "";

    return (
        <div className="Literary-Showcase-First-Facade">
            <div className="Artisan-Logo-First-Facade">
                <img 
                    key={artisanLogo?.order || "artisan-logo"}
                    src={artisanLogo?.image_url || "/TPA-LEFT_BLUE.png"}
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/TPA-LEFT_BLUE.png";
                    }}
                    id="ArtisanLogo"
                    alt="The Philippine Artisan"
                />
            </div>
            <RollingHeadlines />
            <div className="First-BG-First-Facade">
                <div 
                    style={{
                        backgroundImage: `url(${mainSlide?.backgroundSRC || ''})`,
                        filter: "blur(5px)",
                        position: "absolute",
                        inset: 0,
                        zIndex: -2,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                ></div>

                <button 
                    type="button"
                    className="Slide-Navigation"
                    onClick={handlePrev}
                    aria-label="Previous slide"
                    disabled={carouselSlides.length <= 1}
                >
                    <img 
                        src={PreviousSlide}
                        alt="Previous"
                    />
                </button>

                <div
                    className={`Cards SlideWrapper ${animationClass}`}
                    onAnimationEnd={handleAnimationEnd}
                >
                    <div className="DBFF-Headline">
                        <Link to="/releases" className="DBFF-Headline-Title" title="View in Releases">
                            <p>{mainSlide?.header}</p>
                        </Link>
                        <div className="DBFF-Text">
                            {mainSlide?.text1 && <p style={{ fontSize: "1.5rem" }}><i><span>{mainSlide.text1}</span></i></p>}
                            {mainSlide?.text2 && <p><span>{mainSlide.text2}</span></p>}
                            {mainSlide?.text3 && <p><span>{mainSlide.text3}</span></p>}
                            {mainSlide?.text4 && <p><span>{mainSlide.text4}</span></p>}
                            {mainSlide?.text5 && <p><span>{mainSlide.text5}</span></p>}
                            {mainSlide?.text6 && <p><span>{mainSlide.text6}</span></p>}
                            {mainSlide?.text7 && <p><span>{mainSlide.text7}</span></p>}
                            {mainSlide?.text8 && <p><span>{mainSlide.text8}</span></p>}
                            <Link to="/releases" className="DBFF-Explore-Button">
                                Explore Releases ⟶
                            </Link>
                        </div>
                    </div>

                    <Link
                        to="/releases"
                        className="Card-Images"
                        style={{ "--cover-img": `url(${mainSlide?.image_url || ''})` }}
                        title="View in Releases"
                    >
                        <img
                            key={mainSlide?.id}
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            src={mainSlide?.image_url}
                            alt={mainSlide?.header}
                        /> 
                    </Link>
                </div>

                <button 
                    type="button"
                    className="Slide-Navigation"
                    onClick={handleNext}
                    aria-label="Next slide"
                    disabled={carouselSlides.length <= 1}
                >
                    <img 
                        src={NextSlide}
                        alt="Next"
                    />
                </button>
            </div>
        </div>
    );
}

export default FirstFacade;
