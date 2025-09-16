import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import TPAWhite from "../assets/Miniature_Icon_Version/TPA-Blue.svg";
import TPACircleLogo from "../assets/Miniature_Icon_Version/TPACircleLogo.svg";

import "../CSS/Navbar.css"

const NavbarComponent = ({refs}) => {

        const handleReload = () => {
                window.location.reload();
        };
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

                    <Link to = "/">
                        <img  id = "tpa-logo"
                            src = {TPAWhite} 
                            alt = "The Philippine Artisan Logo" 
                        />       
                    </Link>
                </div>

                <div className="navbar-links">
                    <a href = "/" > Home </a>
                    <a onClick = {() => handleScroll(refs.newsRef)}> News </a>
                    <a onClick = {() => handleScroll(refs.releasesRef)}> Releases </a>
                    <Link to = "/Media-Segment-Page"> Media Segments</Link>
                    <a onClick = "#" > About </a>
                </div>

                    <div className = "tpa-circle-logo">
                        <img
                            src = {TPACircleLogo}
                        />
                    </div>
            </div>
        )
}

export default NavbarComponent;