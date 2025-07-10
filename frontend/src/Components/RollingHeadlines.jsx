import TPALogoBlack from "../assets/Miniature_Icon_Version/TPALogoBlack.svg"

import "../CSS/RollingHeadlines.css"

const RollingHeadlines = () => {
    return(
        <div className = "RollingHeadline">
            <div className = "Rolling-Headline"> {/** JUST TO BE APT, MAXIMUM 5 LATEST HEADLINES */}
                <a href = "#" > JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </a>
                <img src = {TPALogoBlack}/>
                <a href = "#" > JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </a>
                <img src = {TPALogoBlack}/>
                <a href = "#" > JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </a>
                <img src = {TPALogoBlack}/>
                <a href = "#" > JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </a>
                <img src = {TPALogoBlack}/>

            </div>
        </div>
    )
}

export default RollingHeadlines;