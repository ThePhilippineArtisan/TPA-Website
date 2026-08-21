import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient.js"

import "./ManageVideos.css"
import "./ManageFrontPage.css"

const initialFormState = {
    title: "",
    imageUrl: "",
    videoUrl: "",
    dateAdded: "",
    isVisible: true
}

const ManageVideos = () => {
    const [ loading, setLoading ] = useState(true)
    const [ videos, setVideos ] = useState([])
    const [ editingId, setEditingId ] = useState(null)
    const [formState, setFormState] = useState(initialFormState)

    const fetchVideos = async () => {
        setLoading(true)
        try{
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .order('date_added', {ascending : false})
            
            if(error){
                throw error
            }
            setVideos(data || [])

        } catch (error){
            console.warn("Couldn't fetch videos: ", error)
            setVideos([])
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVideos()
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormState(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    const handleSubmitVideo = async (e) => {
        e.preventDefault()

        const title = formState.title.trim()
        if(!title){
            alert("Please provide a title for the video.")
            return
        }

        const payload = {
            youtube_title: title,
            youtube_url: formState.videoUrl || "",
            thumbnail: formState.imageUrl || "",
            date_added: formState.dateAdded ? new Date(formState.dateAdded).toISOString() : new Date().toISOString(),
            is_visible: Boolean(formState.isVisible),
        }

        try {
            if (editingId) {
                const { error } = await supabase
                    .from('videos')
                    .update(payload)
                    .eq('id', editingId)

                if (error) throw error
                alert("Video updated successfully!")
            } else {
                const { error } = await supabase
                    .from('videos')
                    .insert([payload])

                if (error) throw error
                alert("Video saved successfully!")
            }

            handleCancelEdit()
            fetchVideos()
        } catch (err) {
            console.error("Error saving video to Supabase:", err)
            alert(`Failed to save video: ${err.message || err}`)
        }
    }

    const handleEdit = (video) => {
        setEditingId(video.id)
        
        let formattedDate = ""
        if (video.date_added) {
            const d = new Date(video.date_added)
            if (!isNaN(d.getTime())) {
                const tzOffset = d.getTimezoneOffset() * 60000
                formattedDate = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16)
            }
        }

        setFormState({
            title: video.youtube_title || "",
            videoUrl: video.youtube_url || "",
            imageUrl: video.thumbnail || "",
            dateAdded: formattedDate,
            isVisible: video.is_visible ?? true,
        })
        window.scrollTo({top: 0, behavior: 'smooth'})
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setFormState(initialFormState)
    }

    const toggleVisibility = async (id) => {
        const videoToUpdate = videos.find(v => v.id === id)
        if (!videoToUpdate) return
        const updatedVisibility = !videoToUpdate.is_visible

        setVideos(prev => prev.map(v => v.id === id ? { ...v, is_visible: updatedVisibility } : v))

        try {
            const { error } = await supabase
                .from('videos')
                .update({ is_visible: updatedVisibility })
                .eq('id', id)

            if (error) throw error
        } catch (err) {
            console.error("Error updating visibility:", err)
            alert(`Failed to update visibility: ${err.message || err}`)
            fetchVideos()
        }
    }

    const formatDate = (isoString) => {
        if (!isoString) return "N/A"
        const d = new Date(isoString)
        return isNaN(d.getTime()) ? isoString : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    }

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this video?")) {
            try {
                const { error } = await supabase
                    .from('videos')
                    .delete()
                    .eq('id', id)

                if (error) throw error
                setVideos(prev => prev.filter(slide => slide.id !== id))
                if (editingId === id) {
                    handleCancelEdit()
                }
            } catch (err) {
                console.error("Error deleting video:", err)
                alert(`Failed to delete video: ${err.message || err}`)
            }
        }
    }


    return(
        <div className = "Manage-Videos-Container">
            <div>
                <h1>Manage Videos</h1>
                <p>Add, edit, or manage TPA's latest videos here.</p>
            </div>
            <div className = "Manage-Videos-Two-Grid">
                <div className = "Add-Manage-Video-Container">
                    <h4> {editingId ? `Edit Video (ID: ${editingId})` : "Add Video"} </h4>
                    <hr />
                    <form onSubmit = {handleSubmitVideo}>
                        <div className = "Add-Video-Fields">
                            <p>VIDEO TITLE</p>
                            <input 
                                type = "text"
                                name = "title"
                                className="Form-Input"
                                value = {formState.title}
                                onChange = {handleChange}
                                placeholder="Enter YouTube video title..."
                                required
                            />
                        </div>
                        
                        <div className = "Add-Video-Fields">
                            <p>Video Embed URL</p>
                            <input 
                                type = "url"
                                name = "videoUrl"
                                className="Form-Input"
                                value = {formState.videoUrl}
                                onChange = {handleChange}
                                placeholder="https://www.youtube.com/watch?v=..."
                                required
                            />
                        </div>
                        
                        <div className = "Add-Video-Fields">
                            <p>Video Thumbnail Cover</p>
                            <input 
                                type = "url"
                                name = "imageUrl"
                                className="Form-Input"
                                value = {formState.imageUrl}
                                onChange = {handleChange}
                                placeholder="https://img.youtube.com/vi/.../maxresdefault.jpg"
                                required
                            />
                        </div>
                        
                        <div className = "Add-Video-Fields">
                            <p>Date Added</p>
                            <input 
                                type = "datetime-local"
                                name = "dateAdded"
                                className="Form-Input"
                                value = {formState.dateAdded}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="Add-Video-Fields" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                id="isVisible"
                                name="isVisible"
                                checked={formState.isVisible}
                                onChange={handleChange}
                            />
                            <label htmlFor="isVisible" style={{ cursor: 'pointer', fontWeight: '600', color: 'var(--primary-blue)' }}>Visibility: ON / OFF</label>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <button type="submit" className="Admin-Primary-Button">
                                {editingId ? "Update Video" : "Save Video"}
                            </button>
                            {editingId && (
                                <button type="button" className="Btn-Outline Button-Outline" onClick={handleCancelEdit}>
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>
                </div>
                <div className="Existing-Manage-Video-Container">
                    <h4> Existing Videos ({videos.length}) </h4>
                    <hr />
                    <div>
                        {loading ? (
                            <p> Loading... </p>
                        ) : videos.length === 0 ? (
                            <p> No videos found. </p>
                        ) : (
                            videos.map((item) => (
                                <div
                                    key={item.id}
                                    className={`Facade-Item-Card ${!item.is_visible ? 'hidden-item' : ''}`}
                                >
                                    <div className="Item-Main-Info">
                                        <img
                                            src={item.thumbnail}
                                            alt={item.youtube_title}
                                            className="Item-Thumb"
                                        />
                                    </div>

                                    <hr style={{ height: "60%", marginLeft: "1rem" }} className="Vertical-Divider"></hr>

                                    <div className="Item-Text-Details">
                                        <h3>{item.youtube_title}</h3>
                                        <div className="Item-Badges">
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                ID: {item.id}
                                            </span>
                                            <span className="Badge" style={{ background: 'var(--bg-light)', color: 'var(--text-dark)' }}>
                                                Date: {formatDate(item.date_added)}
                                            </span>
                                            <span className={`Badge ${item.is_visible ? 'Badge-Visible' : 'Badge-Hidden'}`}>
                                                {item.is_visible ? 'Visible' : 'Hidden'}
                                            </span>
                                        </div>
                                        <div className="Item-Action-Row">
                                            <div className="Action-Buttons Action-Btns">
                                                <button
                                                    type="button"
                                                    className="Btn-Outline Button-Outline"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="Btn-Outline Button-Outline"
                                                    onClick={() => toggleVisibility(item.id)}
                                                >
                                                    {item.is_visible ? 'Hide' : 'Show'}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="Btn-Outline Button-Outline Btn-Danger Button-Danger"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

        </div>
    )
}

export default ManageVideos