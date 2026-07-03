import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import { formatRelativeTime } from "../utils/dateUtils"

import "../CSS/VideoShowcase.css"


const VideoShowcase = () => {

const [videos, setVideos] = useState([])

useEffect(() => {
    const fetchThumbnails = async () => {
        let { data, error } = await supabase
        .from('videos')
        .select('*')
        .limit(5)
        .order('date_added', { ascending: false})

        if(error){
            console.log('Error fetching thumbnails: ', error)
        } else{
            setVideos(data)
        }
    }
    fetchThumbnails()
}, [])

    return(
        <div className = "Video-Showcase">
            <a href = "https://www.youtube.com/@tek_artisanmnl" 
            target = "_blank" rel = "noopener noreferrer"> TUNE IN WITH TEK ⟶ </a>
            <p> Explore The Philippine Artisan's latest content, coverages, and media segments on YouTube! </p>
            <div className = "Thumbnail-Container">
                <div className = "Thumbnail-Videos">
                    <div className = "Thumbnail-Videos-Container">
                        {videos.map((video) => (
                            <div className = "Thumbnail-Videos-Individual-Container">
                                <a href = {video.youtube_url} target = "_blank" 
                                rel = "noopener noreferrer" key = {video.id}>
                                        <img 
                                            src = {video.thumbnail}
                                            alt = {video.youtube_title}
                                            loading = "lazy"
                                        />
                                    <div className = "Title-Date-Container">
                                        <p> {video.youtube_title} </p>
                                        <span> {formatRelativeTime(video.date_added)} </span>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default VideoShowcase;