import "../CSS/LatestMediaSegment.css"
import Photo1 from "../Sample-Photos/Bata.jpg"

import { Link } from "react-router-dom";

const LatestMediaSegment = () => {
    return(
        <div>
            <div className = "Latest-Media-Segment-Image" id = "imga">
                <img
                    src = {Photo1 /** Latest Media Segment Available */}
                />

                <div className = "Latest-MS-Title">
                    <Link><h1> Wankjob Wednesday: Bata </h1></Link>
                    <Link><h3> by Joseph Brian Balut </h3></Link> 

                    <div className = "Vertical-Side-News">
                        <hr></hr>
                        <div className = "Sample-Text">
                            <p> MGA LARAWAN:  Estudyante mula sa iba't ibang unibersidad na miyembro ng One Taft Alliance ay nagsagawa ng Black Friday Protest sa kahabaan ng Ayala Blvd.,  kahapon, Setyembre 12, 2025.
                                Layunin ng protesta na iparating ang pagkondena ng mga estudyante at kabataan sa nagaganap na korapsyon sa gobyerno at sa mga regresibong patakarang iniimplementa sa iba't-ibang mga unibersidad.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )

}

export default LatestMediaSegment;