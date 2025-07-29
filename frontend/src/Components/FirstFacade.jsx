import React, {useState} from 'react';

import KahonKalyo from "/KahonKalyo.png";
import LampoonCover from "../TPA-Releases/2025-Lampoon/2025-Lampoon_Duh-Filipit-Artihan/2025-Lampoon_Duh-Filipit-Artihan-1.png"
// import TPACircleLogo from "/TPACircleLogo.png";

import "../CSS/FirstFacade.css"

const FirstFacade = () => {
    return(
        <div className = "Literary-Showcase-First-Facade">
                <div className = "First-BG-First-Facade">
                    <div className = "Cards">
                        <div className = "DBFF-Headline">
                            <h1> KALYO: KAHON — '24 - 25 </h1>
                            <div className = "DBFF-Top-Paragraph">
                                <h2> 
                                    <span> Ang kahon ay laberinto ng mga lihim at inaagiw na alaala. <br /> <br /> </span>
                                    <span> Sa mga sulok ng kuwadrado, <br /> <br /> </span>
                                    <span> Matatagpuan ang katotohanan na pilit itinatago. <br /> <br /> </span>

                                    <br /> <br /> <br /> <br /> <br />

                                    <span> Ngunit kung tatalikuran, bawat hakbang, <br /> <br /> </span>
                                    <span> Bawat yapak ay katumbas ng kartuturan ng mundo ang papasanin <br /> <br /> </span>
                                    <span> Mapalinlang ang taklob, <br /> <br /> </span>
                                    <span> Sapagkat pagbukas nito'y maaring magbalik ng bigat o magpalaya ng diwa. <br /> <br /> </span>
                                </h2> 
                            </div>
                        </div>

                        <div className = "Card-Images">
                            <img src = {KahonKalyo} />
                        </div>

                    </div>
                </div>
                
                <div className = "Second-BG-First-Facade">
                    
                    <div className = "Cards">
                        <div className = "Iframe-Wrapper" id = "iframes">
                            <iframe 
                                src = "https://www.youtube-nocookie.com/embed/IT6crhxDzhI?si=Ql4Y4ntnRlFjWh2m" 
                                title = "Gawad Tek R Tisan 2024-2025" frameborder = "0" 
                                allow = 
                                    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    referrerpolicy = "strict-origin-when-cross-origin" 
                                allowfullscreen>
                            </iframe>
                        </div>
                        
                        <div className = "DBFF-Headline">

                            <h1> GAWAD TEK R. TISAN — '24 - 25 </h1>

                            <div className = "DBFF-Top-Paragraph">
                                <h2> 
                                    <span> Are you carrying a box filled with unexpressed emotions, <br /> <br /> </span>
                                    <span> or are you the one hidden inside it with unspoken thoughts? <br /> <br /> </span>
                                    <span> Every story matters, as well as every inspiration. <br /> <br /> </span>

                                    <br /> <br /> <br /> <br /> <br />

                                    <span> The Philippine Artisan invites you to join Gawad Tek 2025, <br /> <br /> </span>
                                    <span> as you turn your journey into colors and words. <br /> <br /> </span>
                                    <br /> <br />
                                    <span> Check out TUPian's artistry shared with us.  <br /> <br /> </span>
                                    <br /> <br />
                                    Click here for their <span> <a href = "#"> works. </a> </span><br /> <br /> 
                                </h2> 
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default FirstFacade;

{/*

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

                        // BEGINNING OF SMALL PREV IMAGE SHOWCASE

                    <div className={`Small-Prev-Image-Showcase ${isTransitioning ? 'transitioning' : ''}`}>
                        <img src={previewSlide.src} className="history-slide" />
                        <h4>
                            <span>{previewSlide.text1}</span>
                            <br /><br />
                            <span>{previewSlide.text2}</span>
                        </h4>

                        // END OF SMALL PREV IMAGE SHOWCASE

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
                            onClick = {nextSlide}>  </button>
                        <button
                            onClick = {prevSlide}>  </button>
                    </div>
                </div>

            </div>
        </div>
    )
    
} 

export default FirstFacade;

*/}