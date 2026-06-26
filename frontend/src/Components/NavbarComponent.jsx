import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import TPAWhite from "../assets/Miniature_Icon_Version/TPA-Blue.png";
import TPACircleLogo from "../assets/Miniature_Icon_Version/TPACircleLogo.png";

import "../CSS/Navbar.css"

const NavbarComponent = () => {

    const location = useLocation();

    useEffect(() => {
        let lastScrollTop = 0;
        const navbar = document.querySelector('.navbar-box');

        const onScroll = () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScroll > lastScrollTop) {
                navbar?.classList.add('hidden');
            } else {
                navbar?.classList.remove('hidden');
            }

            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        };

        window.addEventListener('scroll', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    const smoothScrollTo= (targetY, duration = 800) => {
        const startY = window.scrollY
        const difference = targetY - startY
        let startTime = null

        const step = (timestamp) => {
            if(!startTime)
                startTime = timestamp
            const progress = timestamp - startTime
            const percent = Math.min(progress / duration, 1)

            const ease = percent < 0.5 ? 2 * percent * percent : -1 + (4 - 2 * percent) * percent // how smooth imma blow my ish 

            window.scrollTo(0, startY + difference * ease)

            if(progress < duration){
                window.requestAnimationFrame(step)
            }
        }

        window.requestAnimationFrame(step)
    }


    const handleNavClick = (e, targetHash) => {
        if (location.pathname === "/") {
            e.preventDefault()

            const elementId = targetHash.substring(1)
            const element = document.getElementById(elementId)
            if (element) {
                const elementPosition = element.getBoundingClientRect().top + window.scrollY
                
                const offsetPosition = elementPosition
                
                smoothScrollTo(offsetPosition, 800)
                window.history.pushState(null, "", targetHash)
            }
        }
    }

    return (
        <div className="navbar-container">
            <div className="navbar-box">
                <div className="tpa-logo">
                    <Link to="/#home" onClick={(e) => handleNavClick(e, "#home")}>
                        <img
                            loading="lazy"
                            id="tpa-logo"
                            src={TPAWhite}
                            alt="The Philippine Artisan Logo"
                        />
                    </Link>
                </div>

                <div className="navbar-links">
                    <Link to = "/#home" onClick={(e) => handleNavClick(e, "#home")}> Home </Link>
                    <Link to = "/#news" onClick={(e) => handleNavClick(e, "#news")}> News </Link> 
                    <Link to = "/releases"> Releases </Link>
                    <Link to = "/media-segment"> Media Segments </Link>
                </div>

                <Link to = "/about" className = "tpa-circle-logo">
                    <img
                        src = {TPACircleLogo}
                        alt = "About The Philippine Artisan"
                        style = {{left: "10%"}}
                    />
                </Link>
            </div>
        </div>
    )
}

export default NavbarComponent;