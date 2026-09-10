import React, { useState, useEffect } from "react"
import { supabase } from "../../supabaseClient"
import { slugify, replaceUnderscore } from "../../utils/slugifyUtils"
import { getArticleUrl, isMediaSegment } from "../../utils/articleUtils"
import { compressImage } from "../../utils/imageUtils"
import "./EditArticleModal.css"

const ARTICLE_TYPES = [
    "LOOK",
    "ICYMI",
    "ANNOUNCEMENT",
    "WALANG_PASOK",
    "ADVISORY",
    "ALERT",
    "JUST_IN",
    "HAPPENING_NOW",
    "LOCAL_NEWS",
    "UNIVERSITY_NEWS",
    "NATIONAL_NEWS",
    "INTERNATIONAL_NEWS",
    "SPORTS_NEWS",
    "DEVELOPING_STORY",
    "ERRATUM",
    "MAKATA_MONDAYS",
    "TEK_TUESDAY",
    "WANKJOB_WEDNESDAY",
    "TALA_THURSDAY",
    "FEATURES_FRIDAY",
    "STREAMING_SATURDAY",
    "SPORTS_SUNDAY",
    "OPINION",
    "EDITORIAL"
]

const formatDateTimeLocal = (isoString) => {
    if (!isoString) return ""
    const d = new Date(isoString)
    if (isNaN(d.getTime())) return ""
    // Format YYYY-MM-DDTHH:mm
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    const hours = String(d.getHours()).padStart(2, "0")
    const minutes = String(d.getMinutes()).padStart(2, "0")
    return `${year}-${month}-${day}T${hours}:${minutes}`
}

const countWords = (text) => {
    if (!text) return 0
    const cleanText = text.replace(/<[^>]*>/g, " ").trim()
    const words = cleanText.split(/\s+/).filter(Boolean)
    return words.length
}

