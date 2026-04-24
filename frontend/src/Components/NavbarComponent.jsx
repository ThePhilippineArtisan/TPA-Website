import { useEffect } from "react";
import { Link } from "react-router-dom";

import TPAWhite from "../assets/Miniature_Icon_Version/TPA-Blue.png";
import TPACircleLogo from "../assets/Miniature_Icon_Version/TPACircleLogo.png";

import "../CSS/Navbar.css"

const NavbarComponent = () => {

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

    return (
        <div className="navbar-container">
            <div className="navbar-box">
                <div className="tpa-logo">
                    <Link to="/#home">
                        <img
                            loading="lazy"
                            id="tpa-logo"
                            src={TPAWhite}
                            alt="The Philippine Artisan Logo"
                        />
                    </Link>
                </div>

                <div className="navbar-links">
                    <Link to="/#home"> Home </Link>
                    <Link to="/#news"> News </Link> 
                    <Link to="/releases"> Releases </Link>
                    <Link to="/media-segment"> Media Segments </Link>
                </div>

                <Link to="/about" className="tpa-circle-logo">
                    <img
                        src={TPACircleLogo}
                        alt="About The Philippine Artisan"
                    />
                </Link>
            </div>
        </div>
    )
}

export default NavbarComponent;