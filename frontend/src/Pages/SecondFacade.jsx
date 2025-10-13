import { Link } from "react-router-dom";

import Photo1 from "../Sample-Photos/GAD-Kapihan.jpg"
import Photo2 from "../Sample-Photos/Multification-Invication.jpg"
import JUSTIN from "../Sample-Photos/JUST-IN.jpg"
import OPINION from "../Sample-Photos/OPINION.jpg"
import VIDEO from "../Sample-Photos/CA240830_172531.mp4"

import TPALogoBlack from "../assets/Miniature_Icon_Version/TPALogoBlack.svg"
import SearchIcon from "../assets/Miniature_Icon_Version/TPA-Blue.svg"

import "../CSS/SecondFacade.css"

import RollingHeadlines from "../Components/RollingHeadlines.jsx";
import Tabs from "../Components/Tabs.jsx";
import VerticalFastNews from "../Components/VerticalFastNews.jsx";
import VideoShowcase from "../Components/VideoShowcase.jsx";

const SecondFacade = () => {

    return(
        <div className = "Second-Facade">
            <RollingHeadlines/>

            <div className = "Cover-Photo-Image-Facade" loading = "lazy">
                <input type = "text" className = "SearchBar" placeholder = "Turno en contra." />
            </div>

            <Tabs />
            
        <div className = "Below-Cover-Photo">   

            <div className = "letterA">
                <div className = "Large-News-Boxes">
                <div className = "Large-Left-News-Column">
                    <Link to = "#" className = "Category" > LATEST ———{`>`}</Link>  
                    <div className = "Large-Photo-News" onClick = "#" style = {{flexWrap: "wrap"}}> 

                        <img
                            // style = {{ marginBottom: "1.5rem", width: "85rem",}} style = {{ flexWrap: "wrap", justifyContent: "center"}}
                            src = {Photo2}
                            style = {{height: "40rem", width: "auto"}}
                        />

                        <div className = "Large-News" >
                            <Link to = "/Joseph-Brian-Balut" className = "Large-News-Headline">
                                <Link to = "/Joseph-Brian-Balut"> LOOK: TUP Manila concludes 120th commencement exercises with graduates from CLA, COS, and graduate programs </Link>
                                
                                <div className = "Article-Author-Time">
                                    <Link to = "/" >Cathlene Torrenueva | September 12, 2025</Link>  
                                </div>
                                <div className = "Vertical-Side-News"><hr id = "Sample-Text-HR"></hr>
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
                </div>
                
                <VerticalFastNews />

            </div>
                    <div className = "Large-Photo-News">
                        <Link to = "/Latest-News" className = "Category"> LOOK, IN PHOTOS, & HIGHLIGHTS ———{`>`}</Link>
                    </div>

                    <div className = "Large-Photo-News" onClick = "#"> 

                        <img  loading = "lazy"  style = {{height: "20rem", aspectRatio: "16 / 9"}}
                            // style = {{ marginBottom: "1.5rem", width: "85rem",}} style = {{ flexWrap: "wrap", justifyContent: "center"}}
                            src = {Photo2}
                        />

                        <div className = "Large-News" >
                            <Link to = "/Joseph-Brian-Balut" className = "Large-News-Headline">
                                <Link to = "/Joseph-Brian-Balut"> LOOK: TUP Manila concludes 120th commencement exercises with graduates from CLA, COS, and graduate programs </Link>
                                
                                <div className = "Article-Author-Time">
                                    <Link to = "/" >Cathlene Torrenueva | September 12, 2025</Link>  
                                </div>

                                <div className = "Vertical-Side-News"><hr id = "Sample-Text-HR"></hr>
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
            <Link to = "/Media-Segment-Page" className = "Category" id = "Category"> MEDIA SEGMENTS <Link to = "#" id = "Category"> ———{`>`} </Link></Link>
            
            <div className = "letterA" style = {{flexDirection: "column"}}>
                <div className = "Large-News-Boxes" id = "Media-Segment-Large-Photo">
                    <div className = "Large-Photo-News" onClick = "#" style = {{flexWrap: "wrap"}}>

                        <img  loading = "lazy" 
                            src = {JUSTIN}
                        />

                        <div className = "Large-News" >
                            <Link to = "/Joseph-Brian-Balut" className = "Large-News-Headline">
                                <Link to = "/Joseph-Brian-Balut"> SPORTS SUNDAY: TUP Manila concludes 120th commencement exercises with graduates from CLA, COS, and graduate programs </Link>

                                <div className = "Article-Author-Time">
                                    <Link to = "/" >Cathlene Torrenueva | September 12, 2025</Link>  
                                </div>
                            </Link>
                        </div>
                    </div>

                </div>

                <div className = "Horizontal-Headlines" style = {{ gridTemplateAreas: "1fr 1fr 1fr 1fr 1fr 1fr"}}>

                    {
                        // <Link to = "/Media-Segment/Page"> READ MORE <hr></hr> </Link> //
                    }
                    
                    <Link to = "/Joseph-Brian-Balut" className = "Horizontal-Side-News" id = "MM">       
                            <img  loading = "lazy" 
                                src = {JUSTIN}
                            />                     
                        <div className = "Secondary-News-Headline">
                            <p> Makata Mondays </p>
                        </div>
                    </Link>

                    <div className = "Horizontal-Side-News" id = "TTu">       
                            <img  loading = "lazy" 
                                src = {JUSTIN}
                            />                     
                        <div className = "Secondary-News-Headline">
                            <Link to = "/Joseph-Brian-Balut"> Tek Tuesdays</Link>
                        </div>
                    </div>

                    <div className = "Horizontal-Side-News"  id = "WW">       
                            <img  loading = "lazy" 
                                src = {JUSTIN}
                            />                     
                        <div className = "Secondary-News-Headline">
                            <Link to = "/Joseph-Brian-Balut"> Wankjob Wednesdays</Link>
                        </div>
                    </div>

                    <div className = "Horizontal-Side-News"  id = "TTh">       
                            <img  loading = "lazy" 
                                src = {JUSTIN}
                            />                     
                        <div className = "Secondary-News-Headline">
                            <Link to = "/Joseph-Brian-Balut"> Tala Thursdays</Link>
                        </div>
                    </div>

                    <div className = "Horizontal-Side-News"  id = "FF">       
                            <img  loading = "lazy" 
                                src = {JUSTIN}
                            />                     
                        <div className = "Secondary-News-Headline">
                            <Link to = "/Joseph-Brian-Balut"> Features Friday</Link>
                        </div>
                    </div>

                    <div className = "Horizontal-Side-News"  id = "StS">       
                            <img  loading = "lazy" 
                                src = {JUSTIN}
                            />                     
                        <div className = "Secondary-News-Headline">
                            <Link to = "/Joseph-Brian-Balut"> Streaming Saturday</Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
)
}

export default SecondFacade;