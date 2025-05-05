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
                            
                        </div>
                    </div>

                    <div className = "SecondColumn">
                        
                    </div>

                    <div className = "ThirdColumn">
                        
                    </div>

                </div>

        </div>
    )
}

export default SecondFacade;