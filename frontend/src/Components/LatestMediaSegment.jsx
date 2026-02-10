import "../CSS/LatestMediaSegment.css"

import Photo1 from "../Sample-Photos/Bata.jpg"
import StreamingSat from "../Sample-Photos/StreamingSat.jpg"

import { Link } from "react-router-dom";

const LatestMediaSegment = () => {
    return(
        <div>
            <div className = "Latest-Media-Segment-Image"
                style={{ "--bgImage": `url(${Photo1})`, width: "90%"}} >
                

                <Link to = "/media-segment/id" className = "Latest-MS-Title">
                    <img
                        src = {Photo1 /** Latest Media Segment Available */}
                    />
                    <div className = "Media-Segment-Title-Author">
                        <h1> Ibalik nyo si Tatay Digong </h1>
                        <h3> by Atty. Jimmy Bondoc </h3>
                    </div>
                </Link>
            </div>

        </div>
    )

}

export default LatestMediaSegment;