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
                    <Link to = "#" > JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </Link>
                <img src = {TPALogoBlack}/>
                    <Link to = "#" > JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </Link>
                <img src = {TPALogoBlack}/>
                    <Link to = "#" > JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </Link>
                <img src = {TPALogoBlack}/>
                    <Link to = "#" > JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </Link>
                <img src = {TPALogoBlack}/>
                    <Link to = "#" > JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </Link>
                <img src = {TPALogoBlack}/>
                    <Link to = "#" > JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </Link>
                <img src = {TPALogoBlack}/>
                    <Link to = "#" > JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </Link>
                <img src = {TPALogoBlack}/>
                    <Link to = "#" > JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </Link>
                <img src = {TPALogoBlack}/>
                    <Link to = "#" > JUST IN: KALBO NG UNIBERSIDAD, NATULUAN NG IPOT SA BUMBUNAN </Link>
                <img src = {TPALogoBlack}/>
            </marquee>
        </div>
    )
}

export default RollingHeadlines;