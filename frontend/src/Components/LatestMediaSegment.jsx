import "../CSS/LatestMediaSegment.css"

import Photo1 from "../Sample-Photos/Bata.jpg"
import StreamingSat from "../Sample-Photos/StreamingSat.jpg"

import { Link } from "react-router-dom";

const LatestMediaSegment = () => {
    return(
        <div>
            <div className = "Latest-Media-Segment-Image"
                style={{ "--bgImage": `url(${StreamingSat})`, width: "90%"}} >
                
                <img
                    src = {StreamingSat /** Latest Media Segment Available */}
                />

                <Link to = "/" className = "Latest-MS-Title">
                    <h1> Bata </h1>
                    <h3> by Joseph Brian Balut </h3>

                    <div className = "Sample-Text-Container">
                        <hr className = "Vertical-Divider"></hr>
                        <div className = "Sample-Text">
                            <p> MGA LARAWAN:  Estudyante mula sa iba't ibang unibersidad na miyembro ng One Taft Alliance ay nagsagawa ng Black Friday Protest sa kahabaan ng Ayala Blvd.,  kahapon, Setyembre 12, 2025.
                                Layunin ng protesta na iparating ang pagkondena ng mga estudyante at kabataan sa nagaganap na korapsyon sa gobyerno at sa mga regresibong patakarang iniimplementa sa iba't-ibang mga unibersidad.
                            </p>
                        </div>
                    </div>

                </Link>
            </div>

        </div>
    )

}

export default LatestMediaSegment;