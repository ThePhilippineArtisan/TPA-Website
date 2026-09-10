import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import { replaceUnderscore, slugify } from "../utils/slugifyUtils"
import { compressImage, uploadToR2Storage } from "../utils/imageUtils.js"
import { formatDateReadable, formatRelativeTime } from "../utils/dateUtils"
import { isMediaSegment } from "../utils/articleUtils"

import BOLD from "../assets/Miniature_Icon_Version/Bold.svg"
import ITALIC from "../assets/Miniature_Icon_Version/Italic.svg"
import EMDASH from "../assets/Miniature_Icon_Version/EmDash.svg"
import SUPERSCRIPT from "../assets/Miniature_Icon_Version/Superscript.svg"
import SUBSCRIPT from "../assets/Miniature_Icon_Version/Subscript.svg"
import HIGHLIGHT from "../assets/Miniature_Icon_Version/Highlight.svg"
import BULLET from "../assets/Miniature_Icon_Version/Bullet.svg"
import NUMBERED from "../assets/Miniature_Icon_Version/Numbered.svg"
import REFERENCE from "../assets/Miniature_Icon_Version/reference.svg"
import ATTACH from "../assets/Miniature_Icon_Version/Attach-File.svg"

import Author from "../assets/Miniature_Icon_Version/Author.svg"
import MediaProvider from "../assets/Miniature_Icon_Version/MediaProvider.svg"

import "../AdminPortal/CreateArticlePage.css"
import StaffModal from "./Modals/SelectStaffersModal.jsx"
import SelectPubmatModal from "./Modals/SelectPubmatModal.jsx"

