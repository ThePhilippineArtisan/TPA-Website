import { Link } from "react-router-dom";

import Photo1 from "../Sample-Photos/GAD-Kapihan.jpg"
import Photo2 from "../Sample-Photos/Multification-Invication.jpg"
import JUSTIN from "../Sample-Photos/JUST-IN.jpg"
import OPINION from "../Sample-Photos/OPINION.jpg"
import VIDEO from "../Sample-Photos/CA240830_172531.mp4"

import TPALogoBlack from "../assets/Miniature_Icon_Version/TPALogoBlack.svg"
import SearchIcon from "../assets/Miniature_Icon_Version/TPA-Blue.svg"


import "../CSS/SecondFacade.css"

const SecondFacade = () => {

    return(
        <div className = "Second-Facade">
            <div className = "Rolling-Headline"> {/** JUST TO BE APT, MAXIMUM 5 LATEST HEADLINES  */}
                <marquee behavior = "scroll" direction = "left" scrollamount = "5">
                    <img  loading = "lazy"  src = {TPALogoBlack}/>
                    <Link to = "/Joseph-Brian-Balut"> JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </Link>
                    <img  loading = "lazy"  src = {TPALogoBlack}/>

                </marquee>
            </div>

            <div className = "Cover-Photo-Image-Facade" loading = "lazy">
                <input type = "text" className = "SearchBar" placeholder = "Turno en contra." />
            </div>

        <div className = "Tabs">
            <Link to = "#"> Latest </Link>
            <Link to = "#"> Opinion </Link>
            <Link to = "#"> Editorial </Link>
            <Link to = "#" title = "Poetry, Prose, Pretention Galore! Ang Makata Monday ay ang pang-Literaryong Media Segment ng TPA"> Makata Monday </Link>
            <Link to = "#" title = "Our Teks dive into the world of technology!"> Tek Tuesday </Link>
            <Link to = "#" title = "Editorial Cartoonist and Wankers Wanking for attention"> Wankjob Wednesday </Link>
            <Link to = "#" title = "Filipino por Indio words of the Day!"> Tala Thursday </Link>
            <Link to = "#" title = "Professional Yappers Yapping About Yap"> Features Friday </Link>
            <Link to = "#" title = "Professional Yappers Yapping About Yap"> Streaming Saturday </Link>
            <Link to = "#" title = "May Athletes pa pala tayo bukod kina Pacquiao, Yulo, Eala, at Diaz?"> Sports Sunday </Link>
        </div>

        <div className = "Below-Cover-Photo">   
            <div className = "letterA">
                <div className = "Large-News-Boxes">
                <div className = "Large-Left-News-Column">
                    <Link to = "#" className = "Category" > LATEST ———{`>`}</Link>  
                    <div className = "Large-Photo-News" onClick = "#" style = {{flexWrap: "wrap"}}> 

                        <img  loading = "lazy" 
                            // style = {{ marginBottom: "1.5rem", width: "85rem",}} style = {{ flexWrap: "wrap", justifyContent: "center"}}
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
                        
                        <div className = "Large-Photo-News" onClick = "#"> 

                        <img  loading = "lazy"  style = {{height: "20rem", aspectRatio: "16 / 9"}}
                            // style = {{ marginBottom: "1.5rem", width: "85rem",}} style = {{ flexWrap: "wrap", justifyContent: "center"}}
                            src = {Photo2}
                        />

                        <div className = "Large-News" >
       <hr></hr>
 
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
                    </div>
                </div>

                </div>

                <div className = "Vertical-Headlines">
                    <Link to = "/"> FAST NEWS ———{`>`}<hr></hr> </Link>
                    <div className = "Vertical-Side-News">       
                            <img  loading = "lazy" 
                                src = {JUSTIN}
                            />                     
                        <div className = "Secondary-News-Headline">
                            <Link to = "/Joseph-Brian-Balut"> NATIONAL NEWS: Ferdinand Marcos Jr. Declares National Martial Law amid isolated unrest to be led by Torre </Link>
                        </div>
                    </div>

                    <div className = "Vertical-Side-News">       
                            <img  loading = "lazy" 
                                src = {JUSTIN}
                            />                     
                        <div className = "Secondary-News-Headline">
                            <Link to = "/Joseph-Brian-Balut"> NATIONAL NEWS: Ferdinand Marcos Jr. Declares National Martial Law amid isolated unrest to be led by Torre </Link>
                        </div>
                    </div>

                    <div className = "Vertical-Side-News">       
                            <img  loading = "lazy" 
                                src = {JUSTIN}
                            />                     
                        <div className = "Secondary-News-Headline">
                            <Link to = "/Joseph-Brian-Balut"> JUST IN: Ferdinand Marcos Jr. Signs Means to Pre-Emptive Declaration of State of Disaster</Link>
                        </div>
                    </div>

                    <div className = "Vertical-Side-News">       
                            <img  loading = "lazy" 
                                src = {JUSTIN}
                            />                     
                        <div className = "Secondary-News-Headline">
                            <Link to = "/Joseph-Brian-Balut"> ICYMI: Protesters cross Pasig River resemble River Styx for Marcos Admin through Ayala Bridge</Link>
                        </div>
                    </div>

                    <Link to = "/"> BULLETIN BOARD <hr></hr> </Link>

                    <div className = "Bulletin-Board">
                                <hr></hr>
                        <p> Dear Reader, if you're reading this - I am dead or sleeping. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, architecto. lorem20</p>
                    </div>

                    <div className = "Bulletin-Board">
                                <hr></hr>
                        <p> Dear Reader, if you're reading this - I am dead or sleeping. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, architecto. lorem20</p>
                    </div>

                    <div className = "Bulletin-Board">
                                <hr></hr>
                        <p> Dear Reader, if you're reading this - I am dead or sleeping. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, architecto. lorem20</p>
                    </div>

                    <div className = "Bulletin-Board">
                                <hr></hr>
                        <p> Dear Reader, if you're reading this - I am dead or sleeping. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, architecto. lorem20</p>
                    </div>

                </div>

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

                                <div className = "Vertical-Side-News">
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


        <div className = "Video-Showcase">
            <Link to = "#"> TEK'S VIDEOS ———{`>`} </Link>
            
            <div className = "Iframe-Container" id = "iframes">
                <div className = "Iframe-Videos">
                    <iframe 
                        src="https://www.youtube.com/embed/_gMtQVJwzBA?si=7JdevQ6D32JZKgiL" 
                        title="YouTube video player" frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerpolicy="strict-origin-when-cross-origin" 
                        allowfullscreen>
                    </iframe>

                    <iframe 
                        src = "https://www.youtube.com/embed/wZh6KP2qgKc?si=5KLeDg_K-agffYq_" 
                        title = "Youtube video player" frameborder = "0" 
                        allow = 
                        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerpolicy = "strict-origin-when-cross-origin" 
                        allowfullscreen>
                    </iframe>

                    <iframe 
                        src = "https://www.youtube.com/embed/z5_hpf3Ix7g?si=xQss33snI2jyVPhP" 
                        title = "Gawad Tek R Tisan 2024-2025" frameborder = "0" 
                        allow = 
                        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerpolicy = "strict-origin-when-cross-origin" 
                        allowfullscreen>
                    </iframe>

                    <iframe 
                        src = "https://www.youtube.com/embed/7Aoe2kCeygQ?si=Js5KPY5xAziuHPTq" 
                        title = "Gawad Tek R Tisan 2024-2025" frameborder = "0" 
                        allow = 
                        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerpolicy = "strict-origin-when-cross-origin" 
                        allowfullscreen>
                    </iframe>

                    </div>                
            </div>
        </div>
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

                <div className = "Horizontal-Headlines">
                    {
                        // <Link to = "/Media-Segment/Page"> READ MORE <hr></hr> </Link> //
                    }

                    <div className = "Vertical-Side-News" id = "MM">       
                            <img  loading = "lazy" 
                                src = {JUSTIN}
                            />                     
                        <div className = "Secondary-News-Headline">
                            <Link to = "/Joseph-Brian-Balut"> Makata Mondays </Link>
                        </div>
                    </div>

                    <div className = "Vertical-Side-News" id = "TTu">       
                            <img  loading = "lazy" 
                                src = {JUSTIN}
                            />                     
                        <div className = "Secondary-News-Headline">
                            <Link to = "/Joseph-Brian-Balut"> Tek Tuesdays</Link>
                        </div>
                    </div>

                    <div className = "Vertical-Side-News"  id = "WW">       
                            <img  loading = "lazy" 
                                src = {JUSTIN}
                            />                     
                        <div className = "Secondary-News-Headline">
                            <Link to = "/Joseph-Brian-Balut"> Wankjob Wednesdays</Link>
                        </div>
                    </div>

                    <div className = "Vertical-Side-News"  id = "TTh">       
                            <img  loading = "lazy" 
                                src = {JUSTIN}
                            />                     
                        <div className = "Secondary-News-Headline">
                            <Link to = "/Joseph-Brian-Balut"> Tala Thursdays</Link>
                        </div>
                    </div>

                    <div className = "Vertical-Side-News"  id = "FF">       
                            <img  loading = "lazy" 
                                src = {JUSTIN}
                            />                     
                        <div className = "Secondary-News-Headline">
                            <Link to = "/Joseph-Brian-Balut"> Features Friday</Link>
                        </div>
                    </div>

                    <div className = "Vertical-Side-News"  id = "StS">       
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

{/** 

            <Link to = "#" className = "Category"> LATEST </Link>     
                <div className = "Large-News-Boxes">

                    <div className = "Large-Photo-News" onClick = "#">
                            
                        <img  loading = "lazy" 
                            src = {Photo1}
                        />

                        <div className = "Large-News">
                            <div className = "Large-News-Headline">
                                <Link to = "/Joseph-Brian-Balut"> LOOK: TUP Manila concludes 120th commencement exercises with graduates from CLA, COS, and graduate programs </Link>

                                <div className = "Article-Author-Time">
                                    <span> Cathlene Torrenueva • 3 days ago </span>   
                                </div>
                            </div>
                        </div>
                    </div>                                        
                </div>


            <div className = "Column">
                <div className = "Row">
                    <div className = "Small-Photo-News">                            
        
                        <img  loading = "lazy" 
                            src = {JUSTIN}
                        />
        
                        <div className = "Small-News">
                            <div className = "Secondary-News-Headline">
                                <Link to = "/Joseph-Brian-Balut"> Makata Mondays: The Hunchback of Calle Juan Luna</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className = "Column">
                <div className = "Row">
                    <div className = "Small-Photo-News">                            
        
                        <img  loading = "lazy" 
                            src = {JUSTIN}
                        />
        
                        <div className = "Small-News">
                            <div className = "Secondary-News-Headline">
                                <Link to = "/Joseph-Brian-Balut"> Makata Mondays: The Hunchback of Calle Juan Luna</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className = "Column">
                <div className = "Row">
                    <div className = "Small-Photo-News">                            
        
                        <img  loading = "lazy" 
                            src = {JUSTIN}
                        />
        
                        <div className = "Small-News">
                            <div className = "Secondary-News-Headline">
                                <Link to = "/Joseph-Brian-Balut"> Makata Mondays: The Hunchback of Calle Juan Luna</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

    <a id = "MM" title = "Poetry, Prose, Pretention Galore! Ang Makata Monday ay ang pang-Literaryong Media Segment ng TPA"> Makata Monday </Link>
    <a id = "TTu" title = "Our Teks dive into the world of technology!"> Tek Tuesday </Link>
    <a id = "WW" title = "Editorial Cartoonist and Wankers Wanking for attention"> Wankjob Wednesday </Link>
    <a id = "TTh"  title = "Filipino por Indio words of the Day!" > Tala Thursday </Link>
    <a id = "FF"  title = "Professional Yappers Yapping About Yap"> Features Friday </Link>
    <a id = "StS" title = "Professional Yappers Yapping About Yap"> Streaming Saturday </Link>
    <a id = "SpS" title = "May Athletes pa pala tayo bukod kina Pacquiao, Yulo, Eala, at Diaz?"> Sports Sunday</Link>

                            <div className = "Small-Photo-News">                            
                                <img  loading = "lazy" 
                                    src = {Photo2}
                                />
                                <div className = "Small-News">
                                    <div className = "Secondary-News-Headline">
                                        <Link to = "#"> Tek Tuesday: The price of compounded lies </Link>
                                    </div>
                                </div>
                            </div>

                            <div className = "Small-Photo-News">                            
                                <img  loading = "lazy" 
                                    src = {OPINION}
                                />
                                <div className = "Small-News">
                                    <div className = "Secondary-News-Headline">
                                        <Link to = "#"> Wankjob Wednesday </Link>
                                    </div>
                                </div>
                            </div>

                            <div className = "Small-Photo-News">                            
                                <img  loading = "lazy" 
                                    src = {OPINION}
                                />
                                <div className = "Small-News">
                                    <div className = "Secondary-News-Headline">
                                        <Link to = "#"> Wankjob Wednesday </Link>
                                    </div>
                                </div>
                            </div>

                            <div className = "Small-Photo-News">                            
                                <img  loading = "lazy" 
                                    src = {OPINION}
                                />
                                <div className = "Small-News">
                                    <div className = "Secondary-News-Headline">
                                        <Link to = "#"> Wankjob Wednesday </Link>
                                    </div>
                                </div>
                            </div>

                            
                            <div className = "Small-Photo-News">                            
                                <img  loading = "lazy" 
                                    src = {Photo2}
                                />
                                <div className = "Small-News">
                                    <div className = "Secondary-News-Headline">
                                        <Link to = "#"> Tek Tuesday: The price of compounded lies </Link>
                                    </div>
                                </div>
                            </div>

                            <div className = "Small-Photo-News">                            
                                <img  loading = "lazy" 
                                    src = {OPINION}
                                />
                                <div className = "Small-News">
                                    <div className = "Secondary-News-Headline">
                                        <Link to = "#"> Wankjob Wednesday </Link>
                                    </div>
                                </div>
                            </div>

                            <div className = "Small-Photo-News">                            
                                <img  loading = "lazy" 
                                    src = {OPINION}
                                />
                                <div className = "Small-News">
                                    <div className = "Secondary-News-Headline">
                                        <Link to = "#"> Wankjob Wednesday </Link>
                                    </div>
                                </div>
                            </div>

                            <div className = "Small-Photo-News">                            
                                <img  loading = "lazy" 
                                    src = {OPINION}
                                />
                                <div className = "Small-News">
                                    <div className = "Secondary-News-Headline">
                                        <Link to = "#"> Wankjob Wednesday </Link>
                                    </div>
                                </div>
                            </div>
*/}

export default SecondFacade;
