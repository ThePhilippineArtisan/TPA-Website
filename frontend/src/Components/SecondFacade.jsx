import { Link } from "react-router-dom";

import Photo1 from "../Sample-Photos/GAD-Kapihan.jpg"
import Photo2 from "../Sample-Photos/Multification-Invication.jpg"
import JUSTIN from "../Sample-Photos/JUST-IN.jpg"
import OPINION from "../Sample-Photos/OPINION.jpg"

import TPALogoBlack from "../assets/Miniature_Icon_Version/TPALogoBlack.svg"

import "../CSS/SecondFacade.css"

const SecondFacade = () => {
    return(
        <div className = "Second-Facade">
                <div className = "Cover-Photo-Image-Facade">
                    <input type = "text" className = "SearchBar"
                    placeholder = "Turno en contra."/>
                </div>
            <div className = "Rolling-Headline"> {/** JUST TO BE APT, MAXIMUM 5 LATEST HEADLINES  */}

                <marquee behavior="scroll" direction="left" scrollamount="5">
                    <img src = {TPALogoBlack}/>
                    <Link to = "#" > JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </Link>
                    <img src = {TPALogoBlack}/>
                </marquee>
            </div>


                <div className = "Tabs">
                    <Link to = "#"> Top Story </Link>
                    <Link to = "#"> Latest </Link>
                    <Link to = "#"> Opinion </Link>
                    <Link to = "#" title = "Poetry, Prose, Pretention Galore! Ang Makata Monday ay ang pang-Literaryong Media Segment ng TPA"> Makata Monday </Link>
                    <Link to = "#" title = "Our Teks dive into the world of technology!"> Tek Tuesday </Link>
                    <Link to = "#" title = "Editorial Cartoonist and Wankers Wanking for attention"> Wankjob Wednesday </Link>
                    <Link to = "#" title = "Filipino por Indio words of the Day!"> Tala Thursday </Link>
                    <Link to = "#" title = "Professional Yappers Yapping About Yap"> Features Friday </Link>
                    <Link to = "#" title = "Professional Yappers Yapping About Yap"> Streaming Saturday </Link>
                    <Link to = "#" title = "May Athletes pa pala tayo bukod kina Pacquiao, Yulo, Eala, at Diaz?"> Sports Sunday </Link>

                {/** 
                    <a id = "MM" title = "Poetry, Prose, Pretention Galore! Ang Makata Monday ay ang pang-Literaryong Media Segment ng TPA"> Makata Monday </Link>
                    <a id = "TTu" title = "Our Teks dive into the world of technology!"> Tek Tuesday </Link>
                    <a id = "WW" title = "Editorial Cartoonist and Wankers Wanking for attention"> Wankjob Wednesday </Link>
                    <a id = "TTh"  title = "Filipino por Indio words of the Day!" > Tala Thursday </Link>
                    <a id = "FF"  title = "Professional Yappers Yapping About Yap"> Features Friday </Link>
                    <a id = "StS" title = "Professional Yappers Yapping About Yap"> Streaming Saturday </Link>
                    <a id = "SpS" title = "May Athletes pa pala tayo bukod kina Pacquiao, Yulo, Eala, at Diaz?"> Sports Sunday</Link>
                */}
                </div>


                
            <div className = "Below-Cover-Photo"> 
                <Link to = "#" className = "Category">  TOP STORY  </Link>     
                
                    <div className = "Large-News-Boxes">
                        <div className = "Large-Photo-News" onClick = "#">
                            
                            <img
                                src = {Photo1}
                            />

                            <div className = "Large-News">
                                <div className = "Primary-News-Headline">
                                    <Link to = "#"> LOOK: TUP Manila concludes 120th commencement exercises with graduates from CLA, COS, and graduate programs </Link>
                                </div>

                                <div className = "Sample-Text"> 
                                </div>

                                <div className = "Article-Author-Time">
                                    <span> Cathlene Torrenueva • 3 days ago </span>   
                                </div>
                            </div>
                        </div>
                    </div>
                
                <Link to = "#" className = "Category"> LATEST </Link>     
                    <div className = "Large-News-Boxes">


                        <div className = "Large-Photo-News" onClick = "#">
                            
                            <img
                                src = {Photo1}
                            />

                            <div className = "Large-News">
                                <div className = "Primary-News-Headline">
                                    <Link to = "#"> LOOK: TUP Manila concludes 120th commencement exercises with graduates from CLA, COS, and graduate programs </Link>
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
                                        <Link to = "#"> Makata Mondays: The Hunchback of Calle Juan Luna</Link>
                                    </div>
                                </div>
                            </div>

                            <div className = "Small-Photo-News">                            
                                <img
                                    src = {Photo2}
                                />
                                <div className = "Small-News">
                                    <div className = "Secondary-News-Headline">
                                        <Link to = "#"> Tek Tuesday: The price of compounded lies </Link>
                                    </div>
                                </div>
                            </div>

                            <div className = "Small-Photo-News">                            
                                <img
                                    src = {OPINION}
                                />
                                <div className = "Small-News">
                                    <div className = "Secondary-News-Headline">
                                        <Link to = "#"> Wankjob Wednesday </Link>
                                    </div>
                                </div>
                            </div>

                            <div className = "Small-Photo-News">                            
                                <img
                                    src = {OPINION}
                                />
                                <div className = "Small-News">
                                    <div className = "Secondary-News-Headline">
                                        <Link to = "#"> Wankjob Wednesday </Link>
                                    </div>
                                </div>
                            </div>

                            <div className = "Small-Photo-News">                            
                                <img
                                    src = {OPINION}
                                />
                                <div className = "Small-News">
                                    <div className = "Secondary-News-Headline">
                                        <Link to = "#"> Wankjob Wednesday </Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>


    {/** 
     * 
     * 
     * 
    */}
                

                <Link to = "/Media-Segment-Page" className = "Category" id = "Category-Outside"> MEDIA SEGMENTS </Link>     

                    <div className = "Small-News-Box">
                        <div className = "Small-News-Boxes"> 

                            <div className = "Small-Photo-News">                            
                                <img
                                    src = {JUSTIN}
                                />
                                <div className = "Small-News">
                                    <div className = "Secondary-News-Headline">
                                        <Link to = "#"> Makata Mondays: The Hunchback of Calle Juan Luna</Link>
                                    </div>
                                </div>
                            </div>

                            <div className = "Small-Photo-News">                            
                                <img
                                    src = {Photo2}
                                />
                                <div className = "Small-News">
                                    <div className = "Secondary-News-Headline">
                                        <Link to = "#"> Tek Tuesday: The price of compounded lies </Link>
                                    </div>
                                </div>
                            </div>

                            <div className = "Small-Photo-News">                            
                                <img
                                    src = {OPINION}
                                />
                                <div className = "Small-News">
                                    <div className = "Secondary-News-Headline">
                                        <Link to = "#"> Wankjob Wednesday </Link>
                                    </div>
                                </div>
                            </div>

                            <div className = "Small-Photo-News">                            
                                <img
                                    src = {OPINION}
                                />
                                <div className = "Small-News">
                                    <div className = "Secondary-News-Headline">
                                        <Link to = "#"> Wankjob Wednesday </Link>
                                    </div>
                                </div>
                            </div>

                            <div className = "Small-Photo-News">                            
                                <img
                                    src = {OPINION}
                                />
                                <div className = "Small-News">
                                    <div className = "Secondary-News-Headline">
                                        <Link to = "#"> Wankjob Wednesday </Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
        </div>
    )
}

export default SecondFacade;
