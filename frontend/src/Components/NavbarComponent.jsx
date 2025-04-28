import TPAWhite from "/TPA-White.png";
import "../CSS/Navbar.css"

const NavbarComponent = () => {

    return(
        <div className = "navbar-box">
            <div className = "tpa-logo" id = "tpa-logo">
                <img src = {TPAWhite} alt = "The Philippine Artisan Logo"/>
            </div>
        </div>
    )
}

export default NavbarComponent;