import { Link } from "react-router-dom";

import JUSTIN from "../Sample-Photos/JUST-IN.jpg"
import "../CSS/VerticalFastNews.css"

const VerticalFastNews = () => {
    return(
                <div className = "Vertical-Headlines">
                    
                    <div style={{padding: "1.5rem", borderRadius: "10px", backgroundColor: "#0077ff27"}}>
                    <Link to = "/" style = {{fontSize: "1.75rem", alignSelf: "center"}}> BULLETIN BOARD  </Link>

                    <div className = "Bulletin-Board">
                                <hr></hr>
                        <p> <a href = "https://youtube.com/@AvoirJoseph" > Want to join the Philippine Artisan? Click  <span style = {{color: '#0265A9'}}> here </span> to be included in the list of our future applicants! </a> </p>
                    </div>
                    </div>

                    <Link to = "/" style = {{fontSize: "1.75rem"}}> FAST NEWS ———{`>`}</Link>
                    <hr style = {{marginBottom: '0.5rem'}}></hr> 
                    <div className = "Vertical-Side-News">       
                            <img  loading = "lazy" 
                                src = {JUSTIN}
                            />                     
                        <div className = "Secondary-News-Headline">
                            <Link to = "/Joseph-Brian-Balut"> NATIONAL NEWS: Ferdinand Marcos Jr. Declares National Martial Law amid isolated unrest to be led by Torre </Link>
                        </div>
                    </div>

                    <div className = "Vertical-Side-News">       
                            <img  loading = "lazy" 
                                src = {JUSTIN}
                            />                     
                        <div className = "Secondary-News-Headline">
                            <Link to = "/Joseph-Brian-Balut"> NATIONAL NEWS: Ferdinand Marcos Jr. Declares National Martial Law amid isolated unrest to be led by Torre </Link>
                        </div>
                    </div>

                    <div className = "Vertical-Side-News">       
                            <img  loading = "lazy" 
                                src = {JUSTIN}
                            />                     
                        <div className = "Secondary-News-Headline">
                            <Link to = "/Joseph-Brian-Balut"> NATIONAL NEWS: Ferdinand Marcos Jr. Declares National Martial Law amid isolated unrest to be led by Torre </Link>
                        </div>
                    </div>


                    <div className = "Vertical-Side-News">       
                            <img  loading = "lazy" 
                                src = {JUSTIN}
                            />                     
                        <div className = "Secondary-News-Headline">
                            <Link to = "/Joseph-Brian-Balut"> JUST IN: Ferdinand Marcos Jr. Signs Means to Pre-Emptive Declaration of State of Disaster</Link>
                        </div>
                    </div>

                    <div className = "Vertical-Side-News">       
                            <img  loading = "lazy" 
                                src = {JUSTIN}
                            />                     
                        <div className = "Secondary-News-Headline">
                            <Link to = "/Joseph-Brian-Balut"> ICYMI: Protesters cross Pasig River resemble River Styx for Marcos Admin through Ayala Bridge</Link>
                        </div>
                    </div>
                </div>
    )
}

export default VerticalFastNews;