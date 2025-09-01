import TPALOGO from "../assets/Miniature_Icon_Version/TPACircleLOGO.svg";
import FBLogo from "../assets/Miniature_Icon_Version/FBLogo.svg"
import XLogo from "../assets/Miniature_Icon_Version/XLogo.svg"
import IGLogo from "../assets/Miniature_Icon_Version/IGLogo.svg"
import YTLogo from "../assets/Miniature_Icon_Version/YTLogo.svg"
import TTLogo from "../assets/Miniature_Icon_Version/TTLogo.svg"

import "../CSS/Footer.css";

const Footer = () => {
    return(
        <div className = "Footer">
            <div className = "Left-Footer">
                <img 
                    src = {TPALOGO}
                />

                <p> 
                The 81-year old official student publication of 
                <br></br>
                Technological University of the Philippines Manila. 
                <br></br>                 <br></br>                 <br></br> 
                Serving the academe and the country since 1944.
                </p>
                
            </div>



            <div className = "Right-Footer">
                <p> Follow our social media profiles! </p>
                <div className = "Right-Footer-Links">
                    {/* arrow function () => "_blank" opens link on another tab */ }
                    <img 
                        src = {FBLogo}
                        onClick = {() => window.open("https://www.facebook.com/PhilArtisanMNL", "_blank")}
                    /> 
                    <img 
                        src = {XLogo}
                        onClick = {() => window.open("https://www.x.com/PhilArtisanMNL", "_blank")}
                    />
                    <img 
                        src = {IGLogo}
                        onClick = {() => window.open("https://www.instagram.com/PhilArtisanMNL", "_blank")}
                    /> 
                    <img 
                        src = {YTLogo}
                        onClick = {() => window.open("https://www.youtube.com/@tek_artisanmnl", "_blank")}
                    /> 
                    <img 
                        src = {TTLogo}
                        onClick = {() => window.open("https://www.tiktok.com/@tek_artisanmnl", "_blank")}
                    /> 
                </div>
            </div>
        </div>
    )
}

export default Footer;