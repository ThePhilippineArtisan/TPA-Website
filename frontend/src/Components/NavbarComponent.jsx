import TPAWhite from "/TPA-White.png";
import TPACircleLogo from "/TPACircleLogo.png";

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

    // What you see here are the nuts and bolts

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
                    <a href = "#"> About Us</a>

                    <div className = "tpa-circle-logo">
                        <img
                            src = {TPACircleLogo}
                            onClick = "#"
                        />
                    </div>
                </div>
            </div>
        )
}

export default NavbarComponent;