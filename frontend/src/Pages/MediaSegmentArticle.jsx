import Photo2 from "../Sample-Photos/Multification-Invication.jpg"
import JUSTIN from "../Sample-Photos/JUST-IN.jpg"

import "../CSS/MediaSegmentArticle.css"
import ListOfMediaSegments from "../Components/ListOfMediaSegments.jsx"
import VerticalFastNews from "../Components/VerticalFastNews.jsx";

const MediaSegmentArticle = () => {
    return(
        <div className = "Media-Segment-Article-Page">
            <div className = "Media-Segment-Article">
                <div className = "Latest-Media-Segment-Image" id = "imga">
                    <img
                        src = {Photo2 /** Latest Media Segment Available */}
                    />
                </div>
                
                <h2> #FeaturesFriday: Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, suscipit? </h2>

                <div className = "Media-Segment-Article-Below-Photo">
                    <div className = "Author-and-Details">
                        <p> <span> Features Friday </span></p>
                        <br></br>
                        <p> Written by <span> Joseph Brian Balut </span></p>
                        <p> Graphics by <span> Joseph Brian Balut </span></p>
                        <br></br>
                        <p> Published on <span>  October 12, 2025 10:11 AM </span></p>

                        <div style = {{marginTop: '3rem'}}>
                            <VerticalFastNews />
                        </div>

                    </div>

                    <div className = "Media-Segment-Article-Text">
                        <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero at placeat nobis eaque laboriosam adipisci quaerat quibusdam excepturi culpa voluptates in nesciunt tempora numquam, eius blanditiis velit eligendi. Animi voluptates, quod modi officia deserunt delectus incidunt atque. Nesciunt vitae, fuga suscipit, ipsa porro, natus numquam error minus quis veniam odit! </p>
                    </div>

                </div>
            </div>

            <ListOfMediaSegments />
        </div>
    )
}

export default MediaSegmentArticle;