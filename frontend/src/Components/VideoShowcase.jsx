import { Link } from "react-router-dom";

import "../CSS/VideoShowcase.css";

const VideoShowcase = () => {

    return(
        <div className = "Video-Showcase">
            <Link to = "#"> TEK'S VIDEOS ———{`>`} </Link>
            
            <div className = "Iframe-Container" id = "iframes">
                <div className = "Iframe-Videos">
                    <iframe 
                        loading = "lazy"
                        src="https://www.youtube.com/embed/_gMtQVJwzBA?si=7JdevQ6D32JZKgiL" 
                        title="YouTube video player" frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerpolicy="strict-origin-when-cross-origin" 
                        allowfullscreen>
                    </iframe>

                    <iframe 
                        loading = "lazy"
                        src = "https://www.youtube.com/embed/wZh6KP2qgKc?si=5KLeDg_K-agffYq_" 
                        title = "Youtube video player" frameborder = "0" 
                        allow = 
                        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerpolicy = "strict-origin-when-cross-origin" 
                        allowfullscreen>
                    </iframe>

                    <iframe 
                        loading = "lazy"
                        src = "https://www.youtube.com/embed/z5_hpf3Ix7g?si=xQss33snI2jyVPhP" 
                        title = "Gawad Tek R Tisan 2024-2025" frameborder = "0" 
                        allow = 
                        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerpolicy = "strict-origin-when-cross-origin" 
                        allowfullscreen>
                    </iframe>

                    <iframe 
                        loading = "lazy"
                        src = "https://www.youtube.com/embed/7Aoe2kCeygQ?si=Js5KPY5xAziuHPTq" 
                        title = "Gawad Tek R Tisan 2024-2025" frameborder = "0" 
                        allow = 
                        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerpolicy = "strict-origin-when-cross-origin" 
                        allowfullscreen>
                    </iframe>

                    </div>                
            </div>
        </div>

    )
}

export default VideoShowcase;