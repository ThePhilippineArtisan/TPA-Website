import { Link } from "react-router-dom";

import Photo2 from "../Sample-Photos/Multification-Invication.jpg"

import "../CSS/LatestPosts.css"

import CoverPhotoSearch from "../Components/CoverPhotoSearch.jsx";
import Tabs from "../Components/Tabs.jsx"

const LatestPosts = () => {

    return (
        <div className="Latest-Posts-Page">
            <CoverPhotoSearch />
            <Tabs />
            <div className = "Latest-Article-Two-Part">
                <div className = "Latest-Articles-Container">
                    <div className = "Latest-Articles-Date">
                        <h1> • 06 / 19 / 2025</h1> <hr className = "Horizontal-Line-Date"></hr>
                    </div>

                    <div className="Day-Articles">
                        <hr className = "Vertical-Line-Date"></hr>
                        <div className="Three-Article-Column">

                            <Link to = "/Joseph-Brian-Balut" className = "Individual-Article">
                                <img loading = "lazy"
                                    src = {Photo2}
                                />
                                <div className = "Large-News" >
                                    <div className = "Large-News-Headline">
                                        <p> LOOK: TUP Manila concludes 120th commencement exercises with graduates from CLA, COS, and graduate programs </p>

                                        <div className = "Article-Author-Time">
                                            <p>Cathlene Torrenueva | September 12, 2025</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                </div>
            <div className = "Latest-Post-Filters">
                <div className = "Latest-Post-Filter-Container">
                    
                    <br></br><h3>Short-Form News</h3><br></br> 
                    <div style = {{border: "1px blue solid", borderRadius: "5px", padding: "0rem 1rem"}}>                    
                    <div className = "Individual-Filters"><input type = "checkbox"/><p>Just In</p></div>
                    <div className = "Individual-Filters"><input type = "checkbox"/><p>In Case You Missed It!</p></div>
                    <div className = "Individual-Filters"><input type = "checkbox"/><p>Announcement</p></div>
                    <div className = "Individual-Filters"><input type = "checkbox"/><p>Advisory</p></div>
                    <div className = "Individual-Filters"><input type = "checkbox"/><p>Alert</p></div>
                    <div className = "Individual-Filters"><input type = "checkbox"/><p>Walang Pasok</p></div>
                    <div className = "Individual-Filters"><input type = "checkbox"/><p>Just In</p></div>
                    </div>
                    
                    <br></br><h3>Long-Form News</h3><br></br>
                    <div style = {{border: "1px blue solid", borderRadius: "5px", padding: "0rem 1rem"}}>       
                    <div className = "Individual-Filters"><input type = "checkbox"/><p>University News</p></div>
                    <div className = "Individual-Filters"><input type = "checkbox"/><p>Local News</p></div>
                    <div className = "Individual-Filters"><input type = "checkbox"/><p>University News</p></div>
                    <div className = "Individual-Filters"><input type = "checkbox"/><p>National News</p></div>
                    <div className = "Individual-Filters"><input type = "checkbox"/><p>International News</p></div>
                    <div className = "Individual-Filters"><input type = "checkbox"/><p>Developing Story</p></div>
                    </div>

                    <br></br><h3>Look, In Photos, Highlights</h3><br></br> 
                    <div style = {{border: "1px blue solid", borderRadius: "5px", padding: "0rem 1rem"}}>       
                    <div className = "Individual-Filters"><input type = "checkbox"/><p>Look</p></div>
                    <div className = "Individual-Filters"><input type = "checkbox"/><p>In Photos</p></div>
                    <div className = "Individual-Filters"><input type = "checkbox"/><p>Highlights</p></div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default LatestPosts;