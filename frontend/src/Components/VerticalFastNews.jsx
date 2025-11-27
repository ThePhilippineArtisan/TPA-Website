import { Link } from "react-router-dom";

import JUSTIN from "../Sample-Photos/JUST-IN.jpg"
import "../CSS/VerticalFastNews.css"

const VerticalFastNews = () => {
    return(
        <div className = "Vertical-Headlines">
            
            <div style={{padding: "1.5rem", borderRadius: "10px", backgroundColor: "#76b3f827"}}>
            <Link to = "/" style = {{fontSize: "1.75rem", alignSelf: "center"}}> BULLETIN BOARD  </Link>

            <div className = "Bulletin-Board">
            <hr className = "Vertical-Divider-Side-News" style ={{alignSelf: "center"}}></hr>
                     <a href = "https://youtube.com/@AvoirJoseph" > Want to join the Philippine Artisan? Click  <span style = {{color: '#0265A9'}}> here </span> to be included in the list of our future applicants! </a>
            </div>
        </div>

        <Link to = "/" style = {{fontSize: "1.5rem"}}> FAST NEWS (JI, ICYMI, ANN) ———{`>`}</Link>
            <div className = "Vertical-Side-News">       
                    <img  loading = "lazy" 
                        src = {JUSTIN}
                    />
            <hr className = "Vertical-Divider-Side-News"></hr>
                <div className = "Vertical-Headlines">
                    <p> NATIONAL NEWS: Ferdinand Marcos Jr. Declares National Martial Law amid isolated unrest to be led by Torre </p>
                </div>
            </div>

            <div className = "Vertical-Side-News">       
                    <img  loading = "lazy" 
                        src = {JUSTIN}
                    />
            <hr className = "Vertical-Divider-Side-News"></hr>      
                <div className = "Vertical-Headlines">
                    <p> NATIONAL NEWS: Ferdinand Marcos Jr. Declares National Martial Law amid isolated unrest to be led by Torre </p>
                </div>
            </div>
        <Link to = "/" style = {{fontSize: "1.5rem"}}> LOCAL, NATIONAL, SPORTS NEWS ———{`>`}</Link>
            <div className = "Vertical-Side-News">       
                    <img  loading = "lazy" 
                        src = {JUSTIN}
                    />
                <hr className = "Vertical-Divider-Side-News"></hr>          
                <div className = "Vertical-Headlines">
                    <p> NATIONAL NEWS: Ferdinand Marcos Jr. Declares National Martial Law amid isolated unrest to be led by Torre </p>
                </div>
            </div>

            <div className = "Vertical-Side-News">       
                    <img  loading = "lazy" 
                        src = {JUSTIN}
                    />
            <hr className = "Vertical-Divider-Side-News"></hr>    
                <div className = "Vertical-Headlines">
                    <p> JUST IN: Ferdinand Marcos Jr. Signs Means to Pre-Emptive Declaration of State of Disaster</p>
                </div>
            </div>

            <div className = "Vertical-Side-News">       
                <img  loading = "lazy" 
                    src = {JUSTIN}
                />
            <hr className = "Vertical-Divider-Side-News"></hr>
                <div className = "Vertical-Headlines">
                    <p> ICYMI: Protesters cross Pasig River resemble River Styx for Marcos Admin through Ayala Bridge</p>
                </div>
            </div>
        </div>
    )
}

export default VerticalFastNews;