const CreateArticlePage = () => {

    // container for all staff
    const [staff, setStaff] = useState([]);

    // fetch all staffers with qualifiers
    useEffect(() => {
        const fetchStaff = async () => {
            let { data, error } = await supabase
                .from('staff')
                .select('staff_id, staff_display_name, staff_pseudonym, staff_position, staff_order')
                .eq('staff_isactive', true)
                .order('staff_order', { ascending: true })

            if (error) {
                console.log('Error fetching staffers: ', error)
            } else {
                setStaff(data)
            }
        }

        fetchStaff() // everytime you initiate fetchStaff, you call it immediately after before component can be seen
    }, [])

    // container for selected authors and media providers
    const [selectedAuthors, setSelectedAuthors] = useState([])
    const [selectedMediaProviders, setSelectedMediaProviders] = useState([])

    // container for headline and body, initially empty string
    const [headline, setHeadline] = useState("")
    const [body, setBody] = useState("")
    const [articleType, setArticleType] = useState("LOOK")

    // container for photo/s, initially empty array
    const [mediaImagePhoto, setMediaImagePhoto] = useState([])

    // Reusable Pubmat for single photo posts / storage saving
    const [selectedPubmat, setSelectedPubmat] = useState(null)
    const [isPubmatModalOpen, setIsPubmatModalOpen] = useState(false)

    const [tag1, setTag1] = useState("")
    const [tag2, setTag2] = useState("")
    const [tag3, setTag3] = useState("")
    const [isPhotoOnly, setIsPhotoOnly] = useState(false)

    const [articleSource, setArticleSource] = useState("")

    // Reordering & progress states for photos
    const [isCompressingPhotos, setIsCompressingPhotos] = useState(false)
    const [compressingCount, setCompressingCount] = useState(0)
    const [uploadStatusText, setUploadStatusText] = useState("")
    const [draggedPhotoIndex, setDraggedPhotoIndex] = useState(null)

    // Move any attached photo to primary position (index 0)
    const handleSetAsCover = (indexToPromote) => {
        if (indexToPromote === 0) return
        setMediaImagePhoto(prev => {
            const chosen = prev[indexToPromote]
            const remaining = prev.filter((_, idx) => idx !== indexToPromote)
            return [chosen, ...remaining]
        })
    }

    const handleMoveImageUp = (index) => {
        if (index === 0) return
        setMediaImagePhoto(prev => {
            const updated = [...prev]
            const temp = updated[index]
            updated[index] = updated[index - 1]
            updated[index - 1] = temp
            return updated
        })
    }

    const handleMoveImageDown = (index) => {
        setMediaImagePhoto(prev => {
            if (index >= prev.length - 1) return prev
            const updated = [...prev]
            const temp = updated[index]
            updated[index] = updated[index + 1]
            updated[index + 1] = temp
            return updated
        })
    }

    const handlePhotoDragStart = (e, index) => {
        setDraggedPhotoIndex(index)
        e.dataTransfer.effectAllowed = "move"
    }

    const handlePhotoDragOver = (e, index) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }

    const handlePhotoDrop = (e, targetIndex) => {
        e.preventDefault()
        if (draggedPhotoIndex === null || draggedPhotoIndex === targetIndex) {
            setDraggedPhotoIndex(null)
            return
        }
        setMediaImagePhoto(prev => {
            const updated = [...prev]
            const [moved] = updated.splice(draggedPhotoIndex, 1)
            updated.splice(targetIndex, 0, moved)
            return updated
        })
        setDraggedPhotoIndex(null)
    }

    // General file upload from toolbar
    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files)
        if (!files.length) return

        setIsCompressingPhotos(true)
        setCompressingCount(files.length)
        try {
            const compressedResults = await Promise.all(
                files.map(async (file) => {
                    const compressedBlob = await compressImage(file)
                    const previewUrl = URL.createObjectURL(compressedBlob)
                    return {
                        file: compressedBlob,
                        name: file.name.replace(/\.[^/.]+$/, "") + ".webp",
                        preview: previewUrl
                    }
                })
            )
            setMediaImagePhoto(prev => [...prev, ...compressedResults])
        } catch (error) {
            console.error("Image compression error: ", error)
            alert("Error compressing images: " + error.message)
        } finally {
            setIsCompressingPhotos(false)
            setCompressingCount(0)
            e.target.value = ""
        }
    }

    const handleRemoveImage = (indexToRemove) => {
        setMediaImagePhoto(prev => {
            return prev.filter((imgObj, idx) => {
                if (idx === indexToRemove) {
                    if (imgObj.preview) {
                        URL.revokeObjectURL(imgObj.preview)
                    }
                    return false
                }
                return true
            })
        })
    }

    // Modal states for authors and media providers
    const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false)
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)

    const [scheduledTime, setScheduledTime] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [publishedUrl, setPublishedUrl] = useState("")

    const countWords = (htmlString) => {
        if (!htmlString) return 0

        const cleanText = htmlString.replace(/<\/?[^>]+(>|$)/g, " ")

        const words = cleanText.trim().split(/\s+/)
        return words[0] === "" ? 0 : words.length
    }

    // multiple consecutive supabase inserts and updates
    const addNewArticle = async (isPublishedStatus) => {
        if (!headline) {
            alert("Please enter a headline before submitting.")
            return
        }

        setIsUploading(true)

        try {
            const generatedSlug = slugify(headline)

            let finalTag1 = tag1
            let finalTag2 = tag2
            let finalTag3 = tag3

            if (isPhotoOnly) {
                if (!finalTag1) {
                    finalTag1 = "SET_PHOTO_ONLY"
                } else if (!finalTag2) {
                    finalTag2 = "SET_PHOTO_ONLY"
                } else if (!finalTag3) {
                    finalTag3 = "SET_PHOTO_ONLY"
                }
            }

            const newArticlePayloads = {
                article_headline: headline,
                article_body: body,
                article_type: articleType || null,
                slug_headline: generatedSlug,
                is_published: isPublishedStatus,
                published_at: scheduledTime ? new Date(scheduledTime).toISOString() : undefined,
                // published_by: figure it out
                word_count: countWords(body),
                article_tag1: finalTag1,
                article_tag2: finalTag2,
                article_tag3: finalTag3,
                article_source: articleSource,
                // edit_history: probably just json
            }

            // send single row all the article payloads at once
            let { data: articleData, error: articleError } = await supabase
                .from('article')
                .insert([newArticlePayloads])
                .select()
                .single()

            if (articleError) {
                console.log('Error creating new article: ', articleError.message || articleError)
                alert(articleError.message || JSON.stringify(articleError))
                return
            }

            // Inserting in article_staff for credits
            const newArticleId = articleData.article_id

            const authorPayloads = selectedAuthors.map(author => ({
                article_id: newArticleId,
                staff_id: author.staff_id,
                contribution_as: 'Author',
                use_pseudonym: !!author.use_pseudonym
            }))

            const mediaPayloads = selectedMediaProviders.map(media => ({
                article_id: newArticleId,
                staff_id: media.staff_id,
                contribution_as: 'Media_Provider',
                use_pseudonym: !!media.use_pseudonym
            }))

            const allStaffPayloads = [...authorPayloads, ...mediaPayloads] // combines both to be inserted in the article_staff for credits

            if (allStaffPayloads.length > 0) {
                let { error: staffError } = await supabase
                    .from('article_staff')
                    .insert(allStaffPayloads)

                if (staffError) {
                    console.log('Error linking staff: ', staffError)
                    alert(staffError.message || staffError)
                    return
                }
            }

            // Collect and upload images to Cloudflare R2

            const articleMediaPayloads = []

            // If a pubmat was selected, link it directly as primary #1 (zero duplicate uploads)
            let pubmatMediaId = selectedPubmat?.media_id
            if (selectedPubmat?.media_url && !pubmatMediaId) {
                const { data: createdMedia } = await supabase
                    .from("media")
                    .insert([{
                        media_url: selectedPubmat.media_url,
                        media_altText: selectedPubmat.title || "Pubmat Graphic"
                    }])
                    .select()
                    .single()
                if (createdMedia?.media_id) {
                    pubmatMediaId = createdMedia.media_id
                }
            }

            if (pubmatMediaId) {
                articleMediaPayloads.push({
                    article_id: newArticleId,
                    media_id: pubmatMediaId,
                    media_order: 1
                })
            }

            // default to the first one in the array, ?.staff_id optional chaining
            const mediaContributorId = selectedMediaProviders[0]?.staff_id || null

            // Extract the publication year (default to current year if parsing fails or is empty)
            let pubYear = new Date().getFullYear();
            if (scheduledTime) {
                try {
                    pubYear = new Date(scheduledTime).getFullYear();
                } catch (e) {
                    console.error("Error parsing scheduledTime year:", e);
                }
            }

            for (let idx = 0; idx < mediaImagePhoto.length; idx++) {
                const imgObj = mediaImagePhoto[idx]
                const currentOrder = pubmatMediaId ? idx + 2 : idx + 1
                setUploadStatusText(`Uploading photo ${idx + 1} of ${mediaImagePhoto.length}...`)

                try {
                    // Use a single bucket (article-photos) to simplify CORS and public URLs,
                    // but organize files by year and type.
                    const targetBucket = "article-photos"
                    let uploadFolder = `articles/${pubYear}/${generatedSlug}`

                    if (isMediaSegment(articleType)) {
                        const folderName = articleType.toLowerCase().replace(/_/g, "-")
                        uploadFolder = `media-segments/${pubYear}/${folderName}/${generatedSlug}`
                    }

                    const { publicUrl } = await uploadToR2Storage({
                        file: imgObj.file,
                        filename: imgObj.name,
                        folder: uploadFolder,
                        contentType: imgObj.file.type,
                        bucket: targetBucket
                    })

                    // Save image metadata in media table
                    const { data: mediaRow, error: mediaInsertError } = await supabase
                        .from('media')
                        .insert([{
                            media_url: publicUrl
                        }])
                        .select()
                        .single()

                    if (mediaInsertError)
                        throw mediaInsertError

                    // Collect bridging record for article_media
                    articleMediaPayloads.push({
                        article_id: newArticleId, // add this to article_media
                        media_id: mediaRow.media_id,
                        media_order: currentOrder
                    })
                } catch (err) {
                    console.error(`Error uploading image "${imgObj.name}": `, err)
                    alert(`Error uploding image "${imgObj.name}": ` + err.message)
                    return
                }
            }

            // save bridging records in article_media
            if (articleMediaPayloads.length > 0) {
                const { error: amError } = await supabase
                    .from('article_media')
                    .insert(articleMediaPayloads)

                if (amError) {
                    console.error('Error linking article media: ', amError)
                    alert(amError.message)
                    return
                }
            }

            const articlePath = isMediaSegment(articleType)
                ? `/media-segment/${newArticleId}/${generatedSlug}`
                : `/article/${newArticleId}/${generatedSlug}`
            const fullUrl = `${window.location.origin}${articlePath}`

            try {
                await navigator.clipboard.writeText(fullUrl)
            } catch (clipErr) {
                console.warn("Failed to copy automatically to clipboard:", clipErr)
            }

            setPublishedUrl(fullUrl)

            // reset states to null/empty arrays
            setHeadline("")
            setBody("")
            setSelectedAuthors([])
            setSelectedMediaProviders([])
            setScheduledTime("")
            setTag1("")
            setTag2("")
            setTag3("")
            setArticleSource("")
            setSelectedPubmat(null)

            mediaImagePhoto.forEach(imgObj => {
                if (imgObj.preview) {
                    URL.revokeObjectURL(imgObj.preview)
                }
            })
            setMediaImagePhoto([])

            const bodyDiv = document.getElementById("Body-Text")
            if (bodyDiv) bodyDiv.innerHTML = ""
        } catch (err) {
            console.error("Error creating article:", err)
            alert(err.message || err)
        } finally {
            setIsUploading(false)
            setUploadStatusText("")
        }
    }

    return (
        <div className="Entire-Page">
            {publishedUrl && (
                <div className="Success-Banner">
                    <div className="Success-Banner-Content">
                        <div className="Success-Text-Details">
                            <strong>Success! Article uploaded successfully.</strong>
                            <p>You can view your article or copy the link below:</p>
                        </div>
                        <button className="Dismiss-Banner" onClick={() => setPublishedUrl("")} aria-label="Dismiss banner">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div className="Success-Banner-Url-Row">
                        <input
                            type="text"
                            readOnly
                            value={publishedUrl}
                            onClick={(e) => e.target.select()}
                            className="Success-Url-Input"
                        />
                        <button
                            onClick={async () => {
                                try {
                                    await navigator.clipboard.writeText(publishedUrl)
                                    alert("Link copied to clipboard!")
                                } catch (err) {
                                    alert("Could not copy automatically. Please copy the text manually from the box.")
                                }
                            }}
                            className="Success-Copy-Button"
                        >
                            Copy
                        </button>
                    </div>
                </div>
            )}

            <div className="Admin-Article-Create-Layout">
                <div className="Editor-Rectangle">

                <div className="Text-Formatting-Section">
                    <img src={BOLD} />
                    <img src={ITALIC} />
                    <img src={HIGHLIGHT} />
                    <img src={REFERENCE} />
                    <img src={SUBSCRIPT} />
                    <img src={SUPERSCRIPT} />
                    <img src={BULLET} />
                    <img src={NUMBERED} />
                    <img src={EMDASH} />

                    <select name="Article-Type" id="Article-Type" value={articleType} onChange={(e) => setArticleType(e.target.value)}>
                        <option value="LOOK"> LOOK </option>
                        <option value="ICYMI"> ICYMI </option>
                        <option value="ANNOUNCEMENT"> ANNOUNCEMENT </option>
                        <option value="WALANG_PASOK"> WALANG PASOK </option>
                        <option value="ADVISORY"> ADVISORY </option>
                        <option value="ALERT"> ALERT </option>
                        <option value="JUST_IN"> JUST IN </option>
                        <option value="HAPPENING_NOW"> HAPPENING NOW </option>
                        <option value="LOCAL_NEWS"> LOCAL NEWS </option>
                        <option value="UNIVERSITY_NEWS"> UNIVERSITY NEWS </option>
                        <option value="NATIONAL_NEWS"> NATIONAL NEWS </option>
                        <option value="INTERNATIONAL_NEWS"> INTERNATIONAL NEWS </option>
                        <option value="SPORTS_NEWS"> SPORTS NEWS </option>
                        <option value="DEVELOPING_STORY"> DEVELOPING STORY </option>
                        <option value="ERRATUM"> ERRATUM </option>

                        <option value="NULL"> None </option>

                        <option value="MAKATA_MONDAYS"> Makata Mondays </option>
                        <option value="TEK_TUESDAY"> Tek Tuesday </option>
                        <option value="WANKJOB_WEDNESDAY"> Wankjob Wednesday </option>
                        <option value="TALA_THURSDAY"> Tala Thursday</option>
                        <option value="FEATURES_FRIDAY"> Features Friday </option>
                        <option value="STREAMING_SATURDAY"> Streaming Saturday </option>
                        <option value="SPORTS_SUNDAY"> Sports Sunday </option>
                        <option value="OPINION"> OPINION </option>
                        <option value="EDITORIAL"> EDITORIAL </option>
                    </select>

                    <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "#334155", cursor: "pointer", userSelect: "none" }}>
                        <input
                            type="checkbox"
                            checked={isPhotoOnly}
                            onChange={(e) => setIsPhotoOnly(e.target.checked)}
                        />
                        Set Photo Only
                    </label>

                    <button
                        type="button"
                        className="Toolbar-Pubmat-Btn"
                        onClick={() => setIsPubmatModalOpen(true)}
                    >
                        Pubmats{selectedPubmat ? " (1)" : ""}
                    </button>

                    <label
                        htmlFor="file-upload"
                        title="Upload Custom Image or Graphic Card"
                        style={{ display: "flex", alignItems: "center", gap: "0.3rem", cursor: "pointer" }}
                    >
                        <img
                            src={ATTACH}
                            alt="Upload Photo"
                            style={{ cursor: "pointer" }}
                        />
                        <span style={{ fontSize: "0.85rem", color: "#0265A9", fontWeight: "600" }}>Attach Photo</span>

                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                    </label>

                    <img
                        src={Author}
                        alt="Select Author/s"
                        onClick={() =>
                            setIsAuthorModalOpen(true)
                        }

                        style={{ cursor: "pointer" }}
                    />

                    <StaffModal
                        isOpen={isAuthorModalOpen}
                        onClose={() => setIsAuthorModalOpen(false)}
                        staffers={staff}
                        onConfirm={(selectedStaffers) => {
                            setSelectedAuthors(selectedStaffers)
                            setIsAuthorModalOpen(false)
                        }}
                    />

                    <img
                        src={MediaProvider}
                        alt="Select Media Provider/s"
                        onClick={() =>
                            setIsMediaModalOpen(true)
                        }

                        style={{ cursor: "pointer" }}
                    />

                    <StaffModal
                        isOpen={isMediaModalOpen}
                        onClose={() => setIsMediaModalOpen(false)}
                        staffers={staff}
                        onConfirm={(selectedStaffers) => {
                            setSelectedMediaProviders(selectedStaffers)
                            setIsMediaModalOpen(false)
                        }}
                    />

                </div>


                {(selectedAuthors.length > 0 || selectedMediaProviders.length > 0) && (
                    <div className="Selected-Staffers" style={{ padding: "1rem" }}>
                        {selectedAuthors.length > 0 && (
                            <div className="Selected-Authors">
                                <p style={{ fontWeight: "800", textTransform: "uppercase", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                                    Selected Writer(s):
                                </p>
                                {selectedAuthors.map((authorObj, idx) => {
                                    const hasPseudonym = Boolean(authorObj.staff_pseudonym)
                                    const isUsingPseudonym = hasPseudonym && !!authorObj.use_pseudonym
                                    return (
                                        <div key={idx} className="Selected-Staff-Card" style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            background: '#ffffff',
                                            border: '2px solid var(--border-color)',
                                            borderRadius: 'var(--radius-md)',
                                            padding: '0.5rem 0.8rem',
                                            marginBottom: '0.5rem',
                                            boxShadow: '2px 2px 0px #000'
                                        }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <strong style={{ fontSize: '0.9rem' }}>{authorObj.staff_display_name}</strong>
                                                {hasPseudonym ? (
                                                    <span style={{ fontSize: '0.75rem', color: '#666' }}>
                                                        Pseudonym: <em>{authorObj.staff_pseudonym}</em>
                                                    </span>
                                                ) : (
                                                    <span style={{ fontSize: '0.75rem', color: '#999', fontStyle: 'italic' }}>
                                                        No pseudonym configured
                                                    </span>
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                disabled={!hasPseudonym}
                                                onClick={() => {
                                                    if (!hasPseudonym) return
                                                    const updated = [...selectedAuthors]
                                                    updated[idx] = { ...updated[idx], use_pseudonym: !isUsingPseudonym }
                                                    setSelectedAuthors(updated)
                                                }}
                                                style={{
                                                    padding: '0.35rem 0.75rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '800',
                                                    cursor: hasPseudonym ? 'pointer' : 'not-allowed',
                                                    border: '2px solid #000',
                                                    background: !hasPseudonym ? '#e5e5e5' : isUsingPseudonym ? '#0265A9' : '#f0f0f0',
                                                    color: !hasPseudonym ? '#888888' : isUsingPseudonym ? '#ffffff' : '#333333',
                                                    transition: 'all 0.15s ease',
                                                    boxShadow: hasPseudonym ? '1px 1px 0px #000' : 'none'
                                                }}
                                            >
                                                {!hasPseudonym
                                                    ? `No Pseudonym Set`
                                                    : isUsingPseudonym
                                                        ? `Pseudonym (${authorObj.staff_pseudonym})`
                                                        : `Real Name (${authorObj.staff_display_name})`
                                                }
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {selectedMediaProviders.length > 0 && (
                            <div className="Selected-Media-Providers" style={{ marginTop: selectedAuthors.length > 0 ? "1rem" : "0" }}>
                                <p style={{ fontWeight: "800", textTransform: "uppercase", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                                    Selected Media Provider(s):
                                </p>
                                {selectedMediaProviders.map((mediaObj, idx) => {
                                    const hasPseudonym = Boolean(mediaObj.staff_pseudonym)
                                    const isUsingPseudonym = hasPseudonym && !!mediaObj.use_pseudonym
                                    return (
                                        <div key={idx} className="Selected-Staff-Card" style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            background: '#ffffff',
                                            border: '2px solid var(--border-color)',
                                            borderRadius: 'var(--radius-md)',
                                            padding: '0.5rem 0.8rem',
                                            marginBottom: '0.5rem',
                                            boxShadow: '2px 2px 0px #000'
                                        }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <strong style={{ fontSize: '0.9rem' }}>{mediaObj.staff_display_name}</strong>
                                                {hasPseudonym ? (
                                                    <span style={{ fontSize: '0.75rem', color: '#666' }}>
                                                        Pseudonym: <em>{mediaObj.staff_pseudonym}</em>
                                                    </span>
                                                ) : (
                                                    <span style={{ fontSize: '0.75rem', color: '#999', fontStyle: 'italic' }}>
                                                        No pseudonym configured
                                                    </span>
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                disabled={!hasPseudonym}
                                                onClick={() => {
                                                    if (!hasPseudonym) return
                                                    const updated = [...selectedMediaProviders]
                                                    updated[idx] = { ...updated[idx], use_pseudonym: !isUsingPseudonym }
                                                    setSelectedMediaProviders(updated)
                                                }}
                                                style={{
                                                    padding: '0.35rem 0.75rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '800',
                                                    cursor: hasPseudonym ? 'pointer' : 'not-allowed',
                                                    border: '2px solid #000',
                                                    background: !hasPseudonym ? '#e5e5e5' : isUsingPseudonym ? '#0265A9' : '#f0f0f0',
                                                    color: !hasPseudonym ? '#888888' : isUsingPseudonym ? '#ffffff' : '#333333',
                                                    transition: 'all 0.15s ease',
                                                    boxShadow: hasPseudonym ? '1px 1px 0px #000' : 'none'
                                                }}
                                            >
                                                {!hasPseudonym
                                                    ? `No Pseudonym Set`
                                                    : isUsingPseudonym
                                                        ? `Pseudonym (${mediaObj.staff_pseudonym})`
                                                        : `Real Name (${mediaObj.staff_display_name})`
                                                }
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}

                {(isPhotoOnly || selectedPubmat) && (
                    <div className="Single-Photo-Post-Container">
                        <div className="Single-Photo-Post-Header">
                            <span>Single Photo Post (Pubmat)</span>
                            <div className="Single-Photo-Post-Actions">
                                <button
                                    type="button"
                                    className="Single-Photo-Action-Btn"
                                    onClick={() => setIsPubmatModalOpen(true)}
                                >
                                    {selectedPubmat ? "Change Pubmat" : "Select Pubmat"}
                                </button>
                                {selectedPubmat && (
                                    <button
                                        type="button"
                                        className="Single-Photo-Action-Btn-Remove"
                                        onClick={() => setSelectedPubmat(null)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                        {selectedPubmat ? (
                            <div className="Single-Photo-Post-Preview">
                                <img src={selectedPubmat.media_url || selectedPubmat.preview} alt="Single post pubmat" />
                                {selectedPubmat.title && (
                                    <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#64748b" }}>
                                        Pubmat: <strong>{selectedPubmat.title}</strong>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="Single-Photo-Post-Placeholder">
                                <button
                                    type="button"
                                    className="Single-Photo-Placeholder-Btn"
                                    onClick={() => setIsPubmatModalOpen(true)}
                                >
                                    Select Pubmat
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <div className="Text-Area">
                    <input
                        type="text"
                        placeholder="Enter your new article headline here."
                        id="Headline-Text"
                        className="Headline-Input"
                        value={headline}
                        onChange={(typing) => setHeadline(typing.target.value)}
                    />

                    <div
                        contentEditable
                        suppressContentEditableWarning={true}
                        id="Body-Text"
                        className="Headline-Input"
                        onInput={(typing) => setBody(typing.currentTarget.innerHTML)}
                    >
                    </div>
                    <div className="Article-Tags-Container">
                        <div>
                            <p> Tag 1:
                                <input
                                    value={tag1}
                                    onChange={(typing) => setTag1(typing.target.value)}
                                    className="Article-Tags"
                                />
                            </p>
                        </div>
                        <div>
                            <p> Tag 2:
                                <input
                                    value={tag2}
                                    onChange={(typing) => setTag2(typing.target.value)}
                                    className="Article-Tags"
                                />
                            </p>
                        </div>
                        <div>
                            <p> Tag 3:
                                <input
                                    value={tag3}
                                    onChange={(typing) => setTag3(typing.target.value)}
                                    className="Article-Tags"
                                />
                            </p>
                        </div>
                    </div>

                    <div className="Word-Count-And-Sources">
                        <div className="Word-Count">
                            <p> Word Count: <span> {countWords(body)} </span></p>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="publish-datetime" style={{ fontSize: '0.7rem', fontWeight: '800', fontFamily: 'var(--font-sans)', color: 'black' }}>
                                    PUBLISH DATE & TIME (OPTIONAL):
                                </label>
                                <input
                                    id="publish-datetime"
                                    type="datetime-local"
                                    value={scheduledTime}
                                    onChange={(e) => setScheduledTime(e.target.value)}
                                    style={{ padding: '0.4rem', border: '3px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 'bold' }}
                                />
                            </div>
                        </div>

                        <div>
                            <input
                                className="Article-Tags"
                                placeholder="Sources"
                                value={articleSource}
                                onChange={(typing) => setArticleSource(typing.target.value)}
                                style={{ padding: '0.4rem', border: '3px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 'bold' }}
                            />
                        </div>
                    </div>
                </div>

                <div className="Button-Container">
                    <button type="submit" onClick={() => addNewArticle(false)} disabled={isUploading}>
                        {uploadStatusText ? uploadStatusText : (isUploading ? "Saving Draft..." : "Save as Draft")}
                    </button>
                    <button type="submit" onClick={() => addNewArticle(true)} disabled={isUploading}>
                        {uploadStatusText ? uploadStatusText : (isUploading ? "Posting..." : "Post")}
                    </button>
                </div>

            </div>

            {/* Side Media Panel */}
            <aside className="Admin-Article-Side-Panel">
                <div className="Side-Panel-Header">
                    <h3>Photos ({mediaImagePhoto.length})</h3>
                    <label className="Side-Add-Photos-Btn" style={{ opacity: isCompressingPhotos ? 0.7 : 1 }}>
                        {isCompressingPhotos ? `Compressing (${compressingCount})...` : "+ Add Photos"}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={isCompressingPhotos}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                    </label>
                </div>

                {isCompressingPhotos && (
                    <div className="Side-Compressing-Notice">
                        ⏳ Compressing {compressingCount} photo(s) to WebP...
                    </div>
                )}

                {uploadStatusText && (
                    <div className="Side-Upload-Notice">
                        🚀 {uploadStatusText}
                    </div>
                )}

                {mediaImagePhoto.length > 0 ? (
                    <>
                        <div className="Side-Photos-List">
                            {mediaImagePhoto.map((imgObj, idx) => (
                                <div 
                                    key={idx} 
                                    className={`Side-Photo-Item ${draggedPhotoIndex === idx ? 'is-dragging' : ''}`}
                                    draggable
                                    onDragStart={(e) => handlePhotoDragStart(e, idx)}
                                    onDragOver={(e) => handlePhotoDragOver(e, idx)}
                                    onDrop={(e) => handlePhotoDrop(e, idx)}
                                >
                                    <div className="Side-Photo-Thumb-Wrapper">
                                        <img src={imgObj.preview} alt={`Article media ${idx + 1}`} draggable={false} />
                                        <span className="Side-Photo-Badge">
                                            {idx === 0 ? "Cover (#1)" : `#${idx + 1}`}
                                        </span>
                                    </div>
                                    <div className="Side-Photo-Item-Actions">
                                        <button
                                            type="button"
                                            className="Side-Btn-Action Side-Btn-Arrow"
                                            disabled={idx === 0}
                                            title="Move up"
                                            onClick={() => handleMoveImageUp(idx)}
                                        >
                                            ▲
                                        </button>
                                        <button
                                            type="button"
                                            className="Side-Btn-Action Side-Btn-Arrow"
                                            disabled={idx === mediaImagePhoto.length - 1}
                                            title="Move down"
                                            onClick={() => handleMoveImageDown(idx)}
                                        >
                                            ▼
                                        </button>
                                        {idx !== 0 && (
                                            <button
                                                type="button"
                                                className="Side-Btn-Action"
                                                title="Make primary cover"
                                                onClick={() => handleSetAsCover(idx)}
                                            >
                                                Cover
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="Side-Btn-Action Side-Btn-Delete"
                                            title="Remove image"
                                            onClick={() => handleRemoveImage(idx)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="Side-Photos-Tip">
                            💡 Drag and drop or use ▲ / ▼ to reorder photos. #1 is the article cover.
                        </p>
                    </>
                ) : (
                    <div className="Side-Photos-Empty">
                        No photos added yet. Click "+ Add Photos" to upload multiple images.
                    </div>
                )}
            </aside>
        </div>

        <SelectPubmatModal
            isOpen={isPubmatModalOpen}
            onClose={() => setIsPubmatModalOpen(false)}
            onSelectPubmat={(pubmat) => {
                setSelectedPubmat({
                    media_id: pubmat.media_id,
                    media_url: pubmat.image_url,
                    title: pubmat.title,
                    pubmat_id: pubmat.pubmat_id
                })
            }}
            selectedPubmatId={selectedPubmat?.pubmat_id}
        />
    </div>

)
}

export default CreateArticlePage;