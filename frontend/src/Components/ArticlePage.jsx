import {useState} from "react"

import ARROW from "../assets/Miniature_Icon_Version/arrow.svg"

import "../CSS/ArticlePage.css"

const ArticlePage = () => {

    const photos = [
        new URL("../Sample-Photos/1.jpg", import.meta.url).href,
        new URL("../Sample-Photos/2.jpg", import.meta.url).href,
        new URL("../Sample-Photos/3.jpg", import.meta.url).href,
        new URL("../Sample-Photos/JUST-IN.jpg", import.meta.url).href,
        new URL("../Sample-Photos/4.jpg", import.meta.url).href,
        new URL("../Sample-Photos/5.jpg", import.meta.url).href,
        new URL("../Sample-Photos/6.jpg", import.meta.url).href,
        new URL("../Sample-Photos/Multification-Invication.jpg", import.meta.url).href,
        new URL("../Sample-Photos/7.jpg", import.meta.url).href,
        new URL("../Sample-Photos/8.jpg", import.meta.url).href,
        new URL("../Sample-Photos/9.jpg", import.meta.url).href,
        new URL("../Sample-Photos/GAD-Kapihan.jpg", import.meta.url).href,
        new URL("../Sample-Photos/10.jpg", import.meta.url).href,
        new URL("../Sample-Photos/OPINION.jpg", import.meta.url).href,
    ]

    const [currentPhoto, setCurrentPhoto] = useState(photos[0])

    return(
        <div className = "Article-Page">

            <div className = "Article-Headline">
                <div className = "Simple-Tag"> 
                    <h4>  LOOK, NEWS, 120th Commencement Exercise, Graduation, Batch Hiraya </h4>  
                </div>
                
                <h1 id = "Headline"> TUP Manila concludes 120th commencement exercises with graduates from CLA, COS, and graduate programs </h1>

                <br></br> 
                <hr></hr>

                <div className = "Author-and-Date">
                    <div className = "Author">
                        <a><h3> Aldous Paras, </h3> </a>
                        <a><h3> Jim Raguindin, </h3> </a>
                        <a><h3> Laurean Aquino </h3> </a>
                        <br></br>
                    </div>

                    <div className = "Date">
                        <a> <h3>June 19, 2025 </h3> </a>
                    </div>
                </div>

            </div>


            <div className = "Foreground-Photo ">
                <img src = {currentPhoto} loading = "lazy"/>

            </div>
                    <div className = "Photo-Illustration-Layout-Credits"> 
                        Photos by Angela Genio & John Peregrin asasdsadssaddsa
                    </div>
                    
            <div className = "Extra-Photos-Container">
                <div className = "Extra-Photos"> 
                    
                    {photos.slice(0).map((photo, index) => (
                        <img
                            key = {index}
                            src = {photo}
                            loading = "lazy"
                            onClick = {() => setCurrentPhoto(photo)}
                            style = {{ cursor: "pointer" }}
                        />
                    ))}
                    
                    <img loading = "lazy" src = {ARROW} style = {{cursor: "pointer", height: "3rem"}}/>
                </div>

            </div>

            <div className = "Below-Small-Photos">
                <div className = "Article-Body">
                    <p>
                    TUP Manila held the final day of its 120th Commencement Exercises on August 7, 2025, at the Theatre at Solaire, recognizing the graduates from the College of Liberal Arts (CLA) and the College of Science (COS) in the morning session. <br></br>
                    <br></br>    A total of 770 graduates from CLA and COS were recognized during the morning ceremony. Among them was Jelena Anne Inovio from the College of Liberal Arts, who was awarded as the sole summa cum laude of the batch. In her speech, she emphasized that true success is not about being the best alone, but about helping others have the chance to be their best too.
                    <br></br> <br></br>
                    Dr. Teresita C. Fortuna, President of Colegio de Muntinlupa and former DOST Regional Director, addressed the graduates with a message of encouragement, stating, "This is now your time to shine dont just imagine and envision the future, build it with purpose and let your strategy for success shape our country."
                    <br></br> <br></br>    
                    In the afternoon session, the university honored 110 master’s degree graduates and 29 doctoral graduates.
                    <br></br> <br></br>    
                    Hon. Shirley C. Agrupis, Chairperson of the Commission on Higher Education, delivered a closing message, urging the graduates to go beyond earning their degrees and aim to change the world.
                    <br></br> <br></br>    
                    These ceremonies mark the end of the culmination of TUP's three-day commencement exercises, officially closing this academic year’s graduation rites. 
                    <br></br> <br></br>    
                    Congratulations, Batch 2025!

                    </p>
                </div>
            </div>

            <h1 id = "Read-More"> READ MORE </h1>
            
            <div className = "Suggested-Articles">
                <div className = "Suggested-News">
                        <div className = "Three-News">
                            <a> TUPM Shifts from deathly afraid of the dark </a>
                        </div>
                        <div className = "Three-News">
                            <a> TUPM Shifts from deathly afraid of the dark </a>
                        </div>
                        <div className = "Three-News">  
                            <a> TUPM Shifts from deathly afraid of the dark </a>
                        </div>
                        
                </div>
            </div>
        </div>
    )
} 

export default ArticlePage;