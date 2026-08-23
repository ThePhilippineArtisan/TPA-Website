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

    const smoothScrollTo = (targetY, duration = 800) => {
        const startY = window.scrollY
        const difference = targetY - startY
        let startTime = null

        const step = (timestamp) => {
            if(!startTime)
                startTime = timestamp
            const progress = timestamp - startTime
            const percent = Math.min(progress / duration, 1)

            const ease = percent < 0.5 ? 2 * percent * percent : -1 + (4 - 2 * percent) * percent 

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

    const isHomeActive = location.pathname === "/" && (location.hash === "#home" || location.hash === "" || !location.hash);
    const isNewsActive = location.pathname === "/" && location.hash === "#news";
    const isReleasesActive = location.pathname.startsWith("/releases");
    const isMediaActive = location.pathname.startsWith("/media-segment");
    const isAboutActive = location.pathname.startsWith("/about");

    return (
        <>
            {/* Top Navigation Bar for Desktop / Laptop / Tablet */}
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
                        <Link to="/#home" onClick={(e) => handleNavClick(e, "#home")} className={isHomeActive ? "active" : ""}> Home </Link>
                        <Link to="/#news" onClick={(e) => handleNavClick(e, "#news")} className={isNewsActive ? "active" : ""}> News </Link> 
                        <Link to="/releases" className={isReleasesActive ? "active" : ""}> Releases </Link>
                        <Link to="/media-segment" className={isMediaActive ? "active" : ""}> Media Segments </Link>
                    </div>

                    <Link to="/about" className="tpa-circle-logo">
                        <img
                            src={TPACircleLogo}
                            alt="About The Philippine Artisan"
                            style={{left: "10%"}}
                        />
                    </Link>
                </div>
            </div>

            {/* Bottom Navigation Bar for Mobile Devices (PWA App Navigation) */}
            <nav className="bottom-navbar-container" aria-label="Mobile Bottom Navigation">
                <Link 
                    to="/#home" 
                    onClick={(e) => handleNavClick(e, "#home")}
                    className={`bottom-nav-item ${isHomeActive ? "active" : ""}`}
                >
                    <div className="bottom-nav-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </div>
                    <span className="bottom-nav-label">Home</span>
                </Link>

                <Link 
                    to="/#news" 
                    onClick={(e) => handleNavClick(e, "#news")}
                    className={`bottom-nav-item ${isNewsActive ? "active" : ""}`}
                >
                    <div className="bottom-nav-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M9 12h6m-6 4h6" />
                        </svg>
                    </div>
                    <span className="bottom-nav-label">News</span>
                </Link>

                <Link 
                    to="/releases" 
                    className={`bottom-nav-item ${isReleasesActive ? "active" : ""}`}
                >
                    <div className="bottom-nav-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                    </div>
                    <span className="bottom-nav-label">Releases</span>
                </Link>

                <Link 
                    to="/media-segment" 
                    className={`bottom-nav-item ${isMediaActive ? "active" : ""}`}
                >
                    <div className="bottom-nav-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                            <line x1="7" y1="2" x2="7" y2="22" />
                            <line x1="17" y1="2" x2="17" y2="22" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <line x1="2" y1="7" x2="7" y2="7" />
                            <line x1="2" y1="17" x2="7" y2="17" />
                            <line x1="17" y1="17" x2="22" y2="17" />
                            <line x1="17" y1="7" x2="22" y2="7" />
                        </svg>
                    </div>
                    <span className="bottom-nav-label">Media</span>
                </Link>

                <Link 
                    to="/about" 
                    className={`bottom-nav-item ${isAboutActive ? "active" : ""}`}
                >
                    <div className="bottom-nav-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                    </div>
                    <span className="bottom-nav-label">About</span>
                </Link>
            </nav>
        </>
    )
}

export default NavbarComponent;