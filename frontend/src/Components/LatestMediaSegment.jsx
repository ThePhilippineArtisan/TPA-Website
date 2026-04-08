import "../CSS/LatestMediaSegment.css"

import { Link } from "react-router-dom";

const LatestMediaSegment = () => {
    return(
        <div>
            <div className = "Latest-Media-Segment-Image"
                style={{ "--bgImage": `url(${"https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/Bata.jpg"})`, width: "90%"}} >
                

                <Link to = "/media-segment/id" className = "Latest-MS-Title">
                    <img
                        src = {"https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/Bata.jpg" /** Latest Media Segment Available */}
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