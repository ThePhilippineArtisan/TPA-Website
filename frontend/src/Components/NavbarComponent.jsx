import {useState } from "react";

import TPAWhite from "../assets/Miniature_Icon_Version/TPA-White.png";
import TPACircleLogo from "../assets/Miniature_Icon_Version/TPACircleLogo.png";

import "../CSS/Navbar.css"

const NavbarComponent = () => {
    // Functionalities
        
        // States
        //    const [loading, setLoading] = useState(false);

        // Full window reload

        const handleReload = () => {
        //    setLoading(true);

        //    setTimeout(() => {
                window.location.reload();
        //    }, 2000);
        };

        const [sidebarOpen, setSidebarOpen] = useState(false);


        const toggleSidebar = () => {
            setSidebarOpen(!sidebarOpen);
        }

        const sidebarClass = sidebarOpen ? "sidebar open" : "sidebar";

        return(
            
            <div className = "navbar-box">
                <div className = "tpa-logo" id = "tpa-logo">

                    <img 
                        src = {TPAWhite} 
                        alt = "The Philippine Artisan Logo" 
                        onClick = {handleReload}          
                        // className = {`logo ${loading ? 'spinning' : ''}`} // If loading = true, use class called Spinning seen in Navbar.css
                    />       

                </div>

                <div className="navbar-links">
                    <a href = "#"> Home </a>
                    <a href = "#"> Releases </a>
                    <a href = "#"> Media Segments</a>
                    <a href = "#"> Latest News </a>

                    <div className = "tpa-circle-logo">
                        <img
                            src = {TPACircleLogo}
                            onClick = {toggleSidebar} 
                            /** Calls function sidebar and 
                            * toggle negating negation ("!") **/
                        />
                    </div>
                </div>
            {/* SIDE BAR PART When the TPACircleLogo is clicked 
                    <button
                        onClick = {toggleSidebar}>
                    </button>

                    
                <div className = {sidebarClass}>



                </div>

            */}

            </div>
        )
}

export default NavbarComponent;