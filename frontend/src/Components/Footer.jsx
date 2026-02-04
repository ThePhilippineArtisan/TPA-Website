import TPALOGO from "/TPA-LEFT_BLUE.png";
import FBLogo from "../assets/Miniature_Icon_Version/FBLogo.svg"
import XLogo from "../assets/Miniature_Icon_Version/XLogo.svg"
import IGLogo from "../assets/Miniature_Icon_Version/IGLogo.svg"
import YTLogo from "../assets/Miniature_Icon_Version/YTLogo.svg"
import TTLogo from "../assets/Miniature_Icon_Version/TTLogo.svg"

import "../CSS/Footer.css";

const Footer = () => {
    return(
        <div className = "Footer">
            <div className = "Top-Footer">
                <div className = "Left-Footer">

                    <p> 
                    The 81-year old official student publication of 
                    <br></br>
                    Technological University of the Philippines Manila. 
                    <br></br>                 <br></br>                 
                    Serving the academe and the country since 1944.
                    </p>

                    
                </div>
                    
                    <img
                        id = "TPA-Full-Logo"  
                        loading = "lazy"
                        src = {TPALOGO}
                    />
                    
                <div className = "Right-Footer">
                    <p> Follow our social media profiles! </p>
                    <div className = "Right-Footer-Links">
                        {/* arrow function () => "_blank" opens link on another tab */ }
                        <img  loading = "lazy" 
                            src = {FBLogo}
                            onClick = {() => window.open("https://www.facebook.com/PhilArtisanMNL", "_blank")}
                        /> 
                        <img  loading = "lazy" 
                            src = {XLogo}
                            onClick = {() => window.open("https://www.x.com/PhilArtisanMNL", "_blank")}
                        />
                        <img  loading = "lazy" 
                            src = {IGLogo}
                            onClick = {() => window.open("https://www.instagram.com/PhilArtisanMNL", "_blank")}
                        /> 
                        <img  loading = "lazy" 
                            src = {YTLogo}
                            onClick = {() => window.open("https://www.youtube.com/@tek_artisanmnl", "_blank")}
                        /> 
                        <img  loading = "lazy" 
                            src = {TTLogo}
                            onClick = {() => window.open("https://www.tiktok.com/@tek_artisanmnl", "_blank")}
                        /> 
                    </div>
                </div>
            </div>
            <div className="Bottom-Footer">
                <div className="Bottom-Footer-Text">
                    <p> Meet our staff:</p>
                    <p style={{textDecoration: "underline"}}>Editorial Board</p>
                    <p style={{textDecoration: "underline"}}>Senior Staffers</p>
                    <p style={{textDecoration: "underline"}}>Junior Staffers</p>
                </div>

                <p> © 2026 The Philippine Artisan Manila. All Rights Reserved. </p>
            </div>
        </div>
    )
}

export default Footer;