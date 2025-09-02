import "../CSS/MediaSegmentPage.css"

import Photo1 from "../Sample-Photos/Bata.jpg"

const MediaSegmentPage = () => {

    return(
        <div className = "Media-Segment-Page">
            <div className = "Latest-Media-Segment-Image">
                <img
                    src = {Photo1 /** Latest Image Available */}
                />

                <div className = "Latest-MS-Title">
                    <a><h1> Makata Monday: Bata </h1></a>
                    <h4> by Joseph Brian Balut </h4>
                </div>
            </div>

            <div className = "Below-Media-Segments">
                        
            </div>

        </div>
    )
}

export default MediaSegmentPage;