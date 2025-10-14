import "../CSS/MediaSegmentPage.css"
import { Link } from "react-router-dom";


import LatestMediaSegment from "../Components/LatestMediaSegment.jsx"
import Tabs from "../Components/Tabs.jsx"
import ListOfMediaSegments from "../Components/ListOfMediaSegments.jsx";

const MediaSegmentPage = () => {
    return(
        <div className = "Media-Segment-Page">
            <LatestMediaSegment />

            <Tabs />

            <div className = "Below-Media-Segments">
                <ListOfMediaSegments />
            </div>

        </div>
    )
}

export default MediaSegmentPage;