const EditArticleModal = ({ article, onClose, onSave }) => {
    if (!article) return null

    const [headline, setHeadline] = useState(article.article_headline || "")
    const [articleType, setArticleType] = useState(article.article_type || "LOCAL_NEWS")
    const [isPublished, setIsPublished] = useState(Boolean(article.is_published))
    const [publishedAt, setPublishedAt] = useState(formatDateTimeLocal(article.published_at))
    const [tag1, setTag1] = useState(article.article_tag1 || "")
    const [tag2, setTag2] = useState(article.article_tag2 || "")
    const [tag3, setTag3] = useState(article.article_tag3 || "")
    const [articleSource, setArticleSource] = useState(article.article_source || "")
    const [body, setBody] = useState(article.article_body || "")

    // Photo Management States
    const [attachedPhotos, setAttachedPhotos] = useState([])
    const [loadingPhotos, setLoadingPhotos] = useState(true)
    const [uploadingNewPhoto, setUploadingNewPhoto] = useState(false)
    const [photoUploadProgress, setPhotoUploadProgress] = useState("")
    const [draggedEditPhotoIndex, setDraggedEditPhotoIndex] = useState(null)

    const [saving, setSaving] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const fetchArticlePhotos = async () => {
        if (!article?.article_id) return
        setLoadingPhotos(true)
        try {
            const { data, error } = await supabase
                .from("article_media")
                .select(`
                    id,
                    article_id,
                    media_id,
                    media_order,
                    caption,
                    media (
                        media_id,
                        media_url,
                        media_altText
                    )
                `)
                .eq("article_id", article.article_id)
                .order("media_order", { ascending: true })

            if (error) throw error
            setAttachedPhotos(data || [])
        } catch (err) {
            console.warn("Could not fetch article photos:", err)
            setAttachedPhotos([])
        } finally {
            setLoadingPhotos(false)
        }
    }

    useEffect(() => {
        fetchArticlePhotos()
    }, [article?.article_id])

    const handleMovePhoto = async (currentIndex, targetIndex) => {
        if (targetIndex < 0 || targetIndex >= attachedPhotos.length) return
        const updated = [...attachedPhotos]
        const [moved] = updated.splice(currentIndex, 1)
        updated.splice(targetIndex, 0, moved)

        const reordered = updated.map((item, idx) => ({
            ...item,
            media_order: idx + 1
        }))
        setAttachedPhotos(reordered)

        try {
            await Promise.all(
                reordered.map(item =>
                    supabase
                        .from("article_media")
                        .update({ media_order: item.media_order })
                        .eq("id", item.id)
                )
            )
        } catch (err) {
            console.error("Error updating photo order:", err)
            fetchArticlePhotos()
        }
    }

    const handleMakeCover = (index) => {
        if (index === 0) return
        handleMovePhoto(index, 0)
    }

    const handleDeletePhoto = async (articleMediaId) => {
        if (!window.confirm("Remove this photo from the article?")) return
        try {
            const { error } = await supabase
                .from("article_media")
                .delete()
                .eq("id", articleMediaId)

            if (error) throw error
            const remaining = attachedPhotos.filter(p => p.id !== articleMediaId)
            const reindexed = remaining.map((item, idx) => ({ ...item, media_order: idx + 1 }))
            setAttachedPhotos(reindexed)

            await Promise.all(
                reindexed.map(item =>
                    supabase.from("article_media").update({ media_order: item.media_order }).eq("id", item.id)
                )
            )
        } catch (err) {
            console.error("Error removing photo:", err)
            alert("Failed to remove photo: " + (err.message || err))
            fetchArticlePhotos()
        }
    }

    const handleAddPhotosToArticle = async (e) => {
        const files = Array.from(e.target.files || [])
        if (!files.length) return

        setUploadingNewPhoto(true)
        try {
            const pubYear = article.published_at ? new Date(article.published_at).getFullYear() : new Date().getFullYear()
            const slug = article.slug_headline || slugify(article.article_headline || "article")
            let folder = `articles/${pubYear}/${slug}`
            if (isMediaSegment(article.article_type)) {
                const segFolder = article.article_type.toLowerCase().replace(/_/g, "-")
                folder = `media-segments/${pubYear}/${segFolder}/${slug}`
            }

            const currentCount = attachedPhotos.length
            const newRecords = []

            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                setPhotoUploadProgress(`Uploading ${i + 1} of ${files.length}...`)

                const compressedBlob = await compressImage(file, 1600, 1600, 0.82, "image/webp")
                const compressedFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp"

                const { data: { session } } = await supabase.auth.getSession()
                const token = session?.access_token

                const presignRes = await fetch("/api/media/presign", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify({
                        filename: compressedFileName,
                        contentType: "image/webp",
                        folder: folder,
                        bucket: "article-photos"
                    })
                })

                if (!presignRes.ok) {
                    throw new Error("Failed to obtain presigned upload URL")
                }

                const { presignedUrl, publicUrl } = await presignRes.json()

                const uploadRes = await fetch(presignedUrl, {
                    method: "PUT",
                    headers: { "Content-Type": "image/webp" },
                    body: compressedBlob
                })

                if (!uploadRes.ok) {
                    throw new Error(`Upload failed with status ${uploadRes.status}`)
                }

                const { data: mediaRow, error: mediaInsertError } = await supabase
                    .from("media")
                    .insert([{ media_url: publicUrl }])
                    .select()
                    .single()

                if (mediaInsertError) throw mediaInsertError

                const nextOrder = currentCount + i + 1
                const { data: amRow, error: amError } = await supabase
                    .from("article_media")
                    .insert([{
                        article_id: article.article_id,
                        media_id: mediaRow.media_id,
                        media_order: nextOrder
                    }])
                    .select(`
                        id,
                        article_id,
                        media_id,
                        media_order,
                        caption,
                        media (
                            media_id,
                            media_url,
                            media_altText
                        )
                    `)
                    .single()

                if (amError) throw amError
                newRecords.push(amRow)
            }

            setAttachedPhotos(prev => [...prev, ...newRecords])
            alert(`Added ${newRecords.length} photo(s) to article!`)
        } catch (err) {
            console.error("Error adding photos to article:", err)
            alert("Error adding photos: " + (err.message || err))
        } finally {
            setUploadingNewPhoto(false)
            setPhotoUploadProgress("")
            e.target.value = ""
        }
    }

    const handleEditPhotoDragStart = (e, index) => {
        setDraggedEditPhotoIndex(index)
        e.dataTransfer.effectAllowed = "move"
    }

    const handleEditPhotoDragOver = (e, index) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }

    const handleEditPhotoDrop = (e, targetIndex) => {
        e.preventDefault()
        if (draggedEditPhotoIndex === null || draggedEditPhotoIndex === targetIndex) {
            setDraggedEditPhotoIndex(null)
            return
        }
        handleMovePhoto(draggedEditPhotoIndex, targetIndex)
        setDraggedEditPhotoIndex(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setErrorMessage("")

        try {
            const trimmedHeadline = headline.trim()
            const newSlug = slugify(trimmedHeadline)
            const isoPublishedAt = publishedAt ? new Date(publishedAt).toISOString() : null
            const calculatedWords = countWords(body)

            const updates = {
                article_headline: trimmedHeadline,
                slug_headline: newSlug,
                article_type: articleType,
                is_published: isPublished,
                published_at: isoPublishedAt,
                article_tag1: tag1.trim() || null,
                article_tag2: tag2.trim() || null,
                article_tag3: tag3.trim() || null,
                article_source: articleSource.trim() || null,
                article_body: body,
                word_count: calculatedWords
            }

            const { data, error } = await supabase
                .from("article")
                .update(updates)
                .eq("article_id", article.article_id)
                .select()
                .single()

            if (error) throw error

            if (onSave) {
                onSave({
                    ...article,
                    ...updates,
                    ...(data || {})
                })
            }
            onClose()
        } catch (err) {
            console.error("Error updating article:", err)
            setErrorMessage(err.message || "Failed to update article. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="Edit-Modal-Overlay" onClick={onClose}>
            <div className="Edit-Modal-Card Edit-Article-Card-Wide" onClick={(e) => e.stopPropagation()}>
                <div className="Edit-Modal-Header">
                    <div>
                        <h2>Edit Article</h2>
                        <span className="Edit-Modal-Subtitle">Article ID: #{article.article_id}</span>
                    </div>
                    <div className="Edit-Modal-Header-Actions">
                        <a
                            href={getArticleUrl(article)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="Edit-Modal-View-Link"
                        >
                            Open Public View
                        </a>
                        <button type="button" className="Edit-Modal-Close-Btn" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>

                {errorMessage && (
                    <div className="Edit-Modal-Error">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="Edit-Modal-Form">
                    <div className="Edit-Form-Group">
                        <label>Headline *</label>
                        <input
                            type="text"
                            required
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            placeholder="Article Headline"
                        />
                    </div>

                    <div className="Edit-Modal-Form-Row">
                        <div className="Edit-Form-Group">
                            <label>Article Type / Section *</label>
                            <select
                                value={articleType}
                                onChange={(e) => setArticleType(e.target.value)}
                            >
                                {ARTICLE_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {replaceUnderscore(type)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="Edit-Form-Group">
                            <label>Publish Date & Time</label>
                            <input
                                type="datetime-local"
                                value={publishedAt}
                                onChange={(e) => setPublishedAt(e.target.value)}
                            />
                        </div>

                        <div className="Edit-Form-Group">
                            <label>Source</label>
                            <input
                                type="text"
                                value={articleSource}
                                onChange={(e) => setArticleSource(e.target.value)}
                                placeholder="e.g. Press Release, TUP Manila"
                            />
                        </div>
                    </div>

                    <div className="Edit-Modal-Form-Row">
                        <div className="Edit-Form-Group">
                            <label>Tag 1</label>
                            <input
                                type="text"
                                value={tag1}
                                onChange={(e) => setTag1(e.target.value)}
                                placeholder="Tag 1"
                            />
                        </div>
                        <div className="Edit-Form-Group">
                            <label>Tag 2</label>
                            <input
                                type="text"
                                value={tag2}
                                onChange={(e) => setTag2(e.target.value)}
                                placeholder="Tag 2"
                            />
                        </div>
                        <div className="Edit-Form-Group">
                            <label>Tag 3</label>
                            <input
                                type="text"
                                value={tag3}
                                onChange={(e) => setTag3(e.target.value)}
                                placeholder="Tag 3"
                            />
                        </div>
                    </div>

                    <div className="Edit-Form-Group">
                        <div className="Edit-Body-Header">
                            <label>Article Body</label>
                            <span className="Edit-Word-Count">Words: {countWords(body)}</span>
                        </div>
                        <textarea
                            rows="10"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Write or edit article content here..."
                            className="Edit-Article-Body-Textarea"
                        />
                    </div>

                    {/* Attached Photos & Media Section */}
                    <div className="Edit-Article-Photos-Section">
                        <div className="Edit-Article-Photos-Header">
                            <div>
                                <h3 style={{ margin: 0, fontSize: "1rem", color: "#0f2c59", fontWeight: 700 }}>
                                    Article Photos ({attachedPhotos.length})
                                </h3>
                                <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "#64748b" }}>
                                    Add, remove, or reorder photos. The first photo (#1) serves as the primary cover.
                                </p>
                            </div>
                            <label className="Edit-Add-Photos-Btn" style={{ opacity: uploadingNewPhoto ? 0.7 : 1 }}>
                                {uploadingNewPhoto ? (photoUploadProgress || "Uploading...") : "+ Add Photos"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    disabled={uploadingNewPhoto}
                                    style={{ display: "none" }}
                                    onChange={handleAddPhotosToArticle}
                                />
                            </label>
                        </div>

                        {photoUploadProgress && (
                            <div className="Edit-Photo-Upload-Notice">
                                🚀 {photoUploadProgress}
                            </div>
                        )}

                        {loadingPhotos ? (
                            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0.5rem 0" }}>Loading article photos...</p>
                        ) : attachedPhotos.length > 0 ? (
                            <div className="Edit-Photos-Grid">
                                {attachedPhotos.map((photoItem, pIdx) => {
                                    const imgUrl = photoItem.media?.media_url
                                    return (
                                        <div
                                            key={photoItem.id}
                                            className={`Edit-Photo-Card ${draggedEditPhotoIndex === pIdx ? 'is-dragging' : ''}`}
                                            draggable
                                            onDragStart={(e) => handleEditPhotoDragStart(e, pIdx)}
                                            onDragOver={(e) => handleEditPhotoDragOver(e, pIdx)}
                                            onDrop={(e) => handleEditPhotoDrop(e, pIdx)}
                                        >
                                            <div className="Edit-Photo-Thumb-Wrapper">
                                                <img src={imgUrl} alt={`Photo ${pIdx + 1}`} draggable={false} />
                                                <span className="Edit-Photo-Badge">
                                                    {pIdx === 0 ? "Cover (#1)" : `#${pIdx + 1}`}
                                                </span>
                                                <button
                                                    type="button"
                                                    className="Edit-Photo-Remove-Btn"
                                                    title="Remove photo"
                                                    onClick={() => handleDeletePhoto(photoItem.id)}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                            <div className="Edit-Photo-Card-Actions">
                                                <button
                                                    type="button"
                                                    className="Edit-Photo-Action-Btn"
                                                    disabled={pIdx === 0}
                                                    title="Move left"
                                                    onClick={() => handleMovePhoto(pIdx, pIdx - 1)}
                                                >
                                                    ◀
                                                </button>
                                                {pIdx !== 0 && (
                                                    <button
                                                        type="button"
                                                        className="Edit-Photo-Action-Btn Make-Cover-Btn"
                                                        title="Set as Cover (#1)"
                                                        onClick={() => handleMakeCover(pIdx)}
                                                    >
                                                        ★
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    className="Edit-Photo-Action-Btn"
                                                    disabled={pIdx === attachedPhotos.length - 1}
                                                    title="Move right"
                                                    onClick={() => handleMovePhoto(pIdx, pIdx + 1)}
                                                >
                                                    ▶
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="Edit-Photos-Empty">
                                No photos currently attached to this article. Click "+ Add Photos" to upload images.
                            </div>
                        )}
                    </div>

                    <div className="Edit-Modal-Toggles-Row">
                        <label className="Edit-Checkbox-Label">
                            <input
                                type="checkbox"
                                checked={isPublished}
                                onChange={(e) => setIsPublished(e.target.checked)}
                            />
                            Published Live
                        </label>
                        <span className="Edit-Publish-Status-Hint">
                            {isPublished ? "Status: Live on Website" : "Status: Draft (Not visible to public)"}
                        </span>
                    </div>

                    <div className="Edit-Modal-Footer">
                        <button
                            type="button"
                            className="Edit-Btn-Cancel"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="Edit-Btn-Save"
                            disabled={saving}
                        >
                            {saving ? "Saving Changes..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditArticleModal
