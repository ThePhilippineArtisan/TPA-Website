import "../CSS/MediaSegmentPage.css";
import { useSearchParams } from "react-router-dom";

import LatestMediaSegment from "../Components/LatestMediaSegment.jsx";
import Tabs from "../Components/Tabs.jsx";
import ListOfMediaSegments from "../Components/ListOfMediaSegments.jsx";

const MediaSegmentPage = () => {
    const [searchParams] = useSearchParams();
    const selectedType = searchParams.get("type");

    return (
        <div className="Media-Segment-Page">
            <LatestMediaSegment filterType={selectedType} />

            <Tabs />

            <div className="Below-Media-Segments">
                <ListOfMediaSegments filterType={selectedType} />
            </div>
        </div>
    );
};

export default MediaSegmentPage;