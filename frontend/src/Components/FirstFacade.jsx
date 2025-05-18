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
            text3: "Serving the academe and the country since 1944.",

        id: 2, 
            header: "KALYO: KAHON — '24 - 25",
            src: KahonKalyo, 
            text1: "Ang kahon ay laberinto ng mga lihim at inaagiw na alaala.",
            text2: "Sa mga sulok ng kuwadrado, matatagpuan ang katotohanan na pilit itinatago.",
            text3: "Ngunit kung tatalikuran, bawat hakbang, bawat yapak ay katumbas ng kartuturan ng mundo ang papasanin",
            text4: "Mapalinlang ang taklob, sapagkat pagbukas nito'y maaring magbalik ng bigat o magpalaya ng diwa."},


]



const FirstFacade = () => {

    const [activeIndex, setActiveIndex] = useState(0);
    const [history, setHistory] = useState([slides[0]]);

    const nextSlide = () => {
        const newIndex = (activeIndex + 1) % slides.length;
        setHistory((prev) => [slides[activeIndex], ...prev].slice(0,0));
        setActiveIndex(newIndex);
    }

    return(
        <div className = "Literary-Showcase-First-Facade">
            <div className = "Dark-BG-First-Facade">

                <div className = "DBFF-Left-Side">

                    <div className = "DBFF-Headline">
                        {history.map((slide, index) => 
                            (
                                <div key = {slide.id} className = "DBFF-Headline">
                                    <h1>
                                        {slide.header}
                                    </h1> 
                                </div>
                            ))}
                    </div>

                    <div className = "DBFF-Top-Paragraph">
                        {history.map((slide, index) =>(
                            <div key = {slide.id} className = "DBFF-Top-Paragraph1">
                                <h4>
                                    <span>
                                        {slide.text1}
                                    </span>
                                    <br></br>
                                    
                                    <br></br>
                                    <span>
                                        {slide.text2}
                                    <br></br>
                                    <br></br>
                                    </span>
                                </h4>
                            </div>
                        ))}
                    </div>

                        {/* BEGINNING OF SMALL PREV IMAGE SHOWCASE*/}

                    <div className = "Small-Prev-Image-Showcase">
                        {history.map((slide, index) => 
                            (
                            <img
                                key = {slide.id}
                                src = {slide.src}
                                className = "history-slide"

                            /> 
                            ))}

                        {/* END OF SMALL PREV IMAGE SHOWCASE*/}

                            <h4>
                                <span>The 81-year old official student publication of Technological University of the Philippines Manila.</span>
                                <br></br>                                <br></br>
                                <span>Serving the academe and the country since 1944.</span>
                            </h4>
                    </div>



                    <div className = "DBFF-Bottom-Paragraph">
                        {history.map((slide, index) =>(
                            <div key = {slide.id} className = "DBFF-Top-Paragraph1">
                                <h4>
                                    <span>
                                        {slide.text3}
                                    </span>
                                    <br></br>
                                    
                                    <br></br>
                                    <span>
                                        {slide.text4}
                                    <br></br>
                                    <br></br>
                                    </span>
                                </h4>
                            </div>
                        ))}
                    </div>
                </div>

                <div className = "DBFF-Right-Side">
                    <div className = "First-Facade-Image-Showcase">
                            <img id = "Kahong-Kalyo"
                                src = {slides[activeIndex].src}
                                
                            />
                        </div>

                    <div className = "Navigate-Carousel">    
                        <button
                            onClick = {nextSlide}>
                        </button>
                        <button
                            onClick = {nextSlide}>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default FirstFacade;