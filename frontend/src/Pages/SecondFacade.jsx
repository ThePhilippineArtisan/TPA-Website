import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { getArticleUrl, isMediaSegment, getMediaSegmentLabel } from "../utils/articleUtils.js";
import { replaceUnderscore } from "../utils/slugifyUtils.js";

import "../CSS/SecondFacade.css";

import Tabs from "../Components/Tabs.jsx";
import VerticalFastNews from "../Components/VerticalFastNews.jsx";
import VideoShowcase from "../Components/VideoShowcase.jsx";
import LatestMediaSegment from "../Components/LatestMediaSegment.jsx";
import ListOfMediaSegments from "../Components/ListOfMediaSegments.jsx";

const isPinnedOrFeatured = (art) => {
    if (!art) return false;
    if (art.is_pinned === true || art.is_pinned === "true" || art.is_pinned === 1) return true;
    const tags = [art.article_tag1, art.article_tag2, art.article_tag3]
        .filter(Boolean)
        .map(t => t.toLowerCase());
    return tags.some(t =>
        t.includes("pinned") || t.includes("pin") || t.includes("featured") || t.includes("feature") || t === "top"
    );
};

const SecondFacade = () => {
    const [latestNews, setLatestNews] = useState(null);
    const [secondaryLatestNews, setSecondaryLatestNews] = useState(null);
    const [secondaryNewsList, setSecondaryNewsList] = useState([]);
    const [opinionArticles, setOpinionArticles] = useState([]);
    const [newsArticles, setNewsArticles] = useState([]);
    const [photoArticles, setPhotoArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFacadeArticles = async () => {
            try {
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
                    .limit(100);

                if (articlesError) throw articlesError;

                if (articlesData && articlesData.length > 0) {
                    const articleIds = articlesData.map(a => a.article_id);

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
                                    staff_pseudonym,
                                    staff_first_name,
                                    staff_last_name
                                )
                            `)
                            .in("article_id", articleIds);

                        if (!staffError && staffData) {
                            staffContributions = staffData;
                        }
                    } catch (staffErr) {
                        console.error("Error fetching staff contributors for facade:", staffErr);
                    }

                    let mediaContributions = [];
                    try {
                        const { data: mediaData, error: mediaError } = await supabase
                            .from("article_media")
                            .select(`
                                article_id,
                                media_order,
                                caption,
                                media (
                                    media_id,
                                    media_url
                                )
                            `)
                            .in("article_id", articleIds)
                            .order("media_order", { ascending: true });

                        if (!mediaError && mediaData) {
                            mediaContributions = mediaData;
                        }
                    } catch (mediaErr) {
                        console.error("Error fetching article media for facade:", mediaErr);
                    }

                    const mappedArticles = articlesData.map(article => {
                        const contributions = staffContributions.filter(
                            sc => sc.article_id === article.article_id
                        );
                        const mediaItems = mediaContributions.filter(
                            mc => mc.article_id === article.article_id
                        );
                        return {
                            ...article,
                            article_staff: contributions,
                            article_media: mediaItems.length > 0 ? mediaItems : (article.article_media || [])
                        };
                    });

                    const getWordCount = (art) => {
                        if (art.word_count && art.word_count > 0) return art.word_count;
                        if (!art.article_body) return 0;
                        const cleanText = art.article_body.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();
                        if (!cleanText) return 0;
                        return cleanText.split(/\s+/).filter(Boolean).length;
                    };

                    const fullNewsArticles = mappedArticles.filter(art => {
                        if (getWordCount(art) < 100) return false;
                        if (isMediaSegment(art.article_type)) return false;
                        return true;
                    });

                    // 1. Pinned Story (allows articles and media segments)
                    let pinnedStory = mappedArticles.find(art => isPinnedOrFeatured(art));
                    let topPrimary = pinnedStory;
                    if (!topPrimary) {
                        topPrimary = fullNewsArticles.length > 0 ? fullNewsArticles[0] : (mappedArticles[0] || null);
                    }
                    setLatestNews(topPrimary);

                    // 2. Another Latest News (most recent long-form news story or article, excluding topPrimary)
                    const anotherCandidate = fullNewsArticles.find(art => art.article_id !== topPrimary?.article_id)
                        || mappedArticles.find(art => art.article_id !== topPrimary?.article_id)
                        || null;
                    setSecondaryLatestNews(anotherCandidate);

                    const reservedTopIds = new Set([topPrimary?.article_id, anotherCandidate?.article_id].filter(Boolean));

                    // 3. Secondary News below Latest News (excluding the two top stories)
                    const candidateSecondaries = mappedArticles.filter(art => {
                        if (reservedTopIds.has(art.article_id)) return false;
                        const isLongForm = getWordCount(art) >= 100;
                        const isSegment = isMediaSegment(art.article_type);
                        return isLongForm || isSegment;
                    });
                    const topSecondaries = candidateSecondaries.slice(0, 2);
                    setSecondaryNewsList(topSecondaries);

                    const opinionList = mappedArticles.filter(art => {
                        if (getWordCount(art) < 100) return false;
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
                    const filteredOpinionList = opinionList.filter(op =>
                        !reservedTopIds.has(op.article_id) && !topSecondaries.some(s => s.article_id === op.article_id)
                    );
                    const selectedOpinion = filteredOpinionList.slice(0, 2);
                    setOpinionArticles(selectedOpinion);

                    const opinionIds = new Set(selectedOpinion.map(op => op.article_id));
                    const reservedIds = new Set([
                        ...reservedTopIds,
                        ...topSecondaries.map(s => s.article_id),
                        ...opinionIds
                    ].filter(Boolean));

                    const multiPhotoArticles = mappedArticles.filter(art => {
                        if (reservedIds.has(art.article_id)) return false;
                        if (isMediaSegment(art.article_type)) return false;
                        const mediaCount = (art.article_media && art.article_media.length) || 0;
                        return mediaCount > 1 || art.article_type === "IN_PHOTOS" || art.article_type === "HIGHLIGHTS";
                    }).slice(0, 3);

                    setPhotoArticles(multiPhotoArticles);

                    const photoIds = new Set(multiPhotoArticles.map(p => p.article_id));

                    const remainingArticles = mappedArticles.filter(art => {
                        if (getWordCount(art) < 100) return false;
                        if (reservedIds.has(art.article_id)) return false;
                        if (photoIds.has(art.article_id)) return false;
                        if (isMediaSegment(art.article_type)) return false;
                        return true;
                    });

                    const isNewsBeatArticle = (art) => {
                        const type = (art.article_type || "").toUpperCase();
                        const tags = [art.article_tag1, art.article_tag2, art.article_tag3]
                            .filter(Boolean)
                            .map(t => t.toLowerCase());

                        const newsTypes = [
                            "LOCAL_NEWS", "LOCAL",
                            "SPORTS_NEWS", "SPORTS",
                            "NATIONAL_NEWS", "NATIONAL",
                            "INTERNATIONAL_NEWS", "INTERNATIONAL", "GLOBAL_NEWS",
                            "UNIVERSITY_NEWS", "UNIVERSITY",
                            "DEVELOPING_STORY", "BREAKING_NEWS"
                        ];

                        if (newsTypes.includes(type)) return true;

                        const newsKeywords = ["local", "sport", "national", "international", "world", "global", "university", "campus", "tup"];
                        return newsKeywords.some(kw => tags.some(t => t.includes(kw)));
                    };

                    const beatArticles = remainingArticles.filter(isNewsBeatArticle);

                    // Ensure at least 4 news articles by backfilling with other long-form journalistic features/reports if beat articles are fewer
                    const fallbackArticles = mappedArticles.filter(art => {
                        if (getWordCount(art) < 100) return false;
                        if (reservedIds.has(art.article_id)) return false;
                        if (photoIds.has(art.article_id)) return false;
                        if (beatArticles.some(b => b.article_id === art.article_id)) return false;
                        return true;
                    });

                    const combinedArticles = [
                        ...beatArticles,
                        ...remainingArticles.filter(a => !beatArticles.includes(a)),
                        ...fallbackArticles
                    ];
                    const finalNewsArticles = combinedArticles.slice(0, 8);

                    setNewsArticles(finalNewsArticles);
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
        if (!article) return 'https://media.philartisan.org/sample-photos/Multification-Invication.jpg';
        if (article.article_media && article.article_media.length > 0) {
            const sorted = [...article.article_media].sort((a, b) => (a.media_order || 0) - (b.media_order || 0));
            const url = sorted[0]?.media?.media_url;
            if (url) return url;
        }
        return 'https://media.philartisan.org/sample-photos/Multification-Invication.jpg';
    };

    const getSortedMedia = (article) => {
        if (!article || !article.article_media || article.article_media.length === 0) {
            return [];
        }
        return [...article.article_media].sort((a, b) => (a.media_order || 0) - (b.media_order || 0));
    };

    const getContributorSurname = (as) => {
        if (!as) return "";
        if (as.use_pseudonym && as.staff?.staff_pseudonym) {
            return as.staff.staff_pseudonym;
        }
        if (as.staff?.staff_last_name && as.staff.staff_last_name.trim()) {
            return as.staff.staff_last_name.trim();
        }
        if (as.staff?.staff_display_name && as.staff.staff_display_name.trim()) {
            const parts = as.staff.staff_display_name.trim().split(/\s+/);
            return parts[parts.length - 1];
        }
        return "";
    };

    const getContributorName = (as) => {
        if (!as) return "";
        if (as.use_pseudonym && as.staff?.staff_pseudonym) {
            return as.staff.staff_pseudonym;
        }
        if (as.staff?.staff_display_name && as.staff.staff_display_name.trim()) {
            return as.staff.staff_display_name.trim();
        }
        const full = `${as.staff?.staff_first_name || ""} ${as.staff?.staff_last_name || ""}`.trim();
        if (full) return full;
        return getContributorSurname(as);
    };

    const formatNameList = (names) => {
        if (!names || names.length === 0) return "";
        if (names.length === 1) return names[0];
        if (names.length === 2) return `${names[0]} & ${names[1]}`;
        if (names.length === 3) return `${names[0]}, ${names[1]}, & ${names[2]}`;
        return `${names.slice(0, 2).join(", ")}, & ${names.length - 2} others`;
    };

    const getSmartCredits = (article) => {
        if (!article || !article.article_staff || article.article_staff.length === 0) {
            return "The Philippine Artisan Staff";
        }

        const authors = article.article_staff
            .filter(as => as.contribution_as === "Author" || as.contribution_as === "Writer")
            .map(getContributorName)
            .filter(Boolean);

        const mediaProviders = article.article_staff
            .filter(as => 
                as.contribution_as === "Media_Provider" ||
                as.contribution_as === "Media Provider" ||
                as.contribution_as === "Photos" ||
                as.contribution_as === "Visuals" ||
                as.contribution_as === "Illustrator" ||
                as.contribution_as === "Designer" ||
                as.contribution_as === "Broadcaster"
            )
            .map(getContributorName)
            .filter(Boolean);

        const authorStr = formatNameList(authors);
        const mediaStr = formatNameList(mediaProviders);

        if (authorStr && mediaStr) {
            if (authorStr === mediaStr) {
                return `${authorStr} (Words & Photos)`;
            }
            return `By ${authorStr} • Photos by ${mediaStr}`;
        }
        if (authorStr) {
            return `By ${authorStr}`;
        }
        if (mediaStr) {
            return `Photos by ${mediaStr}`;
        }

        const allNames = article.article_staff.map(getContributorName).filter(Boolean);
        return allNames.length > 0 ? formatNameList(allNames) : "The Philippine Artisan Staff";
    };

    const getFullCreditsTooltip = (article) => {
        if (!article || !article.article_staff || article.article_staff.length === 0) {
            return "The Philippine Artisan Staff";
        }
        return article.article_staff
            .map(as => {
                const name = getContributorName(as);
                const role = as.contribution_as ? ` (${as.contribution_as.replace(/_/g, " ")})` : "";
                return `${name}${role}`;
            })
            .filter(Boolean)
            .join(", ");
    };

    const getAuthorsString = (article) => {
        return getSmartCredits(article);
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
        const cleanText = article.article_body
            .replace(/<[^>]*>/g, " ")
            .replace(/&nbsp;/g, " ")
            .replace(/\s+/g, " ")
            .trim();
        if (!cleanText) return "";
        if (cleanText.length <= maxLength) return cleanText;
        return cleanText.slice(0, maxLength).trim() + "...";
    };

    const getArticleBeatTag = (article) => {
        if (!article) return "NEWS";
        const type = (article.article_type || "").toUpperCase();
        const tags = [article.article_tag1, article.article_tag2, article.article_tag3]
            .filter(Boolean)
            .map(t => t.toLowerCase());

        if (type === "LOCAL_NEWS" || type === "LOCAL" || tags.some(t => t.includes("local"))) {
            return "LOCAL NEWS";
        }
        if (type === "SPORTS_NEWS" || type === "SPORTS" || tags.some(t => t.includes("sport"))) {
            return "SPORTS NEWS";
        }
        if (type === "NATIONAL_NEWS" || type === "NATIONAL" || tags.some(t => t.includes("national"))) {
            return "NATIONAL NEWS";
        }
        if (type === "INTERNATIONAL_NEWS" || type === "INTERNATIONAL" || tags.some(t => t.includes("international") || t.includes("world") || t.includes("global"))) {
            return "INTERNATIONAL NEWS";
        }
        if (type === "UNIVERSITY_NEWS" || type === "UNIVERSITY" || tags.some(t => t.includes("university") || t.includes("campus") || t.includes("tup"))) {
            return "UNIVERSITY NEWS";
        }
        if (article.article_type) {
            return replaceUnderscore(article.article_type);
        }
        return "NEWS";
    };

    return (
        <div className="Second-Facade">
            <Tabs />

            <div className="Below-Cover-Photo">
                <div className="letterA">
                    <div className="Large-News-Boxes">
                        <div className="Large-Left-News-Column">
                            <Link to="/latest" className="Category"> LATEST NEWS <span>⟶</span> </Link>

                            {/* 1. Pinned or Top Featured Story */}
                            {latestNews ? (
                                <Link to={getArticleUrl(latestNews)} className="Large-Photo-News Featured-Hero-News" style={{ flexWrap: "wrap" }}>
                                    <div className="Featured-Image-Wrapper">
                                        <img
                                            src={getArticleMedia(latestNews)}
                                            alt={latestNews.article_headline}
                                            style={{ width: "100%" }}
                                        />
                                        <div className="Featured-Story-Badge-Row">
                                            <span className={`Featured-Badge ${isPinnedOrFeatured(latestNews) ? "pinned" : "featured"}`}>
                                                {isPinnedOrFeatured(latestNews) ? "PINNED STORY" : "FEATURED"}
                                            </span>
                                            {latestNews.article_type && (
                                                <span className="Featured-Type-Badge">
                                                    {getMediaSegmentLabel(latestNews.article_type)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="Large-News">
                                        <div className="Large-News-Headline">
                                            <p>{latestNews.article_headline}</p>
                                            <div className="Article-Author-Time" title={getFullCreditsTooltip(latestNews)}>
                                                <p>{getSmartCredits(latestNews)} {latestNews.published_at ? `| ${formatDate(latestNews.published_at)}` : ''}</p>
                                            </div>
                                            {(() => {
                                                const excerpt = getArticleExcerpt(latestNews, 180);
                                                if (!excerpt) return null;
                                                return (
                                                    <div className="Sample-Text-Container">
                                                        <hr className="Vertical-Divider" />
                                                        <div className="Sample-Text">
                                                            <p>{excerpt}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <Link to="/latest" className="Large-Photo-News" style={{ flexWrap: "wrap" }}>
                                    <img
                                        src={'https://media.philartisan.org/sample-photos/Multification-Invication.jpg'}
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

                            {/* 2. Another Latest News */}
                            {secondaryLatestNews && (
                                <Link to={getArticleUrl(secondaryLatestNews)} className="Large-Photo-News Featured-Hero-News" style={{ flexWrap: "wrap", marginTop: "1rem" }}>
                                    <div className="Featured-Image-Wrapper">
                                        <img
                                            src={getArticleMedia(secondaryLatestNews)}
                                            alt={secondaryLatestNews.article_headline}
                                            style={{ width: "100%" }}
                                        />
                                        <div className="Featured-Story-Badge-Row">
                                            <span className="Featured-Badge featured">
                                                LATEST NEWS
                                            </span>
                                            {secondaryLatestNews.article_type && (
                                                <span className="Featured-Type-Badge">
                                                    {getMediaSegmentLabel(secondaryLatestNews.article_type)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="Large-News">
                                        <div className="Large-News-Headline">
                                            <p>{secondaryLatestNews.article_headline}</p>
                                            <div className="Article-Author-Time" title={getFullCreditsTooltip(secondaryLatestNews)}>
                                                <p>{getSmartCredits(secondaryLatestNews)} {secondaryLatestNews.published_at ? `| ${formatDate(secondaryLatestNews.published_at)}` : ''}</p>
                                            </div>
                                            {(() => {
                                                const excerpt = getArticleExcerpt(secondaryLatestNews, 180);
                                                if (!excerpt) return null;
                                                return (
                                                    <div className="Sample-Text-Container">
                                                        <hr className="Vertical-Divider" />
                                                        <div className="Sample-Text">
                                                            <p>{excerpt}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </Link>
                            )}

                            {/* 3. Latest Long Form Articles OR Media Segments below that (Sample-Text-Container removed) */}
                            {secondaryNewsList.map((secNews) => (
                                <Link to={getArticleUrl(secNews)} className="Large-Photo-News Secondary-Feature-News" key={secNews.article_id}>
                                    <div className="Secondary-Feature-Image-Wrapper">
                                        <img
                                            loading="lazy"
                                            src={getArticleMedia(secNews)}
                                            alt={secNews.article_headline}
                                        />
                                        <span className="Secondary-Badge">
                                            {isMediaSegment(secNews.article_type)
                                                ? (getMediaSegmentLabel(secNews.article_type) || "MEDIA SEGMENT")
                                                : (getMediaSegmentLabel(secNews.article_type) || "LATEST READ")}
                                        </span>
                                    </div>
                                    <div className="Large-News" style={{ flex: 1 }}>
                                        <div className="Large-News-Headline">
                                            <p style={{ fontSize: "clamp(1rem, 1.25vw, 1.25rem)" }}>{secNews.article_headline}</p>
                                            <div className="Article-Author-Time" title={getFullCreditsTooltip(secNews)}>
                                                <p>{getSmartCredits(secNews)} {secNews.published_at ? `| ${formatDate(secNews.published_at)}` : ''}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
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
                                        <div className="Article-Author-Time" title={getFullCreditsTooltip(opArticle)}>
                                            <p>{getSmartCredits(opArticle)} {opArticle.published_at ? `| ${formatDate(opArticle.published_at)}` : ''}</p>
                                        </div>
                                        {(() => {
                                            const excerpt = getArticleExcerpt(opArticle);
                                            if (!excerpt) return null;
                                            return (
                                                <div className="Sample-Text-Container">
                                                    <hr className="Vertical-Divider" />
                                                    <div className="Sample-Text">
                                                        <p>{excerpt}</p>
                                                    </div>
                                                </div>
                                            );
                                        })()}
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

                {newsArticles.length > 0 && (
                    <div className="News-Section-Container">
                        <Link to="/latest" className="Category"> NEWS <span>⟶</span></Link>

                        {/* Layout 1: Lead Story + 3 Side Stack */}
                        <div className="News-Lead-Stack-Layout">
                            {newsArticles[0] && (
                                <Link to={getArticleUrl(newsArticles[0])} className="News-Hero-Card">
                                    <div className="News-Hero-Image-Wrapper">
                                        <img
                                            loading="lazy"
                                            src={getArticleMedia(newsArticles[0])}
                                            alt={newsArticles[0].article_headline}
                                        />
                                        <span className="Story-Card-Tag">
                                            {getArticleBeatTag(newsArticles[0])}
                                        </span>
                                    </div>
                                    <div className="News-Hero-Content">
                                        <h3 className="News-Hero-Headline">{newsArticles[0].article_headline}</h3>
                                        <div className="Article-Author-Time" title={getFullCreditsTooltip(newsArticles[0])}>
                                            <p>{getAuthorsString(newsArticles[0])} {newsArticles[0].published_at ? `| ${formatDate(newsArticles[0].published_at)}` : ''}</p>
                                        </div>
                                        <p className="News-Hero-Excerpt">
                                            {getArticleExcerpt(newsArticles[0], 220) || "Read the full coverage and special report on The Philippine Artisan."}
                                        </p>
                                        <span className="News-Read-More-Btn">Read Full Story ⟶</span>
                                    </div>
                                </Link>
                            )}

                            {newsArticles.slice(1, 4).length > 0 && (
                                <div className="News-Side-Stack-Column">
                                    {newsArticles.slice(1, 4).map(art => (
                                        <Link to={getArticleUrl(art)} className="News-Stack-Item" key={art.article_id}>
                                            <div className="News-Stack-Image-Wrapper">
                                                <img
                                                    loading="lazy"
                                                    src={getArticleMedia(art)}
                                                    alt={art.article_headline}
                                                />
                                                <span className="News-Stack-Tag">{getArticleBeatTag(art)}</span>
                                            </div>
                                            <div className="News-Stack-Content">
                                                <h4 className="News-Stack-Headline">{art.article_headline}</h4>
                                                <div className="Article-Author-Time" title={getFullCreditsTooltip(art)}>
                                                    <p>{getAuthorsString(art)} {art.published_at ? `| ${formatDate(art.published_at)}` : ''}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Layout 2: The List Thing (Horizontal Wire / Stories List) */}
                        {newsArticles.slice(4).length > 0 && (
                            <div className="News-Wire-Section">
                                <div className="News-Wire-Section-Header">
                                    <span className="News-Wire-Section-Title">MORE STORIES</span>
                                    <hr className="News-Wire-Section-Line" />
                                </div>

                                <div className="News-Wire-List">
                                    {newsArticles.slice(4, 10).map(art => (
                                        <Link to={getArticleUrl(art)} className="News-Wire-Row" key={art.article_id}>
                                            <div className="News-Wire-Thumb-Wrapper">
                                                <img
                                                    loading="lazy"
                                                    src={getArticleMedia(art)}
                                                    alt={art.article_headline}
                                                />
                                                <span className="Story-Card-Tag News-Wire-Tag">
                                                    {getArticleBeatTag(art)}
                                                </span>
                                            </div>
                                            <div className="News-Wire-Body">
                                                <h3 className="News-Wire-Headline">{art.article_headline}</h3>
                                                <div className="Article-Author-Time" title={getFullCreditsTooltip(art)}>
                                                    <p>{getAuthorsString(art)} {art.published_at ? `| ${formatDate(art.published_at)}` : ''}</p>
                                                </div>
                                                <p className="News-Wire-Excerpt">
                                                    {getArticleExcerpt(art, 160) || "Read the latest report and coverage on The Philippine Artisan."}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {photoArticles.length > 0 && (
                    <>
                        <Link to="/latest?filter=In Photos" className="Category"> IN PHOTOS <span>⟶</span></Link>

                        <div className="More-Stories-Grid">
                            {photoArticles.map(art => {
                                const mediaList = getSortedMedia(art);
                                const mainPhoto = mediaList[0]?.media?.media_url || getArticleMedia(art);
                                const previewThumbs = mediaList.slice(1, 4);
                                const extraCount = mediaList.length - 4;

                                return (
                                    <Link to={getArticleUrl(art)} className="Photo-Story-Card" key={art.article_id}>
                                        <div className="Photo-Story-Main-Image">
                                            <img
                                                loading="lazy"
                                                src={mainPhoto}
                                                alt={art.article_headline}
                                            />
                                            <span className="Photo-Count-Badge">
                                                {mediaList.length} Photos
                                            </span>
                                        </div>

                                        {previewThumbs.length > 0 && (
                                            <div className="Photo-Preview-Strip">
                                                {previewThumbs.map((item, idx) => {
                                                    const thumbUrl = item.media?.media_url || mainPhoto;
                                                    const isLast = idx === previewThumbs.length - 1 && extraCount > 0;
                                                    return (
                                                        <div className="Photo-Thumb-Wrapper" key={item.media?.media_id || idx}>
                                                            <img
                                                                loading="lazy"
                                                                src={thumbUrl}
                                                                alt=""
                                                            />
                                                            {isLast && (
                                                                <div className="Photo-Thumb-More-Overlay">
                                                                    +{extraCount}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        <div className="Story-Card-Content">
                                            <h3 className="Story-Card-Headline">{art.article_headline}</h3>
                                            <div className="Article-Author-Time" title={getFullCreditsTooltip(art)}>
                                                <p>{getAuthorsString(art)} {art.published_at ? `| ${formatDate(art.published_at)}` : ''}</p>
                                            </div>
                                            <p className="Story-Card-Excerpt">
                                                {getArticleExcerpt(art, 110) || "Explore the photo report and visual highlights on The Philippine Artisan."}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
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
