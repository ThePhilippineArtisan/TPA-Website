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
import EditArticleModal from "../AdminPortal/Modals/EditArticleModal.jsx"
import "../CSS/ArticlePage.css"

const ArticlePage = () => {
    const { articleId, slug } = useParams()
    const navigate = useNavigate()

    const [articleDetails, setArticleDetails] = useState(null)
    const [mediaUrls, setMediaUrls] = useState([])
    const [currentPhoto, setCurrentPhoto] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsAdmin(Boolean(session))
        })
    }, [])

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

    return (
        <div className="Article-Page">
            <div className="Article-Header-Section">
                <span className="Article-Category-Tag">
                    {getMediaSegmentLabel(articleDetails.article_type) || articleDetails.article_type || "News"}
                </span>
                <h1 className="Article-Title">{articleDetails.article_headline}</h1>
                <div className="Article-Meta-Bar">
                    <p className="Article-Author">
                        By{" "}
                        {authors.length > 0 ? (
                            authors.map((auth, idx) => (
                                <span key={auth.staff_id}>
                                    <Link to={`/staff/${slugify(auth.displayName)}`}>{auth.displayName}</Link>
                                    {idx < authors.length - 1 ? ", " : ""}
                                </span>
                            ))
                        ) : (
                            "The Philippine Artisan Staff"
                        )}
                    </p>
                    <span className="Meta-Dot">•</span>
                    <span className="Article-Date">{formatDateReadable(articleDetails.published_at)}</span>

                    {isAdmin && (
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(true)}
                            style={{
                                marginLeft: "auto",
                                padding: "0.35rem 0.85rem",
                                fontSize: "0.8rem",
                                fontWeight: "700",
                                color: "#ffffff",
                                backgroundColor: "var(--primary-blue, #0265A9)",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                        >
                            Edit Article
                        </button>
                    )}
                </div>
            </div>

            {currentPhoto && (
                <div className="Article-Main-Image-Wrapper">
                    <img src={currentPhoto} alt={articleDetails.article_headline} className="Article-Main-Image" />
                    {mediaProviders.length > 0 && (
                        <p className="Image-Credit">
                            Photo by{" "}
                            {mediaProviders.map((med, idx) => (
                                <span key={med.staff_id}>
                                    <Link to={`/staff/${slugify(med.displayName)}`}>{med.displayName}</Link>
                                    {idx < mediaProviders.length - 1 ? ", " : ""}
                                </span>
                            ))}
                        </p>
                    )}

                    {mediaUrls.length > 1 && (
                        <div className="Article-Photo-Gallery-Strip" style={{
                            display: "flex",
                            gap: "0.5rem",
                            marginTop: "0.75rem",
                            overflowX: "auto",
                            paddingBottom: "0.5rem"
                        }}>
                            {mediaUrls.map((url, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setCurrentPhoto(url)}
                                    style={{
                                        border: currentPhoto === url ? "3px solid #0265A9" : "2px solid #e2e8f0",
                                        borderRadius: "4px",
                                        padding: 0,
                                        background: "none",
                                        cursor: "pointer",
                                        overflow: "hidden",
                                        width: "68px",
                                        height: "50px",
                                        flexShrink: 0,
                                        opacity: currentPhoto === url ? 1 : 0.7,
                                        transition: "all 0.15s ease"
                                    }}
                                    title={`View Photo ${idx + 1}`}
                                >
                                    <img
                                        src={url}
                                        alt={`Thumbnail ${idx + 1}`}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="Article-Body-Container">
                <div className="Article-Main-Column">
                    {articleDetails.article_body ? (
                        <div 
                            className="Article-Body-Text" 
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(articleDetails.article_body) }} 
                        />
                    ) : (
                        <p className="No-Body-Text">No article content available.</p>
                    )}

                    {articleDetails.article_source && (
                        <div className="Article-Source-Box">
                            <span>
                                Source / Reference:{" "}
                                <a href={sanitizeUrl(articleDetails.article_source)} target="_blank" rel="noopener noreferrer">
                                    {articleDetails.article_source}
                                </a>
                            </span>
                        </div>
                    )}

                    <NewsletterSubscribe variant="article" />
                </div>

                <div className="Article-Sidebar-Column">
                    <VerticalFastNews isHorizontal={false} />
                </div>
            </div>

            {/* Chronological Neighboring Articles Component */}
            <NeighboringArticles 
                currentArticleId={articleDetails.article_id} 
                publishedAt={articleDetails.published_at} 
                isMediaSegment={false} 
            />

            {isEditModalOpen && (
                <EditArticleModal
                    article={articleDetails}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={(updated) => setArticleDetails((prev) => ({ ...prev, ...updated }))}
                />
            )}
        </div>
    )
}

export default ArticlePage
