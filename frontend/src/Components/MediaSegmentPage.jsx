import "../CSS/MediaSegmentPage.css"
import { Link } from "react-router-dom";

import Photo1 from "../Sample-Photos/Bata.jpg"
import StreamingSat from "../Sample-Photos/StreamingSat.jpg"

const MediaSegmentPage = () => {
    return(
        <div className = "Media-Segment-Page">
            <div className = "Latest-Media-Segment-Image">
                <img
                    src = {StreamingSat /** Latest Media Segment Available */}
                />

                <div className = "Latest-MS-Title">
                    <a><h1> Makata Monday: Bata </h1></a>
                    <h3> by Joseph Brian Balut </h3> 
                </div>
            </div>

            <div className = "Tabs">
                <Link to = "#" title = "Poetry, Prose, Pretention Galore! Ang Makata Monday ay ang pang-Literaryong Media Segment ng TPA"> Makata Monday </Link>
                <Link to = "#" title = "Our Teks dive into the world of technology!"> Tek Tuesday </Link>
                <Link to = "#" title = "Editorial Cartoonist and Wankers Wanking for attention"> Wankjob Wednesday </Link>
                <Link to = "#" title = "Filipino por Indio words of the Day!"> Tala Thursday </Link>
                <Link to = "#" title = "Professional Yappers Yapping About Yap"> Features Friday </Link>
                <Link to = "#" title = "Professional Yappers Yapping About Yap"> Streaming Saturday </Link>
                <Link to = "#" title = "May Athletes pa pala tayo bukod kina Pacquiao, Yulo, Eala, at Diaz?"> Sports Sunday </Link>
                <Link to = "#" title = "Can't figure out what you want? RED FLAG!"> RANDOMIZE </Link>
            </div>

            <div className = "Below-Media-Segments">
                <div className = "List-of-Media-Segments">
                    <div className = "Media-Segment-Card">
                        <img
                            src = {Photo1}
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default MediaSegmentPage;