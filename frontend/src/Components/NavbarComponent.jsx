import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import TPAWhite from "../assets/Miniature_Icon_Version/TPA-Blue.png";
import TPACircleLogo from "../assets/Miniature_Icon_Version/TPACircleLogo.png";

import "../CSS/Navbar.css"

const NavbarComponent = ({ refs }) => {

    const handleReload = () => {
        window.location.reload();
    };
    const location = useLocation();
    const navigate = useNavigate();

    const handleScroll = (ref) => {
        if (location.pathname === "/") {
            ref.current.scrollIntoView({ behavior: "smooth" });
        } else {
            navigate("/");
            setTimeout(() => {
                ref.current.scrollIntoView({ behavior: "smooth" });
            }, 300);
        }
    };

        useEffect(() => {
            let lastScrollTop = 0;
            const navbar = document.querySelector('.navbar-box');

            const onScroll = () => {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

                if (currentScroll > lastScrollTop) {
                    // Scrolling down → hide
                    navbar?.classList.add('hidden');
                } else {
                    // Scrolling up → show
                    navbar?.classList.remove('hidden');
                }

                lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
            };

            window.addEventListener('scroll', onScroll);

            // Cleanup to avoid multiple listeners
            return () => {
                window.removeEventListener('scroll', onScroll);
            };
        }, []);

    return (
        <div>
            <div className="navbar-box">
                <div className="tpa-logo">

                    <Link to="/">
                        <img
                            // onLoad={() => setLogoLoaded(true)}
                            //  className={!logoLoaded ? "skeleton" : ""}
                            loading="lazy"
                            id="tpa-logo"
                            src={TPAWhite}
                            alt="The Philippine Artisan Logo"
                        />
                    </Link>
                </div>

                <div className="navbar-links">
                    <Link to="/" > Home </Link>
                    <Link to="/Create-Article-Page"> News </Link>
                    <Link to="/Releases"> Releases </Link>
                    <Link to="/Media-Segment-Page"> Media Segments </Link>
                </div>

                <Link to="/About" className="tpa-circle-logo">
                    <img
                        src={TPACircleLogo}
                    />
                </Link>
            </div>
        </div>
    )
}

export default NavbarComponent;