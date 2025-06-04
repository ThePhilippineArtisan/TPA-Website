import React, {useState} from 'react';

import KahonKalyo from "/KahonKalyo.png";
import TPACircleLogo from "/TPACircleLogo.png";

import "../CSS/FirstFacade.css"

const slides = [
    { 
        
        id: 1,
            header: "The Philippine Artisan",
            src: TPACircleLogo,
            text1: "The 81-year old official student publication of Technological University of the Philippines Manila.",
            text2: "Serving the academe and the country since 1944.",
        },{
        id: 2, 
            header: "KALYO: KAHON — '24 - 25",
            src: KahonKalyo, 
            text1: "Ang kahon ay laberinto ng mga lihim at inaagiw na alaala.",
            text2: "Sa mga sulok ng kuwadrado, matatagpuan ang katotohanan na pilit itinatago.",
            text3: "Ngunit kung tatalikuran, bawat hakbang, bawat yapak ay katumbas ng kartuturan ng mundo ang papasanin",
            text4: "Mapalinlang ang taklob, sapagkat pagbukas nito'y maaring magbalik ng bigat o magpalaya ng diwa."
        }


]



const FirstFacade = () => {
    
    const navigableSlides = slides.slice(1); // skips slide[id = 1]

    const [activeIndex, setActiveIndex] = useState(0); // Start with Slide ID 2 for Facade
    const [previewIndex, setPreviewIndex] = useState(0);
    const transitionDuration = 300; //in milliseconds
    const [isTransitioning, setIsTransitioning] = useState(false);



    const nextSlide = () => {
        if(isTransitioning)
            return;
        setIsTransitioning(true);
        setTimeout(() => {
            const newIndex = (activeIndex + 1) % navigableSlides.length;
            setPreviewIndex(activeIndex); // change activeindex to preview
            setActiveIndex(newIndex) // set active index to next index
            setIsTransitioning(false);

                // setHistory((prev) => [slides[activeIndex], ...prev].slice(0,0));
                // setActiveIndex(newIndex === 0 ? 1 : newIndex);

        }, transitionDuration);
            // Documentation: 
    }

    const prevSlide = () => {
        if(isTransitioning)
            return;
        setIsTransitioning(true);
        setTimeout(() => {
            const newIndex = (activeIndex - 1 + navigableSlides.length) % navigableSlides.length;
            setPreviewIndex(activeIndex);
            setActiveIndex(newIndex)
            setIsTransitioning(false);
        }, transitionDuration)
    }

    const mainSlide = navigableSlides[activeIndex];
    const previewSlide = slides[0]; // Always show TPA Slides

    return(
        <div className = "Literary-Showcase-First-Facade">
            <div className = "Dark-BG-First-Facade">

                <div className = "DBFF-Left-Side">

                    <div className = "DBFF-Headline">
                        <h1>{mainSlide.header}</h1>
                    </div>

                    <div className = "DBFF-Top-Paragraph">
                        <h4>
                            <span>{mainSlide.text1}</span>
                            <br /> <br />
                            <span>{mainSlide.text2}</span>
                        </h4>
                    </div>

                        {/* BEGINNING OF SMALL PREV IMAGE SHOWCASE*/}
                    <div className={`Small-Prev-Image-Showcase ${isTransitioning ? 'transitioning' : ''}`}>
                        <img src={previewSlide.src} className="history-slide" />
                        <h4>
                            <span>{previewSlide.text1}</span>
                            <br /><br />
                            <span>{previewSlide.text2}</span>
                        </h4>
                        {/* END OF SMALL PREV IMAGE SHOWCASE*/}

                    </div>



                    <div className = "DBFF-Bottom-Paragraph">
                    <h4>
                        <span>{mainSlide.text3}</span>
                        <br /> <br />
                        <span>{mainSlide.text4}</span>
                    </h4>
                    </div>
                </div>



                <div className = "DBFF-Right-Side">
                    <div className={`First-Facade-Image-Showcase ${isTransitioning ? 'transitioning' : ''}`}>
                        <img id="Kahong-Kalyo" src={mainSlide.src} />
                    </div>

                    <div className = "Navigate-Carousel">    
                        <button
                            onClick = {nextSlide}> ◀ </button>
                        <button
                            onClick = {prevSlide}> ▶ </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default FirstFacade;