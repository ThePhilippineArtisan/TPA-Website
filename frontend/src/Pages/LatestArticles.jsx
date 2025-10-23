import { Link } from "react-router-dom";

import Photo2 from "../Sample-Photos/Multification-Invication.jpg"

import "../CSS/LatestArticles.css"

import CoverPhotoSearch from "../Components/CoverPhotoSearch.jsx";

const LatestArticles = () => {
    return(
        <div style = {{backgroundColor: "#9edcff5b"}}>
            <CoverPhotoSearch />
            <div className = "Latest-Articles">
                <h1> • 06 / 19 / 2025</h1> <hr style = {{margin: "1rem", height: "3px", width: "80%"}}></hr>                
            </div>

            <div className = "Day-Articles">
                <hr style = {{height: "25rem", marginLeft: "5rem"}}></hr>
                <div className = "Three-Article-Column">
                    <div className = "Individual-Article" onClick = "#"> 
                        <img  loading = "lazy"
                            src = {Photo2}
                        />

                        <div className = "Large-News" >
                            <Link to = "/Joseph-Brian-Balut" className = "Large-News-Headline">
                                <Link to = "/Joseph-Brian-Balut"> LOOK: TUP Manila concludes 120th commencement exercises with graduates from CLA, COS, and graduate programs </Link>
                                    
                                <div className = "Article-Author-Time">
                                    <Link to = "/" >Cathlene Torrenueva | September 12, 2025</Link>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className = "Individual-Article" onClick = "#"> 
                        <img  loading = "lazy"
                            src = {Photo2}
                        />

                        <div className = "Large-News" >
                            <Link to = "/Joseph-Brian-Balut" className = "Large-News-Headline">
                                <Link to = "/Joseph-Brian-Balut"> LOOK: TUP Manila concludes 120th commencement exercises with graduates from CLA, COS, and graduate programs </Link>
                                    
                                <div className = "Article-Author-Time">
                                    <Link to = "/" >Cathlene Torrenueva | September 12, 2025</Link>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className = "Individual-Article" onClick = "#"> 
                        <img  loading = "lazy"
                            src = {Photo2}
                        />

                        <div className = "Large-News" >
                            <Link to = "/Joseph-Brian-Balut" className = "Large-News-Headline">
                                <Link to = "/Joseph-Brian-Balut"> LOOK: TUP Manila concludes 120th commencement exercises with graduates from CLA, COS, and graduate programs </Link>
                                    
                                <div className = "Article-Author-Time">
                                    <Link to = "/" >Cathlene Torrenueva | September 12, 2025</Link>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className = "Individual-Article" onClick = "#"> 
                        <img  loading = "lazy"
                            src = {Photo2}
                        />

                        <div className = "Large-News" >
                            <Link to = "/Joseph-Brian-Balut" className = "Large-News-Headline">
                                <Link to = "/Joseph-Brian-Balut"> LOOK: TUP Manila concludes 120th commencement exercises with graduates from CLA, COS, and graduate programs </Link>
                                    
                                <div className = "Article-Author-Time">
                                    <Link to = "/" >Cathlene Torrenueva | September 12, 2025</Link>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LatestArticles;