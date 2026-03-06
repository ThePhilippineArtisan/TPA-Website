import { Link } from "react-router-dom";

import "../CSS/ListOfMediaSegments.css";

const ListOfMediaSegments = () => {
    return(
            <div className = "List-of-Media-Segments">
                <div className = "Media-Segment-Card-Wrapper">
                    <h1 id = "Latest-Weekly-Segments"> Latest Weekly Segments </h1>
                    <div className = "Media-Segment-Card">
                        <Link to = "/media-segment/id" className = "List-Of-MS-Card" id = "Segment">
                            <p id = "MMSegment"> Makata Monday </p>
                            <img
                                src = {"https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/Bata.jpg"}
                                
                            />
                            <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, culpa? </p>

                        </Link>

                        <Link to = "/media-segment/id" className = "List-Of-MS-Card">
                            <p id = "MMSegment"> Tek Tuesday </p>
                            <img
                                src = {"https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/Features_Friday.jpg"}
                                
                            />
                            <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, culpa? </p>

                        </Link>

                        <Link to = "/media-segment/id" className = "List-Of-MS-Card">
                            <p id = "MMSegment"> Wankjob Wednesday </p>
                            <img
                                src = {"https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/StreamingSat.jpg"}
                                
                            />
                            <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, culpa? </p>

                        </Link>

                        <Link to = "/media-segment/id" className = "List-Of-MS-Card">
                            <p id = "MMSegment"> Tala Thursday </p>
                            <img
                                src = {"https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/Bata.jpg"}
                                
                            />
                            <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, culpa? </p>

                        </Link>

                        <Link to = "/media-segment/id" className = "List-Of-MS-Card">
                            <p id = "MMSegment"> Features Friday </p>
                            <img
                                src = {"https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/Features_Friday.jpg"}
                                
                            />
                            <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, culpa? </p>

                        </Link>

                        <Link to = "/media-segment/id" className = "List-Of-MS-Card">
                            <p id = "MMSegment"> Streaming Saturday </p>
                            <img
                                src = {"https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/StreamingSat.jpg"}
                                
                            />
                            <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, culpa? </p>

                        </Link>

                        <Link to = "/media-segment/id" className = "List-Of-MS-Card">
                            <p id = "MMSegment"> Sports Sunday </p>
                            <img
                                src = {"https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/Features_Friday.jpg"}
                                
                            />
                            <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, culpa? </p>

                        </Link>

                    </div>
                </div>
            </div>
    )
}

export default ListOfMediaSegments;