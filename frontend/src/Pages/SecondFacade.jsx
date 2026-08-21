import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { getArticleUrl } from "../utils/articleUtils.js";

import "../CSS/SecondFacade.css";

import Tabs from "../Components/Tabs.jsx";
import VerticalFastNews from "../Components/VerticalFastNews.jsx";
import VideoShowcase from "../Components/VideoShowcase.jsx";
import LatestMediaSegment from "../Components/LatestMediaSegment.jsx";
import ListOfMediaSegments from "../Components/ListOfMediaSegments.jsx";

const SecondFacade = () => {
    const [latestNews, setLatestNews] = useState(null);
    const [opinionArticles, setOpinionArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFacadeArticles = async () => {
            try {
                // Fetch published articles with media relationships
                const { data: articlesData, error: articlesError } = await supabase
                    .from('article')
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
                    .eq("is_published", true)
                    .order('published_at', { ascending: false })
                    .limit(40);

                if (articlesError) throw articlesError;

                if (articlesData && articlesData.length > 0) {
                    const articleIds = articlesData.map(a => a.article_id);

                    // Fetch staff relationships manually for accurate author display
                    let staffContributions = [];
                    try {
                        const { data: staffData, error: staffError } = await supabase
                            .from("article_staff")
                            .select(`
                                article_id,
                                contribution_as,
                                use_pseudonym,
                                staff(
                                    staff_id,
                                    staff_display_name,
                                    staff_pseudonym
                                )
                            `)
                            .in("article_id", articleIds);

                        if (!staffError && staffData) {
                            staffContributions = staffData;
                        }
                    } catch (staffErr) {
                        console.error("Error fetching staff contributors for facade:", staffErr);
                    }

                    const mappedArticles = articlesData.map(article => {
                        const contributions = staffContributions.filter(
                            sc => sc.article_id === article.article_id
                        );
                        return {
                            ...article,
                            article_staff: contributions
                        };
                    });

                    // Helper to compute word count of article_body
                    const getWordCount = (art) => {
                        if (art.word_count && art.word_count > 0) return art.word_count;
                        if (!art.article_body) return 0;
                        const cleanText = art.article_body.replace(/<[^>]*>/g, " ").trim();
                        if (!cleanText) return 0;
                        return cleanText.split(/\s+/).filter(Boolean).length;
                    };

                    // 1. Filter latest article with >= 100 words (excluding fast news)
                    const fullArticles = mappedArticles.filter(art => getWordCount(art) >= 100);
                    const topNews = fullArticles.length > 0 ? fullArticles[0] : mappedArticles[0];
                    setLatestNews(topNews || null);

                    // 2. Filter Opinion & Editorial articles only
                    const opinionList = mappedArticles.filter(art => {
                        const type = (art.article_type || "").toUpperCase();
                        const tag1 = (art.article_tag1 || "").toLowerCase();
                        const tag2 = (art.article_tag2 || "").toLowerCase();
                        const tag3 = (art.article_tag3 || "").toLowerCase();
                        
                        return (
                            type === "EDITORIAL" ||
                            type === "OPINION" ||
                            tag1.includes("opinion") || tag1.includes("editorial") ||
                            tag2.includes("opinion") || tag2.includes("editorial") ||
                            tag3.includes("opinion") || tag3.includes("editorial")
                        );
                    });
                    setOpinionArticles(opinionList.slice(0, 2));
                }
            } catch (err) {
                console.error("Error fetching facade articles:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFacadeArticles();
    }, []);

    const getArticleMedia = (article) => {
        if (!article) return 'https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/Multification-Invication.jpg';
        if (article.article_media && article.article_media.length > 0) {
            const sorted = [...article.article_media].sort((a, b) => (a.media_order || 0) - (b.media_order || 0));
            const url = sorted[0]?.media?.media_url;
            if (url) return url;
        }
        return 'https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/Multification-Invication.jpg';
    };

    const getAuthorsString = (article) => {
        if (!article || !article.article_staff || article.article_staff.length === 0) {
            return "The Philippine Artisan Staff";
        }
        const authors = article.article_staff
            .filter(as => as.contribution_as === "Author")
            .map(as => {
                if (as.use_pseudonym && as.staff?.staff_pseudonym) return as.staff.staff_pseudonym;
                return as.staff?.staff_display_name;
            })
            .filter(Boolean);
        return authors.length > 0 ? authors.join(", ") : "The Philippine Artisan Staff";
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    };

    const getArticleExcerpt = (article, maxLength = 220) => {
        if (!article || !article.article_body) return "";
        const cleanText = article.article_body.replace(/<[^>]*>/g, " ").trim();
        if (cleanText.length <= maxLength) return cleanText;
        return cleanText.slice(0, maxLength).trim() + "...";
    };

    return (
        <div className="Second-Facade">
            <Tabs />

            <div className="Below-Cover-Photo">
                <div className="letterA">
                    <div className="Large-News-Boxes">
                        <div className="Large-Left-News-Column">
                            <Link to="/latest" className="Category"> LATEST NEWS <span>⟶</span> </Link>

                            {latestNews ? (
                                <Link to={getArticleUrl(latestNews)} className="Large-Photo-News" style={{ flexWrap: "wrap" }}>
                                    <img
                                        src={getArticleMedia(latestNews)}
                                        alt={latestNews.article_headline}
                                        style={{ width: "100%" }}
                                    />
                                    <div className="Large-News">
                                        <div className="Large-News-Headline">
                                            <p>{latestNews.article_headline}</p>
                                            <div className="Article-Author-Time">
                                                <p>{getAuthorsString(latestNews)} {latestNews.published_at ? `| ${formatDate(latestNews.published_at)}` : ''}</p>
                                            </div>
                                            {latestNews.article_body && (
                                                <div className="Sample-Text-Container">
                                                    <hr className="Vertical-Divider" />
                                                    <div className="Sample-Text">
                                                        <p>{getArticleExcerpt(latestNews)}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <Link to="/latest" className="Large-Photo-News" style={{ flexWrap: "wrap" }}>
                                    <img
                                        src={'https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/Multification-Invication.jpg'}
                                        style={{ width: "100%" }}
                                        alt="Latest News"
                                    />
                                    <div className="Large-News">
                                        <div className="Large-News-Headline">
                                            <p>LOOK: TUP Manila concludes 120th commencement exercises with graduates from CLA, COS, and graduate programs</p>
                                            <div className="Article-Author-Time">
                                                <p>TPA Staff | September 11, 2025</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>

                    <VerticalFastNews />
                </div>

                {opinionArticles.length > 0 && (
                    <>
                        <Link to="/latest" className="Category"> OPINION & EDITORIAL <span>⟶</span></Link>

                        {opinionArticles.map((opArticle, idx) => (
                            <Link to={getArticleUrl(opArticle)} className="Large-Photo-News" key={opArticle.article_id || idx}>
                                {idx % 2 === 0 && <hr className="Vertical-Divider" />}
                                {idx % 2 === 0 && (
                                    <img
                                        loading="lazy"
                                        src={getArticleMedia(opArticle)}
                                        alt={opArticle.article_headline}
                                    />
                                )}

                                <div className="Large-News">
                                    <div className="Large-News-Headline">
                                        <p>{opArticle.article_headline}</p>
                                        <div className="Article-Author-Time">
                                            <p>{getAuthorsString(opArticle)} {opArticle.published_at ? `| ${formatDate(opArticle.published_at)}` : ''}</p>
                                        </div>
                                        {opArticle.article_body && (
                                            <div className="Sample-Text-Container">
                                                <hr className="Vertical-Divider" />
                                                <div className="Sample-Text">
                                                    <p>{getArticleExcerpt(opArticle)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {idx % 2 === 1 && (
                                    <img
                                        loading="lazy"
                                        src={getArticleMedia(opArticle)}
                                        alt={opArticle.article_headline}
                                    />
                                )}
                                {idx % 2 === 1 && <hr className="Vertical-Divider" />}
                            </Link>
                        ))}
                    </>
                )}
            </div>

            <VideoShowcase />
            <LatestMediaSegment />
            <ListOfMediaSegments />
        </div>
    );
};

export default SecondFacade;
