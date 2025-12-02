import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import Photo1 from "../Sample-Photos/GAD-Kapihan.jpg"
import Photo2 from "../Sample-Photos/Multification-Invication.jpg"
import JUSTIN from "../Sample-Photos/JUST-IN.jpg"
import OPINION from "../Sample-Photos/OPINION.jpg"

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

    return(
        <div className = "Second-Facade">
            <RollingHeadlines />
            <Tabs />
            
            <div className = "Below-Cover-Photo">   

                <div className = "letterA">
                    <div className = "Large-News-Boxes">
                        <div className = "Large-Left-News-Column">
                            <Link to = "/Latest" className = "Category" > PUT HERE ANYTHING LATEST EXCEPT FAST NEWS <span>———{`>`}</span> </Link>  
                    
                                <Link to = "/"
                                className = "Large-Photo-News" 
                                style = {{flexWrap: "wrap"}}> 

                                <img
                                    src = {Photo2}
                                    style = {{width: "85%"}}
                                />

                                <div className = "Large-News" >
                                    <div className = "Large-News-Headline">
                                        <p><a> LOOK: TUP Manila concludes 120th commencement exercises with graduates from CLA, COS, and graduate programs </a> </p>
                                    
                                        <div className = "Article-Author-Time">
                                            <p to = "/" >Cathlene Torrenueva | September 12, 2025</p>  
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                <VerticalFastNews />

            </div>

            <Link to = "/Photo-Albums" className = "Category"> PHOTO ALBUM REPERTOIRE <span>———{`>`}</span></Link>

                <div className = "Large-Photo-News" onClick = "#"> 
                    <hr className = "Vertical-Divider"></hr>
                    <img  
                        loading = "lazy"  
                        src = {Photo2}
                    />
                    
                    <div className = "Large-News" >
                        <Link to = "/Joseph-Brian-Balut" className = "Large-News-Headline">
                            <p><a> LOOK: TUP Manila concludes 120th commencement exercises with graduates from CLA, COS, and graduate programs </a></p>
                            <div className = "Article-Author-Time">
                                <p>Cathlene Torrenueva | September 12, 2025</p>
                            </div>

                            <div className = "Sample-Text-Container">
                                <hr className = "Vertical-Divider"></hr>
                                <div className = "Sample-Text">
                                    <p> MGA LARAWAN:  Estudyante mula sa iba't ibang unibersidad na miyembro ng One Taft Alliance ay nagsagawa ng Black Friday Protest sa kahabaan ng Ayala Blvd.,  kahapon, Setyembre 12, 2025.
                                        Layunin ng protesta na iparating ang pagkondena ng mga estudyante at kabataan sa nagaganap na korapsyon sa gobyerno at sa mga regresibong patakarang iniimplementa sa iba't-ibang mga unibersidad.
                                    </p>
                                </div>
                            </div>
                            
                        </Link>
                    </div>
                </div>

                <div className = "Large-Photo-News" onClick = "#"> 
                    <div className = "Large-News" >
                        <Link to = "/Joseph-Brian-Balut" className = "Large-News-Headline">
                            <p><a> LOOK: TUP Manila concludes 120th commencement exercises with graduates from CLA, COS, and graduate programs </a></p>                            <div className = "Article-Author-Time">
                                <p>Cathlene Torrenueva | September 12, 2025</p>
                            </div>

                            <div className = "Sample-Text-Container">
                                <hr className = "Vertical-Divider"></hr>
                                <div className = "Sample-Text">
                                    <p> MGA LARAWAN:  Estudyante mula sa iba't ibang unibersidad na miyembro ng One Taft Alliance ay nagsagawa ng Black Friday Protest sa kahabaan ng Ayala Blvd.,  kahapon, Setyembre 12, 2025.
                                        Layunin ng protesta na iparating ang pagkondena ng mga estudyante at kabataan sa nagaganap na korapsyon sa gobyerno at sa mga regresibong patakarang iniimplementa sa iba't-ibang mga unibersidad.
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                    
                    <img  
                        loading = "lazy"  
                        src = {Photo2}
                    />
                    <hr className = "Vertical-Divider"></hr>
                </div>


        </div>

            <div className = "Below-Cover-Photo">
                <Link to = "/Media-Segment-Page" className = "Category" id = "Category"> MEDIA SEGMENTS <span>———{`>`}</span> </Link>
                <div style={{border: "3px solid black"}}>
                    <LatestMediaSegment/>
                </div>            
            </div>
                
            <div className = "Below-Cover-Photo">
                    <ListOfMediaSegments />
            </div>


        <VideoShowcase />

        </div>
)}

export default SecondFacade;