import TPAWTurno from "/TPA-LEFT_BLUE.png"
// import KALYO from 
// import PHILARTS from 
// import BROADSHEET from 
// import NEWSLETTER from 
// import DUHFIILIPITARTIHAN
// import SPORTS

import PreviousSlide from "../assets/Miniature_Icon_Version/Previous.svg"
import NextSlide from "../assets/Miniature_Icon_Version/Next.svg"

import "../CSS/AboutPage.css"

const AboutPage = () => {
    const slides = [
        {
            id: 1,
            src: TPAWTurno,
            li1: "The Philippine Artisan is the official student publication of the Technological University of the Philippines and has served the TUPian community since 1944.",
            li2: "The student publication is a member of the College Editors Guild of the Philippines",
            li3: "Our activities, funding, and readership is ascribed in Republic Act No. 7079 or the Campus Journalism Act of 1991."
        },
        {
            id: 2,
            // src: ArtisanCreed,
            li1: "",

        }
    ]

    return(
        <div className = "About-Page">
            <div className = "First-Part">
                <div className="Slide-Navigation">
                    <img 
                        src = {PreviousSlide}
                        alt = "Previous"
                        // onClick = {handlePrev}
                    />
                </div>
                
                <img src = {TPAWTurno} id = "TPAWTurno" />

                <div className = "First-Part-Text">
                    <ul>
                        <li> The Philippine Artisan is the official student publication of the Technological University of the Philippines and has been serving the TUPian community since 1944. </li>
                        <li> The student publication is a member of the College Editors Guild of the Philippines </li>    
                        <li>  The Constitution and By-Laws of The Philippine Artisan necessitates a </li>
                        <li> Our activities, funding, and mandate is ascribed in Republic Act No. 7079 or the Campus Journalism Act of 1991. </li>
                    </ul>
                </div>

                <div className = "Slide-Navigation">

                    <img 
                        src = {NextSlide}
                        alt = "Next"
                        // onClick = {handleNext}
                    />
                    
                </div>
            </div>

            <div className = "Releases-Part">
                <img 
                    // KALYO
                />
                <img 
                    // PhilArts
                />
                <img 
                    // Broadsheet
                />
                <img 
                    // Newsletter
                />
                <img 
                    // Duh Filipit Artihan
                />
                <img 
                    // Sports
                />


            </div>

            <div className = "Maybe-a-parallax-effect">
                <div>
                    MEET TEK!
                    probably all the teks with their names 
                </div>
            </div>
        </div>
    )
}

export default AboutPage;