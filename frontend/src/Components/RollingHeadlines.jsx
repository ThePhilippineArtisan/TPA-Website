import TPALogoBlack from "../assets/Miniature_Icon_Version/TPALogoBlack.svg"

import "../CSS/RollingHeadlines.css"

const RollingHeadlines = () => {
    return(

        
        <div className = "Rolling-Headline"> {/** JUST TO BE APT, MAXIMUM 5 LATEST HEADLINES  */}

            <marquee behavior="scroll" direction="left" scrollamount="5">
                <img src = {TPALogoBlack}/>
                <a href = "#" > JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </a>
                <img src = {TPALogoBlack}/>

                <a href = "#" > JUST IN: BIEBER! ESTUDYANTENG TAKBO NANG TAKBO, NADAPA SA PWD RAMP-NAPILAY! </a>
                <img src = {TPALogoBlack}/>

                <a href = "#" > JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </a>
                <img src = {TPALogoBlack}/>

                <a href = "#" > JUST IN: BIEBER! ESTUDYANTENG TAKBO NANG TAKBO, NADAPA SA PWD RAMP-NAPILAY! </a>
                <img src = {TPALogoBlack}/>

                <a href = "#" > JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </a>
                <img src = {TPALogoBlack}/>

                <a href = "#" > JUST IN: BIEBER! ESTUDYANTENG TAKBO NANG TAKBO, NADAPA SA PWD RAMP-NAPILAY! </a>
                <img src = {TPALogoBlack}/>

                <a href = "#" > JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </a>
                <img src = {TPALogoBlack}/>

                <a href = "#" > JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </a>
                <img src = {TPALogoBlack}/>

                <a href = "#" > JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </a>
                <img src = {TPALogoBlack}/>
            </marquee>

        </div>
    )
}

export default RollingHeadlines;