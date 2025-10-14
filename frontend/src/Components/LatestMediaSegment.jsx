import "../CSS/LatestMediaSegment.css"
import Photo1 from "../Sample-Photos/Bata.jpg"

import { Link } from "react-router-dom";

const LatestMediaSegment = () => {
    return(
        <div>
            <div className = "Latest-Media-Segment-Image" id = "imga">
                <img
                    src = {Photo1 /** Latest Media Segment Available */}
                />

                <div className = "Latest-MS-Title">
                    <Link><h1> Wankjob Wednesday: Bata </h1></Link>
                    <Link><h3> by Joseph Brian Balut </h3></Link> 
                </div>
            </div>

        </div>
    )

}

export default LatestMediaSegment;