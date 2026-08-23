import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { supabase } from "../supabaseClient.js"
import { formatDateReadable } from "../utils/dateUtils.js"
import { isMediaSegment, getMediaSegmentLabel, slugify } from "../utils/articleUtils.js"
import AnimatedLoader from "./AnimatedLoader.jsx"

import DOMPurify from "dompurify"
import { sanitizeUrl } from "../utils/stringUtils.js"
import "../CSS/MediaSegmentArticle.css"
import ListOfMediaSegments from "../Components/ListOfMediaSegments.jsx"
import "../CSS/LatestMediaSegment.css"
import VerticalFastNews from "../Components/VerticalFastNews.jsx"

const MediaSegmentArticle = () => {
    const { id, slug } = useParams()
    const navigate = useNavigate()

    const [articleDetails, setArticleDetails] = useState(null)
    const [mediaUrls, setMediaUrls] = useState([])
    const [currentPhoto, setCurrentPhoto] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const hasBody = Boolean(articleDetails?.article_body && articleDetails?.article_body.trim() !== "")

    useEffect(() => {
        const fetchArticleDetails = async () => {
            if (!id) {
                return
            }

            setIsLoading(true)
            setError(null)

            try {
                const query = supabase
                    .from("article")
                    .select(`
                        *, 
                        article_media(
                            media_order,
                            media(
                                media_id,
                                media_url
                            )
                        )
                    `)

                const idMatch = id.match(/^(\d+)-/)
                if (idMatch) {
                    query.eq("article_id", parseInt(idMatch[1], 10))
                } else if (/^\d+$/.test(id)) {
                    query.eq("article_id", parseInt(id, 10))
                } else {
                    query.eq("slug_headline", id)
                }

                const { data: articleData, error: fetchError } = await query.maybeSingle()

                if (fetchError) {
                    throw fetchError
                }
                if (!articleData) {
                    setError("Article not found.")
                    return
                }

                const canonicalSlug = articleData.slug_headline || slugify(articleData.article_headline)

                if (!isMediaSegment(articleData.article_type)) {
                    const targetUrl = canonicalSlug
                        ? `/article/${articleData.article_id}/${canonicalSlug}`
                        : `/article/${articleData.article_id}`
                    navigate(targetUrl, { replace: true })
                    return
                }

                if (canonicalSlug && slug !== canonicalSlug) {
                    navigate(`/media-segment/${articleData.article_id}/${canonicalSlug}`, { replace: true })
                }

                let staffContributions = []
                try {
                    const { data: staffData, error: staffError } = await supabase
                        .from("article_staff")
                        .select(`
                            contribution_as,
                            use_pseudonym,
                            staff (
                                staff_id,
                                staff_display_name,
                                staff_pseudonym,
                                staff_bio,
                                staff_picture
                            )
                        `)
                        .eq("article_id", articleData.article_id)

                    if (staffError) {
                        if (staffError.code === "PGRST200" || staffError.message?.includes("relationship")) {
                            const { data: rawStaffRel, error: rawStaffRelErr } = await supabase
                                .from("article_staff")
                                .select("contribution_as, staff_id, use_pseudonym")
                                .eq("article_id", articleData.article_id)

                            if (!rawStaffRelErr && rawStaffRel && rawStaffRel.length > 0) {
                                const staffIds = rawStaffRel.map(r => r.staff_id).filter(Boolean)
                                const { data: staffRows, error: staffRowsErr } = await supabase
                                    .from("staff")
                                    .select("staff_id, staff_display_name, staff_pseudonym, staff_bio, staff_picture")
                                    .in("staff_id", staffIds)

                                if (!staffRowsErr && staffRows) {
                                    staffContributions = rawStaffRel.map(rel => ({
                                        contribution_as: rel.contribution_as,
                                        use_pseudonym: rel.use_pseudonym,
                                        staff: staffRows.find(s => s.staff_id === rel.staff_id)
                                    })).filter(c => c.staff)
                                }
                            }
                        } else {
                            throw staffError
                        }
                    } else {
                        staffContributions = staffData || []
                    }
                } catch (staffErr) {
                    console.error("Non-blocking error fetching staff contributors:", staffErr)
                }

                setArticleDetails({
                    ...articleData,
                    article_staff: staffContributions
                })

                if (articleData.article_media && articleData.article_media.length > 0) {
                    const sortedMedia = [...articleData.article_media].sort(
                        (a, b) => (a.media_order || 0) - (b.media_order || 0)
                    )
                    const urls = sortedMedia
                        .map(item => item.media?.media_url)
                        .filter(Boolean)
                    setMediaUrls(urls)
                    setCurrentPhoto(urls[0] || null)
                } else {
                    setMediaUrls([])
                    setCurrentPhoto(null)
                }
            } catch (err) {
                console.error("Error fetching article details: ", err)
                setError(err.message || "An error occurred while fetching the article.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchArticleDetails()
    }, [id, navigate])

    if (isLoading) {
        return <AnimatedLoader />
    }

    if (error || !articleDetails) {
        return (
            <div className = "Media-Segment-Article-Page" style = {{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", flexDirection: "column" }}>
                <h2>Oops! Media segment not found.</h2>
                <p style = {{ color: "#0265A9", marginTop: "10px" }}>The media segment you are looking for does not exist.</p>
            </div>
        )
    }

    const getContributorObject = (as) => {
        if (!as.staff) {
            return null
        }
        const displayName = (as.use_pseudonym && as.staff.staff_pseudonym)
            ? as.staff.staff_pseudonym
            : as.staff.staff_display_name
        return {
            ...as.staff,
            displayName
        }
    }

    const authors = articleDetails.article_staff
        ? articleDetails.article_staff
            .filter(as => as.contribution_as === "Author")
            .map(getContributorObject)
            .filter(Boolean)
        : []

    const mediaProviders = articleDetails.article_staff
        ? articleDetails.article_staff
            .filter(as => as.contribution_as === "Media_Provider")
            .map(getContributorObject)
            .filter(Boolean)
        : []

    return (
        <div className = "Media-Segment-Article-Page">
            <div className = "Media-Segment-Article">

                <div className = "Media-Segment-Image">
                    <div className = "Author-and-Details">
                        <div>
                            <span id = "Week-Segment"> {getMediaSegmentLabel(articleDetails.article_type)} </span>
                            <h1> {articleDetails.article_headline} </h1>
                            <div style = {{ display: "flex", justifyContent: "space-between" }}>
                                <p id = "Muted-Text">
                                    Written by {" "}
                                    {authors.length > 0 ? (
                                        authors.map((auth, idx) => (
                                            <span key = {auth.staff_id}>
                                                <Link to = {`/staff/${auth.staff_id}`}>
                                                    {auth.displayName}
                                                    {idx < authors.length - 1 ? ", " : ""}
                                                </Link>
                                            </span>
                                        ))
                                    ) : (
                                        "TPA Staff"
                                    )}
                                </p>
                                {mediaProviders.length > 0 && (
                                    <p id = "Muted-Text">
                                        Photo by {" "}
                                        {mediaProviders.length > 0 ? (
                                            mediaProviders.map((med, idx) => (
                                                <span key = {med.staff_id}>
                                                    <Link to = {`/staff/${med.staff_id}`}>
                                                        {med.displayName}
                                                        {idx < mediaProviders.length - 1 ? ", " : ""}
                                                    </Link>
                                                </span>
                                            ))
                                        ) : (
                                            "TPA Staff"
                                        )}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <img
                        src = {currentPhoto}
                        alt = {articleDetails.article_headline}
                    />
                </div>


                <div 
                    className = "Media-Segment-Article-Below-Photo"
                    style = {!hasBody ? { flexDirection: "column", width: "90%", margin: "0 auto" } : {}}
                >
                    <div className = "Author-and-Details" style = {!hasBody ? { width: "100%", boxSizing: "border-box" } : {}}>
                        <div>
                            {authors.length > 0 && (
                                <div style = {{ marginBottom: "1.5rem" }}>
                                    <h3>
                                        <span>
                                            {authors.length === 1
                                                ? `About ${authors[0].displayName}`
                                                : "About the Authors"}
                                        </span>
                                    </h3>
                                    {authors.map((auth, idx) => (
                                        <div key = {auth.staff_id} style = {{ marginBottom: idx < authors.length - 1 ? "1.5rem" : "0" }}>
                                            {authors.length > 1 && (
                                                <h4 style = {{ color: "#0265A9", fontWeight: "bold", marginBottom: "0.25rem" }}>
                                                    {auth.displayName}
                                                </h4>
                                            )}
                                            <h5 className = "Staff-Bio-Text">{auth.staff_bio || "No bio available."}</h5>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {mediaProviders.length > 0 && (
                                <div style = {{ marginBottom: "1.5rem" }}>
                                    <h3>
                                        <span>
                                            {mediaProviders.length === 1
                                                ? `About ${mediaProviders[0].displayName}`
                                                : "About the Photojournalists"}
                                        </span>
                                    </h3>
                                    {mediaProviders.map((auth, idx) => (
                                        <div key = {auth.staff_id} style = {{ marginBottom: idx < mediaProviders.length - 1 ? "1.5rem" : "0" }}>
                                            {mediaProviders.length > 1 && (
                                                <h4 style = {{ color: "#0265A9", fontWeight: "bold", marginBottom: "0.25rem" }}>
                                                    {auth.displayName}
                                                </h4>
                                            )}
                                            <h5 className = "Staff-Bio-Text">{auth.staff_bio || "No bio available."}</h5>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <h5> Published on <span> {formatDateReadable(articleDetails.published_at)} </span></h5>

                            <h5> {articleDetails.word_count || 0} <span>words</span> | {Math.ceil((articleDetails.word_count || 0) / 200)} <span>min read</span></h5>

                            {articleDetails.article_source && (
                                <h5>
                                    <span>
                                        Click this link to view the <a target = "_blank" href = {sanitizeUrl(articleDetails.article_source)} rel = "noopener noreferrer" style = {{ color: '#0265A9', textDecoration: 'underline' }}>sources</a>, interview, or media used in this article.
                                    </span>
                                </h5>
                            )}
                            <div className = "Sidebar-Fast-News-Section">
                                <hr></hr>
                                <VerticalFastNews isHorizontal = {!hasBody} />
                            </div>
                        </div>
                    </div>
                    {hasBody && (
                        <div className = "Media-Segment-Article-Text" dangerouslySetInnerHTML = {{ __html: DOMPurify.sanitize(articleDetails.article_body) }} />
                    )}

                </div>
            </div>

            <ListOfMediaSegments />
        </div>
    )
}

export default MediaSegmentArticle