import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

import './ManageFrontPage.css'

const initialFormState = {
    header: "",
    imageUrl: "",
    backgroundUrl: "",
    text1: "",
    text2: "",
    text3: "",
    text4: "",
    text5: "",
    text6: "",
    text7: "",
    text8: "",
    order: 1,
    isVisible: true,
    isPinned: false
}

const ManageFrontPage = () => {

    const [loading, setLoading] = useState(true)
    const [slides, setSlides] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [formState, setFormState] = useState(initialFormState)

    const fetchSlides = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('homepage_slides')
                .select('*')
                .order('order', { ascending: true })

            if (error) {
                throw error
            }
            setSlides(data || [])

        } catch (error) {
            console.warn("Couldn't fetch slides: ", error)
            setSlides([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSlides()
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormState(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    const handleEdit = (slide) => {
        setEditingId(slide.id)
        setFormState({
            header: slide.header || "",
            imageUrl: slide.image_url || "",
            backgroundUrl: slide.backgroundSRC || "",
            text1: slide.text1 || "",
            text2: slide.text2 || "",
            text3: slide.text3 || "",
            text4: slide.text4 || "",
            text5: slide.text5 || "",
            text6: slide.text6 || "",
            text7: slide.text7 || "",
            text8: slide.text8 || "",
            order: slide.order ?? 1,
            isVisible: slide.is_visible ?? true,
            isPinned: slide.is_pinned ?? false
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setFormState(initialFormState)
    }

    const handleSubmitSlide = async (e) => {
        e.preventDefault()

        const header = formState.header.trim()
        if (!header) {
            alert("Please provide a headline/title or main image for the slide.")
            return
        }

        const payload = {
            header,
            text1: formState.text1 || "",
            text2: formState.text2 || "",
            text3: formState.text3 || "",
            text4: formState.text4 || "",
            text5: formState.text5 || "",
            text6: formState.text6 || "",
            text7: formState.text7 || "",
            text8: formState.text8 || "",
            image_url: formState.imageUrl || "",
            backgroundSRC: formState.backgroundUrl || "",
            order: Number(formState.order) || slides.length + 1,
            is_visible: formState.isVisible,
            is_pinned: formState.isPinned
        }

        try {
            if (editingId) {
                const { error } = await supabase
                    .from('homepage_slides')
                    .update(payload)
                    .eq('id', editingId)

                if (error) throw error
                alert("Front Page Facade Slide updated successfully!")
            } else {
                const { error } = await supabase
                    .from('homepage_slides')
                    .insert([payload])

                if (error) throw error
                alert("Front Page Facade Slide saved successfully!")
            }

            handleCancelEdit()
            fetchSlides()
        } catch (err) {
            console.error("Error saving slide to Supabase:", err)
            alert(`Failed to save slide: ${err.message || err}`)
        }
    }

    const togglePin = async (id) => {
        const slideToUpdate = slides.find(s => s.id === id)
        if (!slideToUpdate) return
        const updatedPinned = !slideToUpdate.is_pinned

        setSlides(prev => prev.map(s => s.id === id ? { ...s, is_pinned: updatedPinned } : s))

        try {
            const { error } = await supabase
                .from('homepage_slides')
                .update({ is_pinned: updatedPinned })
                .eq('id', id)

            if (error) throw error
        } catch (err) {
            console.error("Error updating pin status:", err)
            alert(`Failed to update pin status: ${err.message || err}`)
            fetchSlides()
        }
    }

    const toggleVisibility = async (id) => {
        const slideToUpdate = slides.find(s => s.id === id)
        if (!slideToUpdate) return
        const updatedVisibility = !slideToUpdate.is_visible

        setSlides(prev => prev.map(s => s.id === id ? { ...s, is_visible: updatedVisibility } : s))

        try {
            const { error } = await supabase
                .from('homepage_slides')
                .update({ is_visible: updatedVisibility })
                .eq('id', id)

            if (error) throw error
        } catch (err) {
            console.error("Error updating visibility:", err)
            alert(`Failed to update visibility: ${err.message || err}`)
            fetchSlides()
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this slide?")) {
            try {
                const { error } = await supabase
                    .from('homepage_slides')
                    .delete()
                    .eq('id', id)

                if (error) throw error
                setSlides(prev => prev.filter(slide => slide.id !== id))
                if (editingId === id) {
                    handleCancelEdit()
                }
            } catch (err) {
                console.error("Error deleting slide:", err)
                alert(`Failed to delete slide: ${err.message || err}`)
            }
        }
    }

    return (
        <div className="Manage-Front-Page-Container">
            <h1> Manage Front Page </h1>
            <p> Add, edit, or configure the order of the slides here.</p>
            <div className="Manage-Front-Page">
                <div className="Add-Front-Page-Slide-Container">
                    <h3> {editingId ? `Edit Facade Slide (ID: ${editingId})` : "Add Front Page Slide"} </h3>
                    <hr />
                    <div className="Front-Page-Fields-Container">
                        <form onSubmit={handleSubmitSlide}>
                            <div className="Front-Page-Fields">
                                <p> HEADLINE / MAIN TITLE </p>
                                <input
                                    type="text"
                                    name="header"
                                    className="Form-Input"
                                    placeholder="e.g. KALYO 2024-2025: ?"
                                    value={formState.header}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="Front-Page-Fields">
                                <p> Main Foreground Image </p>
                                <input
                                    type="text"
                                    name="imageUrl"
                                    className="Form-Input"
                                    placeholder="Paste image link or asset URL..."
                                    value={formState.imageUrl}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="Front-Page-Fields">
                                <p> Background Cover Image </p>
                                <input
                                    type="text"
                                    name="backgroundUrl"
                                    className="Form-Input"
                                    placeholder="Paste background image link..."
                                    value={formState.backgroundUrl}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="Front-Page-Text-Fields">
                                <div>
                                    <p>Text Field 1</p>
                                    <input
                                        type="text"
                                        name="text1"
                                        className="Form-Input"
                                        placeholder="Text Line 1"
                                        value={formState.text1}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <p>Text Field 2</p>
                                    <input
                                        type="text"
                                        name="text2"
                                        className="Form-Input"
                                        placeholder="Text Line 2"
                                        value={formState.text2}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <p>Text Field 3</p>
                                    <input
                                        type="text"
                                        name="text3"
                                        className="Form-Input"
                                        placeholder="Text Line 3"
                                        value={formState.text3}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <p>Text Field 4</p>
                                    <input
                                        type="text"
                                        name="text4"
                                        className="Form-Input"
                                        placeholder="Text Line 4"
                                        value={formState.text4}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <p>Text Field 5</p>
                                    <input
                                        type="text"
                                        name="text5"
                                        className="Form-Input"
                                        placeholder="Text Line 5"
                                        value={formState.text5}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <p>Text Field 6</p>
                                    <input
                                        type="text"
                                        name="text6"
                                        className="Form-Input"
                                        placeholder="Text Line 6"
                                        value={formState.text6}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <p>Text Field 7</p>
                                    <input
                                        type="text"
                                        name="text7"
                                        className="Form-Input"
                                        placeholder="Text Line 7"
                                        value={formState.text7}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <p>Text Field 8</p>
                                    <input
                                        type="text"
                                        name="text8"
                                        className="Form-Input"
                                        placeholder="Text Line 8"
                                        value={formState.text8}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="Front-Page-Fields">
                                <p> Display Order: </p>
                                <input
                                    type="number"
                                    name="order"
                                    className="Form-Input"
                                    style={{ width: '100px' }}
                                    value={formState.order}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="Front-Page-Fields">
                                <p> Visibility: ON / OFF</p>
                                <input
                                    type="checkbox"
                                    name="isVisible"
                                    checked={formState.isVisible}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="Front-Page-Fields">
                                <input
                                    type="checkbox"
                                    name="isPinned"
                                    checked={formState.isPinned}
                                    onChange={handleChange}
                                />
                                Pin On Top
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                <button type="submit" className="Admin-Primary-Button">
                                    {editingId ? "Update Facade Slide" : "Save Facade Slide"}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        className="Btn-Outline Button-Outline"
                                        onClick={handleCancelEdit}
                                        style={{ whiteSpace: 'nowrap' }}
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                </div>

                <div className="Existing-Front-Page-Slide-Container">
                    <h3> Existing Facade Slides ({slides.length})</h3>
                    <hr />
                    <div>
                        {loading ? (
                            <p> Loading... </p>
                        ) : slides.length === 0 ? (
                            <p> No slides found. </p>
                        ) : (
                            slides.map((item) => (
                                <div
                                    key={item.id}
                                    className={`Facade-Item-Card ${item.is_pinned ? 'pinned' : ''} ${!item.is_visible ? 'hidden-item' : ''}`}
                                >
                                    <div className="Item-Main-Info">
                                        <img
                                            src={item.image_url}
                                            alt={item.header}
                                            className="Item-Thumb"
                                        />

                                    </div>
                                    <hr style={{ height: "60%", marginLeft: "1rem" }} className="Vertical-Divider"></hr>
                                    <div className="Item-Text-Details">
                                        <h3>{item.header}</h3>
                                        <p>{item.text1 || item.text2 || "No description text provided"}</p>
                                        <div className="Item-Badges">
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                ID: {item.id}
                                            </span>

                                            <span className="Badge" style={{ background: 'var(--bg-light)', color: 'var(--text-dark)' }}>
                                                Order: #{item.order}
                                            </span>
                                            {item.is_pinned && <span className="Badge Badge-Pinned">📌 Pinned</span>}
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
                                                    onClick={() => togglePin(item.id)}
                                                >
                                                    {item.is_pinned ? 'Unpin' : '📌'}
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

export default ManageFrontPage