import LampoonCover from "../TPA-Releases/2025-Lampoon/2025-Lampoon_Duh-Filipit-Artihan/2025-Lampoon_Duh-Filipit-Artihan-1.png"
import KalyoCover from "../TPA-Releases/2024-Kalyo/KALYO__2024_Page/KALYO__2024_Page-100.png"

import "../CSS/ReleasesFacade.css"

const ReleasesFacade = () =>{
    return(
                        <div className = "Third-BG-First-Facade">
                        <div className = "DBFF-Third-Headline">
                            <h1> THE PHILIPPINE ARTISAN'S 2024 — 2025 PORTFOLIO </h1>
                        </div>
                    <div id = "Portfolio-Showcase">
                        <div className = "Image-Showcase">
                            <img
                                src = {LampoonCover} 
                            />
                            <h2> Lampoon 2025 </h2>                                        
                        </div>

                        <div className = "Image-Showcase">
                            <img
                                src = {KalyoCover} 
                            />
                            <h2> Kalyo 2024 </h2>                                        
                        </div>

                        <div className = "Image-Showcase">
                            <img
                                src = {LampoonCover} 
                            />
                            <h2> Lampoon 2025 </h2>                                        
                        </div>
                    </div>
                </div>
    )
}

export default ReleasesFacade;