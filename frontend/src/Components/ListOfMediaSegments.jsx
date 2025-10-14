import { Link } from "react-router-dom";

import Photo1 from "../Sample-Photos/Bata.jpg"
import StreamingSat from "../Sample-Photos/StreamingSat.jpg"

import "../CSS/ListOfMediaSegments.css";

const ListOfMediaSegments = () => {
    return(
            <div className = "List-of-Media-Segments">
                <h1 id = "Latest-Weekly-Segments"> Latest Weekly Segments </h1>

                    <div className = "Media-Segment-Card">
                        <Link to = "#" className = "Media-Card">
                            <p id = "MMSegment"> Makata Monday </p>
                            <img
                                src = {Photo1}
                                
                            />
                            <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, culpa? </p>
                            

                        </Link>

                        <Link to = "#" className = "Media-Card">
                            <p id = "MMSegment"> Tek Tuesday </p>
                            <img
                                src = {Photo1}
                                
                            />
                            <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, culpa? </p>
                            

                        </Link>

                        <Link to = "#" className = "Media-Card">
                            <p id = "MMSegment"> Wankjob Wednesday </p>
                            <img
                                src = {Photo1}
                                
                            />
                            <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, culpa? </p>
                            

                        </Link>

                        <Link to = "#" className = "Media-Card">
                            <p id = "MMSegment"> Tala Thursday </p>
                            <img
                                src = {Photo1}
                                
                            />
                            <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, culpa? </p>
                            

                        </Link>


                        <Link to = "#" className = "Media-Card">
                            <p id = "MMSegment" > Features Friday </p>
                            <img
                                src = {StreamingSat}
                                
                            />
                            <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, culpa? </p>

                        </Link>

                        <Link to = "#" className = "Media-Card">
                            <p id = "MMSegment" > Streaming Saturday </p>
                            <img
                                src = {StreamingSat}
                                
                            />
                            <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, culpa? </p>

                        </Link>

                        <Link to = "#" className = "Media-Card">
                            <p id = "MMSegment" > Sports Sunday </p>
                            <img
                                src = {StreamingSat}
                                
                            />
                            <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, culpa? </p>

                        </Link>
                    </div>


                </div>

    )
}

export default ListOfMediaSegments;