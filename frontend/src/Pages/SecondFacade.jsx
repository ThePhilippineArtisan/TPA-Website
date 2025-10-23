import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import Photo1 from "../Sample-Photos/GAD-Kapihan.jpg"
import Photo2 from "../Sample-Photos/Multification-Invication.jpg"
import JUSTIN from "../Sample-Photos/JUST-IN.jpg"
import OPINION from "../Sample-Photos/OPINION.jpg"
import VIDEO from "../Sample-Photos/CA240830_172531.mp4"

import TPALogoBlack from "../assets/Miniature_Icon_Version/TPALogoBlack.svg"

import "../CSS/SecondFacade.css"

import RollingHeadlines from "../Components/RollingHeadlines.jsx";
import CoverPhotoSearch from "../Components/CoverPhotoSearch.jsx";
import Tabs from "../Components/Tabs.jsx";
import VerticalFastNews from "../Components/VerticalFastNews.jsx";
import VideoShowcase from "../Components/VideoShowcase.jsx";
import LatestMediaSegment from "../Components/LatestMediaSegment.jsx";
import ListOfMediaSegments from "../Components/ListOfMediaSegments.jsx";

const SecondFacade = () => {
    
    const[articleList, setArticleList] = useState([])
    const latestArticle = articleList.length > 0 ? articleList[0] : null;

    useEffect(() => {
        fetch("http://localhost:5000/article")
            .then((res) => res.json())
            .then((data) => setArticleList(data))
            .catch((err) => console.error("Failed to fetch articles: ", err))
    }, [])

    return(
        <div className = "Second-Facade">
            <RollingHeadlines/>
            <CoverPhotoSearch />
            <Tabs />
            
            <div className = "Below-Cover-Photo">   

                <div className = "letterA">
                    <div className = "Large-News-Boxes">
                        <div className = "Large-Left-News-Column">
                            <Link to = "/LatestArticles" className = "Category" > LATEST ———{`>`} </Link>  
                    
                                {latestArticle && 
                                (<Link to = {`/article/${latestArticle.article_id}/${latestArticle.slug_headline}`} 
                                className = "Large-Photo-News" 
                                onClick = "#" 
                                style = {{flexWrap: "wrap"}}> 

                                <img
                                    src = {Photo2}
                                    style = {{height: "40rem", width: "auto"}}
                                />

                                <div className = "Large-News" >
                                    <div className = "Large-News-Headline">
                                        <a> {latestArticle.article_headline} </a>
                                    
                                        <div className = "Article-Author-Time">
                                            <a to = "/" >Cathlene Torrenueva | September 12, 2025</a>  
                                        </div>
                                        
                                        <div className = "Vertical-Side-News"><hr id = "Sample-Text-HR"></hr>
                                            <div className = "Sample-Text">
                                                <p> {latestArticle.article_body} </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </Link>
                                )
                                }
                        </div>
                    </div>
                <VerticalFastNews />
            </div>

            <Link to = "/Latest-News" className = "Category"> LOOK, IN PHOTOS, & HIGHLIGHTS ———{`>`}</Link>

                <div className = "Large-Photo-News" onClick = "#"> 
                    <img  loading = "lazy"  style = {{height: "20rem", aspectRatio: "16 / 9"}}
                        src = {Photo2}
                    />

                    <div className = "Large-News" >
                        <Link to = "/Joseph-Brian-Balut" className = "Large-News-Headline">
                            <Link to = "/Joseph-Brian-Balut"> LOOK: TUP Manila concludes 120th commencement exercises with graduates from CLA, COS, and graduate programs </Link>
                                
                            <div className = "Article-Author-Time">
                                <Link to = "/" >Cathlene Torrenueva | September 12, 2025</Link>
                            </div>

                            <div className = "Vertical-Side-News">
                                <hr></hr>
                                <div className = "Sample-Text">
                                    <p> MGA LARAWAN:  Estudyante mula sa iba't ibang unibersidad na miyembro ng One Taft Alliance ay nagsagawa ng Black Friday Protest sa kahabaan ng Ayala Blvd.,  kahapon, Setyembre 12, 2025.
                                        Layunin ng protesta na iparating ang pagkondena ng mga estudyante at kabataan sa nagaganap na korapsyon sa gobyerno at sa mga regresibong patakarang iniimplementa sa iba't-ibang mga unibersidad.
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
        </div>

        <VideoShowcase />

            <div className = "Below-Cover-Photo">
                <Link to = "/Media-Segment-Page" className = "Category" id = "Category"> MEDIA SEGMENTS  ———{`>`} </Link>
                <div style={{border: "3px solid black"}}>
                    <LatestMediaSegment/>
                </div>            
            </div>
                
            <div className = "Below-Cover-Photo">
                <div className = "letterA" style = {{flexDirection: "column"}}>
                    <ListOfMediaSegments />
                </div>
            </div>
        </div>
)}

export default SecondFacade;