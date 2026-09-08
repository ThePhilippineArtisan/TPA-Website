import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../supabaseClient.js"
import { getArticleUrl, getMediaSegmentLabel, MEDIA_SEGMENT_TYPES, getCategoryFallbackImage } from "../utils/articleUtils.js"
import { formatDateReadable } from "../utils/dateUtils.js"
import "../CSS/NeighboringArticles.css"

const NeighboringArticles = ({ currentArticleId, publishedAt, isMediaSegment = false }) => {
    const [previousArticle, setPreviousArticle] = useState(null)
    const [nextArticle, setNextArticle] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNeighbors = async () => {
            if (!currentArticleId) return
            setLoading(true)

            try {
                // Determine baseline date/timestamp
                const baselineDate = publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString()

                // Query for Previous (Older) Article/Segment
                let prevQuery = supabase
                    .from("article")
                    .select(`
                        article_id,
                        article_headline,
                        slug_headline,
                        article_type,
                        published_at,
                        article_media (
                            media_order,
                            media (
                                media_url
                            )
                        )
                    `)
                    .eq("is_published", true)
                    .neq("article_id", currentArticleId)

                if (isMediaSegment) {
                    prevQuery = prevQuery.in("article_type", MEDIA_SEGMENT_TYPES)
                } else {
                    prevQuery = prevQuery.not("article_type", "in", `(${MEDIA_SEGMENT_TYPES.join(",")})`)
                }

                prevQuery = prevQuery
                    .lte("published_at", baselineDate)
                    .order("published_at", { ascending: false })
                    .order("article_id", { ascending: false })
                    .limit(1)

                const { data: prevData, error: prevErr } = await prevQuery
                if (prevErr) console.error("Error fetching previous article:", prevErr)

                // Query for Next (Newer) Article/Segment
                let nextQuery = supabase
                    .from("article")
                    .select(`
                        article_id,
                        article_headline,
                        slug_headline,
                        article_type,
                        published_at,
                        article_media (
                            media_order,
                            media (
                                media_url
                            )
                        )
                    `)
                    .eq("is_published", true)
                    .neq("article_id", currentArticleId)

                if (isMediaSegment) {
                    nextQuery = nextQuery.in("article_type", MEDIA_SEGMENT_TYPES)
                } else {
                    nextQuery = nextQuery.not("article_type", "in", `(${MEDIA_SEGMENT_TYPES.join(",")})`)
                }

                nextQuery = nextQuery
                    .gte("published_at", baselineDate)
                    .order("published_at", { ascending: true })
                    .order("article_id", { ascending: true })
                    .limit(1)

                const { data: nextData, error: nextErr } = await nextQuery
                if (nextErr) console.error("Error fetching next article:", nextErr)

                if (prevData && prevData.length > 0) {
                    setPreviousArticle(prevData[0])
                } else {
                    setPreviousArticle(null)
                }

                if (nextData && nextData.length > 0) {
                    setNextArticle(nextData[0])
                } else {
                    setNextArticle(null)
                }
            } catch (err) {
                console.error("Error in fetchNeighbors:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchNeighbors()
    }, [currentArticleId, publishedAt, isMediaSegment])

    if (loading || (!previousArticle && !nextArticle)) {
        return null
    }

    const getThumbnail = (article) => {
        if (!article) return null
        if (article.article_media && article.article_media.length > 0) {
            const sorted = [...article.article_media].sort((a, b) => (a.media_order || 0) - (b.media_order || 0))
            const url = sorted[0]?.media?.media_url
            if (url) return url
        }
        return getCategoryFallbackImage(article.article_type) || "https://media.philartisan.org/sample-photos/1.jpg"
    }

    const itemLabel = isMediaSegment ? "Media Segment" : "Article"

    return (
        <section className="Neighboring-Articles-Container">
            <div className="Neighboring-Header">
                <hr className="Neighboring-Divider" />
                <h3>Related & Neighboring {isMediaSegment ? "Media Segments" : "Articles"}</h3>
                <hr className="Neighboring-Divider" />
            </div>

            <div className="Neighboring-Grid">
                {previousArticle ? (
                    <Link to={getArticleUrl(previousArticle)} className="Neighbor-Card Previous">
                        <div className="Neighbor-Direction">
                            <span>← Previous {itemLabel}</span>
                        </div>
                        <div className="Neighbor-Content">
                            <img 
                                src={getThumbnail(previousArticle)} 
                                alt={previousArticle.article_headline} 
                                className="Neighbor-Image" 
                            />
                            <div className="Neighbor-Details">
                                <span className="Neighbor-Badge">
                                    {getMediaSegmentLabel(previousArticle.article_type)}
                                </span>
                                <h4 className="Neighbor-Title">{previousArticle.article_headline}</h4>
                                <span className="Neighbor-Date">{formatDateReadable(previousArticle.published_at)}</span>
                            </div>
                        </div>
                    </Link>
                ) : (
                    <div className="Neighbor-Card Empty">
                        <span className="Neighbor-Direction">← Oldest {itemLabel}</span>
                        <p className="Empty-Text">You are viewing the oldest {itemLabel.toLowerCase()}.</p>
                    </div>
                )}

                {nextArticle ? (
                    <Link to={getArticleUrl(nextArticle)} className="Neighbor-Card Next">
                        <div className="Neighbor-Direction">
                            <span>Next {itemLabel} →</span>
                        </div>
                        <div className="Neighbor-Content">
                            <img 
                                src={getThumbnail(nextArticle)} 
                                alt={nextArticle.article_headline} 
                                className="Neighbor-Image" 
                            />
                            <div className="Neighbor-Details">
                                <span className="Neighbor-Badge">
                                    {getMediaSegmentLabel(nextArticle.article_type)}
                                </span>
                                <h4 className="Neighbor-Title">{nextArticle.article_headline}</h4>
                                <span className="Neighbor-Date">{formatDateReadable(nextArticle.published_at)}</span>
                            </div>
                        </div>
                    </Link>
                ) : (
                    <div className="Neighbor-Card Empty">
                        <span className="Neighbor-Direction">Latest {itemLabel} →</span>
                        <p className="Empty-Text">You are viewing the latest {itemLabel.toLowerCase()}.</p>
                    </div>
                )}
            </div>
        </section>
    )
}

export default NeighboringArticles
