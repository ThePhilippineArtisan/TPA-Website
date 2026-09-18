import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { getArticleUrl, isMediaSegment } from "../utils/articleUtils.js";

import "../CSS/VerticalFastNews.css"

const VerticalFastNews = ({ isHorizontal = false }) => {
    const [fastNewsArticles, setFastNewsArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFastNews = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from("article")
                    .select(`
                        article_id,
                        article_headline,
                        article_type,
                        slug_headline,
                        published_at,
                        word_count,
                        article_media(
                            media_order,
                            media(
                                media_url
                            )
                        )
                    `)
                    .eq("is_published", true)
                    .or("word_count.lte.120,word_count.is.null")
                    .order("published_at", { ascending: false })
                    .limit(20);

                if (error) {
                    console.error("Error fetching fast news articles:", error);
                } else if (data) {
                    // Exclude media segments and take up to 6 fast news articles
                    const filteredArticles = data
                        .filter(article => !isMediaSegment(article.article_type))
                        .slice(0, 8);
                    setFastNewsArticles(filteredArticles);
                }
            } catch (err) {
                console.error("Error in fetchFastNews:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFastNews();
    }, []);

    const formatNumericalDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "";
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const yyyy = d.getFullYear();
        return `${mm}.${dd}.${yyyy}`;
    };

    const textOnlyFastNews = fastNewsArticles.slice(0, 4);
    const mediaFastNews = fastNewsArticles.slice(4, 11);

    return (
        <div className={`Vertical-Headlines ${isHorizontal ? "horizontal-mode" : ""}`}>
            <div className="Vertical-Fast-News">
                <div className="Vertical-Fast-News-Links">
                    <div className="Vertical-Fast-News-Heading" id="Vertical-Fast-News-Links">
                        FAST NEWS
                    </div>

                    {loading ? (
                        <p style={{ fontSize: "0.85rem", color: "#666", padding: "1rem 0" }}>Loading fast news...</p>
                    ) : fastNewsArticles.length === 0 ? (
                        <p style={{ fontSize: "0.85rem", color: "#666", padding: "1rem 0" }}>No fast news available.</p>
                    ) : (
                        (textOnlyFastNews.length > 0 ? textOnlyFastNews : fastNewsArticles.slice(0, 4)).map((article) => (
                            <Link to={getArticleUrl(article)} className="Vertical-Side-News" key={article.article_id}>
                                <hr className="Vertical-Divider-Side-News" />
                                <div className="Vertical-Headlines" style={{ width: "100%" }}>
                                    <div className="FastNews-Header-Row">
                                        <span className="FastNews-Type-Badge">
                                            {article.article_type ? article.article_type.replace(/_/g, " ") : "FAST NEWS"}
                                        </span>
                                        {article.published_at && (
                                            <span className="FastNews-Date-Badge" title={new Date(article.published_at).toLocaleString()}>
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                                </svg>
                                                {formatNumericalDate(article.published_at)}
                                            </span>
                                        )}
                                    </div>
                                    <p className="FastNews-Headline-Text">
                                        {article.article_headline}
                                    </p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {mediaFastNews.length > 0 && (
                    <div className="Vertical-Fast-News-Links">
                        <div className="Vertical-Fast-News-Heading">
                            MORE QUICK READS
                        </div>

                        {mediaFastNews.map((article) => {
                            const sortedMedia = article.article_media
                                ? [...article.article_media].sort((a, b) => (a.media_order || 0) - (b.media_order || 0))
                                : [];
                            const firstMedia = sortedMedia[0]?.media?.media_url;

                            return (
                                <Link to={getArticleUrl(article)} className="Vertical-Side-News" key={article.article_id}>
                                    {firstMedia && (
                                        <img loading="lazy" src={firstMedia} alt={article.article_headline} />
                                    )}
                                    <hr className="Vertical-Divider-Side-News" />
                                    <div className="Vertical-Headlines" style={{ width: "100%" }}>
                                        <div className="FastNews-Header-Row">
                                            <span className="FastNews-Type-Badge">
                                                {article.article_type ? article.article_type.replace(/_/g, " ") : "FAST NEWS"}
                                            </span>
                                            {article.published_at && (
                                                <span className="FastNews-Date-Badge" title={new Date(article.published_at).toLocaleString()}>
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                                    </svg>
                                                    {formatNumericalDate(article.published_at)}
                                                </span>
                                            )}
                                        </div>
                                        <p className="FastNews-Headline-Text">
                                            {article.article_headline}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div >
    );
};

export default VerticalFastNews;