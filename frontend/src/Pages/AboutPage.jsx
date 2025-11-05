import React, {useState, useRef} from "react"

import TPAWTurno from "/TPA-LEFT_BLUE.png"
import TPACircleLogo from "../assets/Miniature_Icon_Version/TPACircleLogo.svg";

// import KALYO from 
// import PHILARTS from 
// import BROADSHEET from 
// import NEWSLETTER from 
import LAMPOON from "../TPA-Releases/2025-Lampoon/2025-Lampoon_Duh-Filipit-Artihan/2025-Lampoon_Duh-Filipit-Artihan-1.png"
// import SPORTS

import PreviousSlide from "../assets/Miniature_Icon_Version/Previous.svg"
import NextSlide from "../assets/Miniature_Icon_Version/Next.svg"

import "../CSS/AboutPage.css"

const AboutPage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState("next")

    const slideRef = useRef(null);

    const slides = [
        {
            id: 1,
            src: TPAWTurno,
            topText: "THE PHILIPPINE ARTISAN",
            li1: "The Philippine Artisan is the official student publication of the Technological University of the Philippines and has served the TUPian community since 1944.",
            li2: "The student publication is a member of the College Editors Guild of the Philippines",
            li3: "Our activities, funding, and readership is ascribed in Republic Act No. 7079 or the Campus Journalism Act of 1991."
        },
        {
            id: 2,
            src: TPAWTurno,
            topText: "PREAMBLE",
            li1: "We, the Artisans, imploring the aid of the Eternal Father, in order to build a just publication which shall contribute to the development of the journalistic skills of the students of Technological University of the Philippines Manila, to uphold justice, to promote freedom of expression, to expose the truth accurately and without ambiguity, to immortalize the importance of campus journalism and to develop an atmosphere of brotherhood, unity, workmanship, honesty, and patience, do ordain and promulgate this Constitution",

        },
        {
            id: 3,
            src: TPAWTurno,
            topText: "The Artisan's Creed",
            li1: "I, chosen among the many who were called to join The Philippine Artisan – Manila, do hereby pledge to conscientiously fulfill my tasks and obligations, abide in all the rules and regulations of the publication, fight for its constitution, strongly fight against corruption, immortalize truth, justice and freedom of expression, and serve the Technological University of the Philippines System as a student journalist."
        },
        {
            id: 4,
            src: TPACircleLogo,
            topText: "The Artisan's Clutch",
            li1: "The Artisan's Clutch represent the duty of the publication to deliver reliable information to the students without fear and become the voice of the oppressed masses"
        },
        {
            id: 5,
            src: TPACircleLogo, 
            topText: "Symbolism of the Clutch",
            li1: "The COLOR BLUE symbolizes the wisdom, peace, and truth",
            li2: "The LEFT FIST symbolizes the publication's ability to inform and educate TUP students through responsible journalism.",
            li3: "The QUILL symbolizes the publication's ability to inform and educate TUP students through responsible journalism."
        },
        {
            id: 6,
            src: TPAWTurno, // Map
            topText: "WHERE WE'RE LOCATED",
            li1: "The Philippine Artisan Manila's headquarters is located at the Ground Floor, College of Liberal Arts - College of Science building at the Technological University of the Philippines Main Campus, Ayala Boulevard, Ermita, Manila."
        }
    ]

    const handleSlideChange = (dir) => {
        setDirection(dir)

        setActiveIndex((i) =>
        dir === "next"
            ? (i + 1) % slides.length // if dir is next, move on
            : (i - 1 + slides.length) % slides.length // if dir is prev, move back
        )
    }

    const handleNext = () => handleSlideChange("next")
    const handlePrev = () => handleSlideChange("prev")

    const currentSlide = slides[activeIndex]

    return(
        <div className = "About-Page">
            <div className = {`First-Part SlideWrapper ${direction}`} ref = {slideRef}>
                <div className="Slide-Navigation">
                    <img 
                        src = {PreviousSlide}
                        alt = "Previous"
                        onClick = {handlePrev}
                    />
                </div>
                <div className = "Slide-Image">
                    <img src = {currentSlide.src} id = "TPAWTurno" />
                </div>
                <div className = "First-Part-Text">
                    <h1> {currentSlide.topText} </h1>
                    <ul>
                        {currentSlide.li1 && <li>{currentSlide.li1}</li>}
                        {currentSlide.li2 && <li>{currentSlide.li2}</li>}
                        {currentSlide.li3 && <li>{currentSlide.li3}</li>}
                    </ul>
                </div>

                <div className = "Slide-Navigation">

                    <img 
                        src = {NextSlide}
                        alt = "Next"
                        onClick = {handleNext}
                    />
                    
                </div>
            </div>

            <div className = "Releases-Part">
                <h1> OUR RELEASES </h1>
                <div className = "Releases-Part-Covers">
                    <div className = "Covers">
                        <img 
                            src = {LAMPOON}
                        />

                        KALYO: KAMATAYAN {('24-25')}
                    </div>
                    <div className = "Covers">
                        <img 
                            src = {LAMPOON}
                        />

                        PHILARTS
                    </div>
                    <div className = "Covers">
                        <img 
                            src = {LAMPOON}
                        />

                        BROADSHEET
                    </div>

                    <div className = "Covers">
                        <img 
                            src = {LAMPOON}
                        />
                        
                        NEWSLETTER
                    </div>

                    <div className = "Releases-Part-Covers">

                        <div className = "Covers">
                            <img 
                                src = {LAMPOON}
                            />

                            LAMPOON
                        </div>
                        <div className = "Covers">
                            <img 
                                src = {LAMPOON}
                            />

                            SPORTS
                        </div>
                    </div>
                </div>
            
            </div>

            <div className = "Meet-Our-Editors First-Part-Text">
                <h1> MEET OUR EDITORIAL BOARD </h1>

                <div className = "Editors">
                    <div className = "Editorial-Board">
                        <div className = "Editorial-Board-Individual">
                            <img src = {LAMPOON} />
                        </div>

                        <div className = "Editorial-Board-Individual">
                            <img src = {LAMPOON} />
                        </div>

                        <div className = "Editorial-Board-Individual">
                            <img src = {LAMPOON} />
                        </div>
                        
                        <div className = "Editorial-Board-Individual">
                            <img src = {LAMPOON} />
                        </div>

                        <div className = "Editorial-Board-Individual">
                            <img src = {LAMPOON} />
                        </div>

                        <div className = "Editorial-Board-Individual">
                            <img src = {LAMPOON} />
                        </div>

                        <div className = "Editorial-Board-Individual">
                            <img src = {LAMPOON} />
                        </div>

                    </div>
                </div>
            </div>

            <div className = "Maybe-a-parallax-effect">
                <div>
                    MEET TEK!
                    probably all the teks with their names 
                </div>
            </div>

            <div className = "First-Part" style = {{height: "auto"}}>
                <div className = "First-Part-Text" id = "Last-Part">
                    
                    <h1> VISION AND MISSION </h1>
                    <ul>
                        <li></li> 
                        <li> VISION. To be a student publication that celebrates responsible freedom of expression. The organization envisions itself to be the center of journalism in the TUP community that serves with dignity, integrity and sincerity to be responsible for a standard of excellence.</li>
                        <li></li>
                        <li> MISSION. To inspire, motivate, and involve every student in the TUP community to create a medium of open communication with the student and the administration in light of true service, transparency, and freedom of expression. </li>
                        <li></li>
                    </ul>
                    <h1> BASIC PRINCIPLES AND OBJECTIVES </h1>
                    <ul>
                        <li></li> 
                        <li> TPA shall serve as an independent publication of the students. Its primary concern is to inform, to educate, and to give opinions about local, sectoral, and national events that are of concern and would benefit the interests of the students. </li>
                        <li></li> 
                        <li> TPA shall exercise the freedom of the press as stipulated in the 1987 Philippine Constitution, Article 3- Bill of Rights, Section 4, and pursue the corresponding obligations as guaranteed and provided by the Republic Act 7079 otherwise known as The Campus Journalism Act of 1991, and university policies. </li>
                        <li></li> 
                        <li> TPA shall publish at least two (2) issues (Kalyo: Literary, Duh Filipit Artihan: Lampoon, Broadsheet, Newsletter, PhilArts: Feature, Sports) per academic year in line with community and campus engagement advocacies and agenda in the contemporary. </li>
                        <li></li>
                        <li> TPA shall not deprive the right of any person, group, or institution to publish their positions or commentaries regarding the articles published in the said paper in conformity with the printing policies of the Editorial Board. </li>
                        <li></li>
                        <li> The releases of TPA shall be governed by these policies and principles and such by regulations as may be promulgated by the Editorial Board in accordance with the laws of the Republic and the objectives of the University. </li>
                        <li></li>

                    </ul>

                </div>
            </div>
        </div>
    )
}

export default AboutPage;