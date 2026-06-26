import { Link } from "react-router-dom";

import "../CSS/ListOfMediaSegments.css";

const ListOfMediaSegments = () => {
    return(
            <div className = "List-of-Media-Segments">
                <div className = "Media-Segment-Card-Wrapper">
                    <h1 id = "Latest-Weekly-Segments"> Latest Weekly Segments </h1>
                    <div className = "Media-Segment-Card">
                        <Link to = "/media-segment/id" className = "List-Of-MS-Card" id = "Segment">
                            <div className = "Segment-Container"><p> Makata Monday </p> </div>
                            <img
                                src = {"https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/Bata.jpg"}
                                
                            />
                            <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, culpa? </p>

                        </Link>

                        <Link to = "/media-segment/id" className = "List-Of-MS-Card">
                            <div className = "Segment-Container"> <p> Tek Tuesday </p> </div>
                            <img
                                src = {"https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/Features_Friday.jpg"}
                                
                            />
                            <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, culpa? </p>

                        </Link>

                        <Link to = "/media-segment/id" className = "List-Of-MS-Card">
                            <div className = "Segment-Container"> <p> Wankjob Wednesday </p> </div>
                            <img
                                src = {"https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/StreamingSat.jpg"}
                                
                            />
                            <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, culpa? </p>

                        </Link>

                        <Link to = "/media-segment/id" className = "List-Of-MS-Card">
                            <div className = "Segment-Container"> <p> Tala Thursday </p> </div>
                            <img
                                src = {"https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/Bata.jpg"}
                                
                            />
                            <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, culpa? </p>

                        </Link>

                        <Link to = "/media-segment/id" className = "List-Of-MS-Card">
                            <div className = "Segment-Container"> <p> Features Friday </p> </div>
                            <img
                                src = {"https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/Features_Friday.jpg"}
                                
                            />
                            <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, culpa? </p>

                        </Link>

                        <Link to = "/media-segment/id" className = "List-Of-MS-Card">
                            <div className = "Segment-Container"> <p> Streaming Saturday </p> </div>
                            <img
                                src = {"https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/StreamingSat.jpg"}
                                
                            />
                            <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, culpa? </p>

                        </Link>

                        <Link to = "/media-segment/id" className = "List-Of-MS-Card">
                            <div className = "Segment-Container"> <p> Sports Sunday </p> </div>
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