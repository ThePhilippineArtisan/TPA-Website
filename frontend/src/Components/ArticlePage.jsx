import SamplePhoto1 from "../Sample-Photos/1.jpg"
import SamplePhoto2 from "../Sample-Photos/2.jpg"
import SamplePhoto3 from "../Sample-Photos/3.jpg"
import SamplePhoto4 from "../Sample-Photos/4.jpg"
import SamplePhoto5 from "../Sample-Photos/5.jpg"
import SamplePhoto6 from "../Sample-Photos/6.jpg"
import SamplePhoto7 from "../Sample-Photos/7.jpg"
import SamplePhoto8 from "../Sample-Photos/8.jpg"
import SamplePhoto9 from "../Sample-Photos/9.jpg"
import SamplePhoto10 from "../Sample-Photos/10.jpg"

import Photo1 from "../Sample-Photos/GAD-Kapihan.jpg"
import Photo2 from "../Sample-Photos/Multification-Invication.jpg"
import JUSTIN from "../Sample-Photos/JUST-IN.jpg"
import OPINION from "../Sample-Photos/OPINION.jpg"

import {useState} from "react"

import "../CSS/ArticlePage.css"

const ArticlePage = () => {

    const photos = [
        SamplePhoto1,
        SamplePhoto2,
        SamplePhoto3,
        SamplePhoto4,
        SamplePhoto5,
        SamplePhoto6,
        SamplePhoto7,
        SamplePhoto8,
        SamplePhoto9,
        SamplePhoto10,
        Photo1,
        Photo2,
        SamplePhoto5,
        SamplePhoto6,
        SamplePhoto7,
        JUSTIN,
        OPINION,
        SamplePhoto4,
        SamplePhoto5,
        SamplePhoto6,
        SamplePhoto7,
        SamplePhoto8,
    ]

    const [currentPhoto, setCurrentPhoto] = useState(photos[0])

    return(
        <div className = "Article-Page">

            <div className = "Article-Headline">
                <h2> LOOK: TUP Manila concludes 120th commencement exercises with graduates from CLA, COS, and graduate programs </h2>

                <br></br> 
                <hr></hr>

                <div className = "Author-and-Date">
                    <div className = "Author">
                        <a><h3> Aldous Paras, </h3> </a>
                        <a><h3> Jim Rojan Raguindin, </h3> </a>
                        <a><h3> Laurean Aquino </h3> </a>
                        <br></br>
                    </div>

                    <div className = "Date">
                        <a> <h3>June 19, 2025 </h3> </a>
                    </div>
                </div>

            </div>


            <div className = "Foreground-Photo">
                <img src = {currentPhoto}/>

            </div>
                    <div className = "Photo-Illustration-Layout-Credits"> 
                        Photos by Angela Genio & John Peregrin
                    </div>
                    
            <div className = "Extra-Photos-Container">
                <div className = "Extra-Photos"> 
                    
                    {photos.slice(1).map((photo, index) => (
                        <img
                            key = {index}
                            src = {photo}
                            loading = "lazy"
                            onClick = {() => setCurrentPhoto(photo)}
                            style = {{ cursor: "pointer" }}
                        />
                    ))}
                    
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


            <div className = "Suggested-Articles">
                <h1> READ MORE </h1>
            </div>
        </div>
        
    )
} 

export default ArticlePage;