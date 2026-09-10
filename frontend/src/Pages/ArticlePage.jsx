import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { supabase } from "../supabaseClient.js"
import { formatDateReadable } from "../utils/dateUtils.js"
import { isMediaSegment, getMediaSegmentLabel, slugify, getCategoryFallbackImage } from "../utils/articleUtils.js"
import AnimatedLoader from "./AnimatedLoader.jsx"
import DOMPurify from "dompurify"
import { sanitizeUrl } from "../utils/stringUtils.js"
import VerticalFastNews from "../Components/VerticalFastNews.jsx"
import NeighboringArticles from "../Components/NeighboringArticles.jsx"
import NewsletterSubscribe from "../Components/NewsletterSubscribe.jsx"
import "../CSS/ArticlePage.css"

const ArticlePage = () => {
    const { articleId, slug } = useParams()
    const navigate = useNavigate()

    const [articleDetails, setArticleDetails] = useState(null)
    const [mediaUrls, setMediaUrls] = useState([])
    const [currentPhoto, setCurrentPhoto] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchArticleDetails = async () => {
            if (!articleId) return

            setIsLoading(true)
            setError(null)

            try {
                const query = supabase
                    .from("article")
                    .select(`
                        *, 
                        article_media (
                            media_order,
                            media (
                                media_id,
                                media_url
                            )
                        )
                    `)

                const idMatch = String(articleId).match(/^(\d+)-/)
                if (idMatch) {
                    query.eq("article_id", parseInt(idMatch[1], 10))
                } else if (/^\d+$/.test(String(articleId))) {
                    query.eq("article_id", parseInt(articleId, 10))
                } else {
                    query.eq("slug_headline", articleId)
                }

                const { data: articleData, error: fetchError } = await query.maybeSingle()

                if (fetchError) throw fetchError
                if (!articleData) {
                    setError("Article not found.")
                    return
                }

                const canonicalSlug = articleData.slug_headline || slugify(articleData.article_headline)

                // If this is a media segment, redirect to media-segment route
                if (isMediaSegment(articleData.article_type)) {
                    const targetUrl = canonicalSlug
                        ? `/media-segment/${articleData.article_id}/${canonicalSlug}`
                        : `/media-segment/${articleData.article_id}`
                    navigate(targetUrl, { replace: true })
                    return
                }

                if (canonicalSlug && slug !== canonicalSlug) {
                    navigate(`/article/${articleData.article_id}/${canonicalSlug}`, { replace: true })
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

                    if (!staffError && staffData) {
                        staffContributions = staffData
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
                    const fallback = getCategoryFallbackImage(articleData.article_type) || "https://media.philartisan.org/sample-photos/1.jpg"
                    setMediaUrls([fallback])
                    setCurrentPhoto(fallback)
                }
            } catch (err) {
                console.error("Error fetching article details: ", err)
                setError(err.message || "An error occurred while fetching the article.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchArticleDetails()
    }, [articleId, slug, navigate])

    if (isLoading) {
        return <AnimatedLoader />
    }

    if (error || !articleDetails) {
        return (
            <div className="Article-Page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", flexDirection: "column" }}>
                <h2>Oops! Article not found.</h2>
                <p style={{ color: "#0265A9", marginTop: "10px" }}>The article you are looking for does not exist.</p>
            </div>
        )
    }

    const getContributorObject = (as) => {
        if (!as.staff) return null
        const displayName = (as.use_pseudonym && as.staff.staff_pseudonym)
            ? as.staff.staff_pseudonym
            : as.staff.staff_display_name
        return { ...as.staff, displayName }
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

    const tags = [
        getMediaSegmentLabel(articleDetails.article_type) || articleDetails.article_type,
        articleDetails.article_tag1,
        articleDetails.article_tag2,
        articleDetails.article_tag3
    ].filter(Boolean)

    const hasBody = Boolean(articleDetails.article_body && articleDetails.article_body.trim() !== "")

    return (
        <div className="Article-Page">
            <div className="Article-Headline">
                <div className="Simple-Tag">
                    <h4>{tags.join(", ").replace(/_/g, " ")}</h4>
                </div>

                <h1>{articleDetails.article_headline}</h1>

                <hr />

                <div className="Author-and-Date">
                    <div className="Author">
                        {authors.length > 0 ? (
                            authors.map((auth, idx) => (
                                <span key={auth.staff_id || idx}>
                                    <Link to={`/staff/${slugify(auth.displayName)}`}>
                                        <h3>{auth.displayName}{idx < authors.length - 1 ? ", " : ""}</h3>
                                    </Link>
                                </span>
                            ))
                        ) : (
                            <a><h3>The Philippine Artisan Staff</h3></a>
                        )}
                    </div>

                    <div className="Date">
                        <a><h3>{formatDateReadable(articleDetails.published_at)}</h3></a>
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
                {currentPhoto && (
                    <div className="Foreground-Photo">
                        <img src={currentPhoto} alt={articleDetails.article_headline} loading="eager" />
                    </div>
                )}
            </div>

            {mediaProviders.length > 0 && (
                <div className="Photo-Illustration-Layout-Credits" style={{ textAlign: "center" }}>
                    Photo by{" "}
                    {mediaProviders.map((med, idx) => (
                        <span key={med.staff_id || idx}>
                            <Link to={`/staff/${slugify(med.displayName)}`}>{med.displayName}</Link>
                            {idx < mediaProviders.length - 1 ? ", " : ""}
                        </span>
                    ))}
                </div>
            )}

            {mediaUrls.length > 1 && (
                <div className="Extra-Photos-Container">
                    <div className="Extra-Photos">
                        {mediaUrls.map((photo, index) => (
                            <img
                                key={index}
                                src={photo}
                                alt={`Photo ${index + 1}`}
                                loading="lazy"
                                onClick={() => setCurrentPhoto(photo)}
                                style={{
                                    cursor: "pointer",
                                    border: photo === currentPhoto ? "3px solid var(--primary-blue, #0265A9)" : "2px solid transparent"
                                }}
                                title={`View Photo ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div 
                className="Below-Small-Photos"
                style={!hasBody ? { gridTemplateColumns: "1fr", width: "100%" } : {}}
            >
                {hasBody ? (
                    <div 
                        className="Article-Body" 
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(articleDetails.article_body) }} 
                    />
                ) : (
                    <div style={{ padding: "1.5rem 0", color: "#64748b", fontStyle: "italic" }}>
                        <p>This is a photo release from The Philippine Artisan.</p>
                    </div>
                )}

                <div style={!hasBody ? { width: "100%" } : {}}>
                    {articleDetails.article_source && (
                        <h4 style={{ marginBottom: "1rem" }}>
                            <span style={{ color: "var(--primary-blue, #0265A9)" }}>
                                Source / Reference:{" "}
                                <a target="_blank" rel="noopener noreferrer" href={sanitizeUrl(articleDetails.article_source)}>
                                    {articleDetails.article_source}
                                </a>
                            </span>
                        </h4>
                    )}

                    <h4>
                        {articleDetails.word_count || 0} words | {Math.ceil((articleDetails.word_count || 0) / 200)} minute read
                    </h4>

                    <hr />

                    <NewsletterSubscribe variant="article" />

                    <div style={{ marginTop: "1.5rem" }}>
                        <VerticalFastNews isHorizontal={!hasBody} />
                    </div>
                </div>
            </div>

            <div style={{ marginLeft: "10%", marginRight: "10%" }}>
                <hr style={{ borderBottom: "2px solid var(--primary-blue, #0265A9)" }} />
            </div>

            {/* Chronological Neighboring Articles Component */}
            <NeighboringArticles 
                currentArticleId={articleDetails.article_id} 
                publishedAt={articleDetails.published_at} 
                isMediaSegment={false} 
            />


        </div>
    )
}

export default ArticlePage
