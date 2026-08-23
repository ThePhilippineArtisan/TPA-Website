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
                        .slice(0, 6);
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

    const textOnlyFastNews = fastNewsArticles.slice(0, 3);
    const mediaFastNews = fastNewsArticles.slice(3, 6);

    return (
        <div className={`Vertical-Headlines ${isHorizontal ? "horizontal-mode" : ""}`}>

            <div style={{ padding: "2rem 0rem" }}>
                <Link to="/Joseph-Brian-Balut" style={{ fontSize: "1.5rem" }}> BULLETIN BOARD </Link>

                <div className="Vertical-Side-News">
                    <hr className="Vertical-Divider-Side-News" style={{ padding: "1rem 0rem" }} />
                    <a href="https://youtube.com/@AvoirJoseph" target="_blank" rel="noopener noreferrer">
                        Want to join the Philippine Artisan? <br /><br />
                        Click <span style={{ color: '#0265A9' }}>here</span> to be included in the list of our future applicants!
                    </a>
                </div>

                <div className="Vertical-Side-News">
                    <hr className="Vertical-Divider-Side-News" style={{ alignSelf: "center" }} />
                    <a href="https://youtube.com/@AvoirJoseph" target="_blank" rel="noopener noreferrer">
                        Subscribe to our email newsletter for updates inside and outside our university!
                    </a>
                </div>
            </div>

            <div className="Vertical-Fast-News">
                <div className="Vertical-Fast-News-Links">
                    <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0265A9" }} id="Vertical-Fast-News-Links">
                        FAST NEWS
                    </span>

                    {loading ? (
                        <p style={{ fontSize: "0.85rem", color: "#666", padding: "1rem 0" }}>Loading fast news...</p>
                    ) : fastNewsArticles.length === 0 ? (
                        <p style={{ fontSize: "0.85rem", color: "#666", padding: "1rem 0" }}>No fast news available.</p>
                    ) : (
                        (textOnlyFastNews.length > 0 ? textOnlyFastNews : fastNewsArticles.slice(0, 3)).map((article) => (
                            <Link to={getArticleUrl(article)} className="Vertical-Side-News" key={article.article_id}>
                                <hr className="Vertical-Divider-Side-News" />
                                <div className="Vertical-Headlines">
                                    <p>
                                        <span style={{ color: '#0265A9', fontWeight: 800, textTransform: 'uppercase', marginRight: '6px' }}>
                                            {article.article_type ? article.article_type.replace(/_/g, " ") : "FAST NEWS"}:
                                        </span>
                                        {article.article_headline}
                                    </p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {mediaFastNews.length > 0 && (
                    <div className="Vertical-Fast-News-Links">
                        <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0265A9" }}>
                            MORE QUICK READS
                        </span>

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
                                    <div className="Vertical-Headlines">
                                        <p>
                                            <span style={{ color: '#0265A9', fontWeight: 800, textTransform: 'uppercase', marginRight: '6px' }}>
                                                {article.article_type ? article.article_type.replace(/_/g, " ") : "FAST NEWS"}:
                                            </span>
                                            {article.article_headline}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerticalFastNews;