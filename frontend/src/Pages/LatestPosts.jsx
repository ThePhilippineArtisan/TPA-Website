import { Link } from "react-router-dom";

import Photo2 from "../Sample-Photos/Multification-Invication.jpg"

import "../CSS/LatestPosts.css"

import CoverPhotoSearch from "../Components/CoverPhotoSearch.jsx";

const LatestPosts = () => {

    return (
        <div className="Latest-Posts-Page">
            <CoverPhotoSearch />
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
                    <input type = "checkbox"/> Local News
                </div> 
            </div>
            </div>
        </div>
    )
}

export default LatestPosts;