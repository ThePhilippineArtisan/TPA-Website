import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import TPAWhite from "../assets/Miniature_Icon_Version/TPA-White.png";
import TPACircleLogo from "../assets/Miniature_Icon_Version/TPACircleLogo.png";

import "../CSS/Navbar.css"

const NavbarComponent = ({refs}) => {
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

        const location = useLocation();
        const navigate = useNavigate();
        
        const handleScroll = (ref) => {
            if (location.pathname === "/") {
                ref.current.scrollIntoView({behavior: "smooth"});
            } else {
                navigate("/");
                setTimeout(() => {
                    ref.current.scrollIntoView({behavior: "smooth"});
                });}
            };

        return(
            
            <div className = "navbar-box">
                <div className = "tpa-logo">

                    <img  id = "tpa-logo"
                        src = {TPAWhite} 
                        alt = "The Philippine Artisan Logo" 
                        onClick = {handleReload}          
                        // className = {`logo ${loading ? 'spinning' : ''}`} // If loading = true, use class called Spinning seen in Navbar.css
                    />       

                </div>

                <div className="navbar-links">
                    <a onClick = {handleReload}> Home </a>
                    <a onClick = {() => handleScroll(refs.releasesRef)}> Releases </a>
                    <a onClick = {() => handleScroll(refs.mediaRef)}> Media Segments</a>
                    <a onClick = {() => handleScroll(refs.newsRef)}> Latest News </a>


                </div>

                    <div className = "tpa-circle-logo">
                        <img
                            src = {TPACircleLogo}
                            onClick = {toggleSidebar} 
                            /** Calls function sidebar and 
                            * toggle negating negation ("!") **/
                        />
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