import Photo1 from "../Sample-Photos/GAD-Kapihan.jpg"
import Photo2 from "../Sample-Photos/Multification-Invication.jpg"
import JUSTIN from "../Sample-Photos/JUST-IN.jpg"
import OPINION from "../Sample-Photos/OPINION.jpg"

import TPALogoBlack from "../assets/Miniature_Icon_Version/TPALogoBlack.svg"

import "../CSS/SecondFacade.css"


const SecondFacade = () => {
    return(
        <div className = "Second-Facade">

            <div className = "Rolling-Headline"> {/** JUST TO BE APT, MAXIMUM 5 LATEST HEADLINES  */}

                <marquee behavior="scroll" direction="left" scrollamount="5">
                    <img src = {TPALogoBlack}/>
                    <a href = "#" > JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </a>
                    <img src = {TPALogoBlack}/>
                </marquee>
            </div>

                <div className = "Cover-Photo-Image-Facade">
                    <input type = "text" className = "SearchBar"
                    placeholder = "Turno en contra."/>
                </div>


                <div className = "Tabs">
                    <a> Top Story </a>
                    <a> Latest </a>
                    <a> Opinion </a>
                    <a title = "Poetry, Prose, Pretention Galore! Ang Makata Monday ay ang pang-Literaryong Media Segment ng TPA"> Makata Monday </a>
                    <a title = "Our Teks dive into the world of technology!"> Tek Tuesday </a>
                    <a title = "Editorial Cartoonist and Wankers Wanking for attention"> Wankjob Wednesday </a>
                    <a title = "Filipino por Indio words of the Day!"> Tala Thursday </a>
                    <a title = "Professional Yappers Yapping About Yap"> Features Friday </a>
                    <a title = "Professional Yappers Yapping About Yap"> Streaming Saturday </a>
                    <a title = "May Athletes pa pala tayo bukod kina Pacquiao, Yulo, Eala, at Diaz?"> Sports Sunday </a>

                {/** 
                    <a id = "MM" title = "Poetry, Prose, Pretention Galore! Ang Makata Monday ay ang pang-Literaryong Media Segment ng TPA"> Makata Monday </a>
                    <a id = "TTu" title = "Our Teks dive into the world of technology!"> Tek Tuesday </a>
                    <a id = "WW" title = "Editorial Cartoonist and Wankers Wanking for attention"> Wankjob Wednesday </a>
                    <a id = "TTh"  title = "Filipino por Indio words of the Day!" > Tala Thursday </a>
                    <a id = "FF"  title = "Professional Yappers Yapping About Yap"> Features Friday </a>
                    <a id = "StS" title = "Professional Yappers Yapping About Yap"> Streaming Saturday </a>
                    <a id = "SpS" title = "May Athletes pa pala tayo bukod kina Pacquiao, Yulo, Eala, at Diaz?"> Sports Sunday</a>
                */}
                </div>
                
            <div className = "Below-Cover-Photo">
                <div className = "Category"> <a href = "#" > ANNOUNCEMENTS </a> </div>     
                    <div className = "Large-News-Boxes">


                        <div className = "Large-Photo-News" onClick = "#">
                            
                            <img
                                src = {Photo1}
                            />

                            <div className = "Large-News">
                                <div className = "Primary-News-Headline">
                                    <a href = "#"> LOOK: TUP Manila concludes 120th commencement exercises with graduates from CLA, COS, and graduate programs </a>
                                </div>

                                <div className = "Sample-Text"> 
                                </div>

                                <div className = "Article-Author-Time">
                                    <span>Cathlene Torrenueva • 3 days ago</span>   
                                </div>
                            </div>
                        </div>
                    </div>
                
                <div className = "Category"> <a href = "#" > LATEST </a> </div>     
                    <div className = "Large-News-Boxes">


                        <div className = "Large-Photo-News" onClick = "#">
                            
                            <img
                                src = {Photo1}
                            />

                            <div className = "Large-News">
                                <div className = "Primary-News-Headline">
                                    <a href = "#"> LOOK: TUP Manila concludes 120th commencement exercises with graduates from CLA, COS, and graduate programs </a>
                                </div>

                                <div className = "Sample-Text"> 
                                </div>

                                <div className = "Article-Author-Time">
                                    <span>Cathlene Torrenueva • 3 days ago</span>   
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className = "Small-News-Box">
                    <div className = "Small-News-Boxes"> 
                        <div className = "Small-Photo-News">                            
                            <img
                                src = {JUSTIN}
                            />
                            <div className = "Small-News">
                                <div className = "Secondary-News-Headline">
                                    <a href = "#"> LOOK: GAD recognizes Outstanding GADvocates for Academic Year 2024 - 2025 adssaddsadsad aa sdsadsadsasad asdasd</a>
                                </div>
                            </div>
                        </div>

                        <div className = "Small-Photo-News">                            
                            <img
                                src = {Photo2}
                            />
                            <div className = "Small-News">
                                <div className = "Secondary-News-Headline">
                                    <a href = "#"> LOOK: GAD recognizes Outstanding GADvocates for Academic Year 2024 - 2025 adssaddsadsad aa sdsadsadsasad asdasd</a>
                                </div>
                            </div>
                        </div>

                        <div className = "Small-Photo-News">                            
                            <img
                                src = {OPINION}
                            />
                            <div className = "Small-News">
                                <div className = "Secondary-News-Headline">
                                    <a href = "#"> LOOK: GAD recognizes Outstanding GADvocates for Academic Year 2024 - 2025 adssaddsadsad aa sdsadsadsasad asdasd</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default SecondFacade;
