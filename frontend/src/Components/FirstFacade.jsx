import KahonKalyo from "/KahonKalyo.png";
import TPACircleLogo from "/TPACircleLogo.png";

import "../CSS/FirstFacade.css"

const FirstFacade = () => {

    return(
        <div className = "Literary-Showcase-First-Facade">
            <div className = "Dark-BG-First-Facade">

                <div className = "DBFF-Left-Side">
                    <div className = "DBFF-Headline">
                        <h1>KALYO: KAHON — ‘24-‘25</h1>
                    </div>

                    <div className = "DBFF-Top-Paragraph">
                        <h4>
                        <span> Ang Kalyo ay ang opisyal na literary folio ng The Philippine Artisan - Manila. <br></br> </span>

                        <span> 
                            Ang kahon ay laberinto ng mga lihim at <br></br>    
                            inaagiw na alaala.<br></br>
                        </span>

                        <br></br>
                    
                        <span> 
                            Sa mga sulok ng kuwadrado, matatagpuan ang <br></br>
                            katotohanan na pilit itinatago. <br></br> 
                        </span>
                        </h4>
                    </div>

                    <div className = "Small-Prev-Image-Showcase">
                        <img
                            src = {TPACircleLogo}
                            onClick = "#"
                        /> 
                            <h4>
                                <span>The 81-year old official student publication of Technological University of the Philippines Manila.</span>
                                <br></br>                                <br></br>
                                <span>Serving the academe and the country since 1944.</span>
                            </h4>
                    </div>



                    <div className = "DBFF-Bottom-Paragraph">
                        <h4>
                            <span> 
                                Ngunit kung tatalikuran, bawat hakbang,
                                bawat yapak ay katumbas ng katuturan <br></br>
                                ng mundo ang papasanin.<br></br>
                            </span>

                            <br></br>
                        
                            <span> 
                                Sa mga sulok ng kuwadrado, matatagpuan ang <br></br>
                                katotohanan na pilit itinatago. <br></br> 
                            </span>
                        </h4>
                    </div>
                </div>
                <div className = "DBFF-Right-Side">
                    <div className = "First-Facade-Image-Showcase">
                            <img id = "Kahong-Kalyo"
                                src = {KahonKalyo}

                            />

                        </div>
                </div>

            </div>
        </div>
    )
}

export default FirstFacade;