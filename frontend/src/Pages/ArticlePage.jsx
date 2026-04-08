import {useEffect, useState} from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../supabaseClient.js"

import VerticalFastNews from "../Components/VerticalFastNews.jsx";
import "../CSS/ArticlePage.css"

const ArticlePage = () => {

    const { articleId } = useParams(); // get the articleId from the URL parameters

    const [mediaFiles, setMediaFiles] = useState([]);

    useEffect(() => { // run this code when the component mounts/loads
        const fetchMediaFiles = async () => {
            let {data, error} = await supabase
            
            .from(`article`) // table name
            .select(`
                article_id, article_headline, article_body, published_at,
                article_media( 
                    media(
                        media_id, media_url
                    )
                )
                `
            ).eq("article_id", 1) // column name/s or instead of 1 articleId from  the URL parameters
            
            // by including article_media in the select statement, 
            // we can access the media table and its columns (media_id, media_url) 
            // through the article_media relationship defined in the database schema (as long as it's a Foreign Key).
            // This allows us to retrieve the media_url associated with each article in a single query, 
            // which is more efficient than making separate queries for each article to get its media.

            if (error){
                console.log("Error fetching media files: ", error)
            } else {
                setMediaFiles(data.map(item => item.media_url)) // extract media_url from each item and set it to state
            }
        }
        fetchMediaFiles();
    }, [])

    {/***
    const photos = [
        "https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/1.jpg",
        "https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/2.jpg",
        "https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/3.jpg",
        "https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/4.jpg",
        "https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/5.jpg",
        "https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/6.jpg",
        "https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/7.jpg",
        "https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/8.jpg",
        "https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/9.jpg",
        "https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/10.jpg",
        "https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/JUST-IN.jpg",
        "https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/Multification-Invication.jpg",
        "https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/GAD-Kapihan.jpg",
        "https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/OPINION.jpg",
        "https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/StreamingSat.jpg",
        "https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/Features_Friday.jpg",
        "https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/Bata.jpg",

        // new URL("../Sample-Photos/1.jpg", import.meta.url).href,
        // new URL("../Sample-Photos/2.jpg", import.meta.url).href,
        // new URL("../Sample-Photos/3.jpg", import.meta.url).href,
        // new URL("../Sample-Photos/JUST-IN.jpg", import.meta.url).href,
        // new URL("../Sample-Photos/4.jpg", import.meta.url).href,
        // new URL("../Sample-Photos/5.jpg", import.meta.url).href,
        // new URL("../Sample-Photos/6.jpg", import.meta.url).href,
        // new URL("../Sample-Photos/Multification-Invication.jpg", import.meta.url).href,
        // new URL("../Sample-Photos/7.jpg", import.meta.url).href,
        // new URL("../Sample-Photos/8.jpg", import.meta.url).href,
        // new URL("../Sample-Photos/9.jpg", import.meta.url).href,
        // new URL("../Sample-Photos/GAD-Kapihan.jpg", import.meta.url).href,
        // new URL("../Sample-Photos/10.jpg", import.meta.url).href,
        // new URL("../Sample-Photos/OPINION.jpg", import.meta.url).href,
    ]

    const [currentPhoto, setCurrentPhoto] = useState(photos[0])
    **/}
    
    return( 
        <div className = "Article-Page">
            
            <div className = "Article-Headline">
                <div className = "Simple-Tag"> 
                    <h4>  LOOK, NEWS, 120th Commencement Exercise, Graduation, Batch Hiraya </h4>  
                </div>
                
                <h1 id = "Headline" > TUP Manila concludes 120th commencement exercises with graduates from CLA, COS, and graduate programs </h1>

                <br></br> 
                <hr></hr>

                <div className = "Author-and-Date">                
                    <div className = "Author">
                        <a><h3> Aldous Paras, </h3> </a>
                        <a><h3> Jim Raguindin, </h3> </a>
                        <a><h3> Laurean Aquino </h3> </a>
                    </div>

                    <div className = "Date">
                        <a> <h3>June 19, 2025 </h3> </a>
                    </div>
                </div>

            </div>

            <div style={{display: "flex",justifyContent: "center"}}>
                <div className = "Foreground-Photo ">
                    <img src = {currentPhoto} loading = "lazy"/>                
                </div>

                <div className = "Extra-Photos-Container-Two">
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
                        
                        {/** <img loading = "lazy" src = {ARROW} style = {{cursor: "pointer", height: "3rem"}}/> **/}
                    </div>
                </div>
            </div>

            <div className = "Photo-Illustration-Layout-Credits" style = {{textAlign: "center"}}> 
                Photos by Angela Genio & John Peregrin 
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
                <div>
                    <h4> <span style = {{color: "#0265A9"}}> Click this link to view the sources, interview, or media used in this article. </span> </h4>
                    <br></br>
                    <h4> 1,234 words | 2 minute read </h4>
                    <br></br>
                    <hr ></hr>                 
                    <VerticalFastNews />
                </div>
            </div>
            <div style={{marginLeft: "10%", marginRight: "10%"}}>
                <hr style={{borderBottom: "2px solid #0265A9"}}></hr>
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