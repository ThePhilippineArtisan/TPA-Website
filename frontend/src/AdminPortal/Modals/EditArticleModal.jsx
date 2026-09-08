import React, { useState } from "react"
import { supabase } from "../../supabaseClient"
import { slugify, replaceUnderscore } from "../../utils/slugifyUtils"
import { getArticleUrl } from "../../utils/articleUtils"
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

    const [saving, setSaving] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

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
