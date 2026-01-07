import { Link } from "react-router-dom";

import TPALogoBlack from "../assets/Miniature_Icon_Version/TPALogoBlack.png"

import "../CSS/RollingHeadlines.css"

const RollingHeadlines = () => {
    return(
        <div className = "Rolling-Headline"> {/** JUST TO BE APT, MAXIMUM 5 LATEST HEADLINES  */}
            <marquee behavior="scroll" direction="left" scrollamount="3">
                <img src = {TPALogoBlack}/>
                    <Link to = "#" > JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </Link>
                <img src = {TPALogoBlack}/>
                    <Link to = "#" > WE ARE CHARLIE KIRK, WE CARRY THE FLAME - WE FIGHT FOR THE GOSPEL </Link>
                <img src = {TPALogoBlack}/>
                    <Link to = "#" > BAKIT YUNG MGA CATHOLIC UNIS PINAPAYAGAN MAG-CIVILIAN!??? </Link>
                <img src = {TPALogoBlack}/>
                    <Link to = "#" > SHARIA LAW IN NEW YORK: INSHALLAH IN THE FRONT PAGE </Link>
                <img src = {TPALogoBlack}/>
                    <Link to = "#" > HELP ME ACHIEVE 1K SUBSCRIBERS ON YOUTUBE @AVOIRJOSEPH </Link>
                <img src = {TPALogoBlack}/>
            </marquee>
        </div>
    )
}

export default RollingHeadlines;