import TPACover from "/TPA-Cover.png"

import "../CSS/SecondFacade.css"


const SecondFacade = () => {
    return(
        <div className = "SecondFacade">
                
                <div className = "CoverPhotoImageFacade">
                    <img
                        src = {TPACover}
                    />

                    <input type = "text" className = "SearchBar"
                    placeholder = "Turno en contra."/>

                </div>

                <div className = "ThreeColumns">

                    <div className = "FirstColumn">
                        <div className = "Box-Card">
                            1st
                        </div>
                    </div>

                    <div className = "SecondColumn">
                        <div className = "Box-Card">
                            2nd
                        </div>
                    </div>
                    <div className = "ThirdColumn">
                        <div className = "Box-Card">
                            3rd
                        </div>
                    </div>

                </div>

        </div>
    )
}

export default SecondFacade;