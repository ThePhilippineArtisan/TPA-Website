import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../supabaseClient.js"
import React, { useState, useEffect } from "react"
import { isMediaSegment, getMediaSegmentLabel, getArticleUrl } from "../utils/articleUtils.js"
import { replaceUnderscore } from "../utils/slugifyUtils.js"

import "../CSS/LatestPosts.css"

import CoverPhotoSearch from "../Components/CoverPhotoSearch.jsx";
import Tabs from "../Components/Tabs.jsx"

const filterMap = {
    "Just In": { type: "JUST_IN" },
    "In Case You Missed It!": { type: "ICYMI" },
    "Announcement": { type: "ANNOUNCEMENT" },
    "Advisory": { type: "ADVISORY" },
    "Alert": { type: "ALERT" },
    "Walang Pasok": { type: "WALANG_PASOK", tag: "walang pasok" },
    "Happening Now": { type: "HAPPENING_NOW" },
    "Erratum": { type: "ERRATUM" },
    "University News": { type: "UNIVERSITY_NEWS" },
    "Local News": { type: "LOCAL_NEWS", tag: "local news" },
    "National News": { type: "NATIONAL_NEWS" },
    "International News": { type: "INTERNATIONAL_NEWS" },
    "Sports News": { type: "SPORTS_NEWS" },
    "Developing Story": { type: "DEVELOPING_STORY" },
    "Look": { type: "LOOK", tag: "look" },
    "In Photos": {
        types: ["IN_PHOTOS", "LOOK", "HIGHLIGHTS"],
        tags: ["in photos", "in_photos", "photo", "photos", "look", "highlights"],
        matchMultiPhoto: true
    },
    "Highlights": { type: "HIGHLIGHTS", tag: "highlights" },
    "Editorial": { type: "EDITORIAL", tag: "editorial" },
    "Opinion": { type: "OPINION", tag: "opinion" },
};

const resolveFilterParam = (raw) => {
    if (!raw) return null;
    const clean = raw.trim().toLowerCase().replace(/[-_]/g, " ");
    const match = Object.keys(filterMap).find(k => k.toLowerCase() === clean);
    return match || raw;
};

const LatestPosts = () => {

    const [searchParams] = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedFilters, setSelectedFilters] = useState(() => {
        const raw = searchParams.get("filter");
        const resolved = resolveFilterParam(raw);
        return resolved ? [resolved] : [];
    })
    const [visibleDates, setVisibleDates] = useState(5)

    useEffect(() => {
        const q = searchParams.get("q") || ""
        setSearchQuery(q)
        const filterParam = searchParams.get("filter")
        if (filterParam) {
            const resolved = resolveFilterParam(filterParam);
            if (resolved) {
                setSelectedFilters([resolved]);
            }
        }
    }, [searchParams])

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                // 1. Fetch published articles
                const { data: articlesData, error: articlesError } = await supabase
                    .from('article')
                    .select(`
                        article_id,
                        article_headline,
                        article_type,
                        slug_headline,
                        published_at,
                        article_tag1,
                        article_tag2,
                        article_tag3,
                        article_media(
                            media(
                                media_url
                            )
                        )    
                    `)
                    .eq("is_published", true)
                    .order('published_at', { ascending: false })
                    .limit(150);

                if (articlesError) {
                    throw articlesError;
                }

                if (articlesData && articlesData.length > 0) {
                    const articleIds = articlesData.map(a => a.article_id);

                    let staffContributions = [];
                    try {
                        // 2. Fetch staff contributions
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

                        if (staffError) {
                            // 3. Fallback manually if relationship fetching fails
                            if (staffError.code === "PGRST200" || staffError.message?.includes("relationship")) {
                                const { data: rawStaffRel, error: rawStaffRelErr } = await supabase
                                    .from("article_staff")
                                    .select("article_id, contribution_as, staff_id, use_pseudonym")
                                    .in("article_id", articleIds);

                                if (!rawStaffRelErr && rawStaffRel && rawStaffRel.length > 0) {
                                    const staffIds = [...new Set(rawStaffRel.map(r => r.staff_id).filter(Boolean))];

                                    // Fetch staff details manually
                                    const { data: staffRows, error: staffRowsErr } = await supabase
                                        .from("staff")
                                        .select("staff_id, staff_display_name, staff_pseudonym")
                                        .in("staff_id", staffIds);

                                    if (!staffRowsErr && staffRows) {
                                        staffContributions = rawStaffRel.map(rel => ({
                                            article_id: rel.article_id,
                                            contribution_as: rel.contribution_as,
                                            use_pseudonym: rel.use_pseudonym,
                                            staff: staffRows.find(s => s.staff_id === rel.staff_id)
                                        })).filter(c => c.staff);
                                    }
                                }
                            } else {
                                throw staffError;
                            }
                        } else {
                            // Populate contributions if no error
                            staffContributions = staffData || [];
                        }
                    } catch (staffErr) {
                        console.error("Error fetching staff contributors: ", staffErr);
                    }

                    // 4. Map staff contributions back to articles
                    const mappedArticles = articlesData.map(article => {
                        const contributions = staffContributions.filter(
                            sc => sc.article_id === article.article_id
                        );
                        return {
                            ...article,
                            article_staff: contributions
                        };
                    });

                    setArticles(mappedArticles);
                } else {
                    setArticles([]);
                }
            } catch (err) {
                console.error("Error fetching articles: ", err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const getContributorName = (articlestaff) => {
        if(articlestaff.use_pseudonym && articlestaff.staff?.staff_pseudonym){
            return articlestaff.staff.staff_pseudonym
        }
        return articlestaff.staff?.staff_display_name
    }
    const getAuthorsString = (article) => {
        if (!article.article_staff || article.article_staff.length === 0)
            return "The Philippine Artisan Staff"
        const authors = article.article_staff
            .filter(articlestaff => articlestaff.contribution_as === "Author")
            .map(getContributorName)
            .filter(Boolean)
        return authors.length > 0 ? authors.join(", ") : "TPA Staff"
    }

    const getMedProvString = (article) => {
        if (!article.article_staff || article.article_staff.length === 0)
            return "The Philippine Artisan Staff"
        const MedProvs = article.article_staff
            .filter(articlestaff => articlestaff.contribution_as === "Media_Provider")
            .map(getContributorName)
            .filter(Boolean)
        return MedProvs.length > 0 ? MedProvs.join(", ") : "TPA Staff"
    }

    const formatArticleDate = (dateObj) => {
        if (!dateObj || isNaN(dateObj.getTime())) return "";
        return dateObj.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    };

    const groupArticlesByDate = (articlesList) => {
        const groups = {};

        articlesList.forEach(article => {
            if (!article.published_at)
                return;
            const date = new Date(article.published_at);

            if (isNaN(date.getTime()))
                return;

            const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const key = startOfDay.getTime();

            if (!groups[key]) {
                groups[key] = {
                    date: startOfDay,
                    label: formatArticleDate(startOfDay),
                    articles: []
                };
            }
            groups[key].articles.push(article);
        });

        // Sort groups by date descending
        return Object.keys(groups)
            .sort((a, b) => Number(b) - Number(a))
            .map(key => groups[key]);
    };

    const handleFilterChange = (filterName => {
        setSelectedFilters(prev =>
            prev.includes(filterName)
                ? prev.filter(f => f !== filterName)
                : [...prev, filterName] // add latest toggled filter into the list
        )
        setVisibleDates(5)
    })

    const renderCheckbox = (filterName) => {
        return (
            <div className="Individual-Filters" key={filterName}>
                <input
                    type="checkbox"
                    checked={selectedFilters.includes(filterName)}
                    onChange={() => handleFilterChange(filterName)}
                />
                <p> {filterName} </p>
            </div>
        )
    }

    const scoreArticle = (article, query) => {
        if (!query) return 0
        const q = query.toLowerCase().trim()
        const words = q.split(/\s+/).filter(Boolean)
        let score = 0

        const headline = (article.article_headline || "").toLowerCase()
        if (headline === q) {
            score += 100
        } else if (headline.includes(q)) {
            score += 60
        } else {
            words.forEach(w => {
                if (headline.includes(w)) score += 15
            })
        }

        const tags = [article.article_tag1, article.article_tag2, article.article_tag3].filter(Boolean)
        tags.forEach(t => {
            const tagLower = t.toLowerCase()
            if (tagLower === q) score += 40
            else if (tagLower.includes(q)) score += 20
            else {
                words.forEach(w => {
                    if (tagLower.includes(w)) score += 8
                })
            }
        })

        const rawType = (article.article_type || "").toLowerCase()
        const cleanType = article.article_type ? replaceUnderscore(article.article_type).toLowerCase() : ""
        const labelType = article.article_type ? getMediaSegmentLabel(article.article_type).toLowerCase() : ""
        if (rawType.includes(q) || cleanType.includes(q) || labelType.includes(q)) {
            score += 25
        }

        const authors = (article.article_staff || []).map(s => (
            s.staff?.staff_display_name || s.staff?.staff_pseudonym || `${s.staff?.staff_first_name || ""} ${s.staff?.staff_last_name || ""}`
        ).toLowerCase())
        authors.forEach(authorName => {
            if (authorName.includes(q)) score += 30
            else {
                words.forEach(w => {
                    if (authorName.includes(w)) score += 10
                })
            }
        })

        if (article.published_at && score > 0) {
            const time = new Date(article.published_at).getTime()
            if (!isNaN(time)) {
                score += (time / 1000000000000) * 0.5
            }
        }

        return score
    }

    const filteredArticles = articles.filter(article => {
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim()
            const headlineMatch = article.article_headline?.toLowerCase().includes(q)
            const tagMatch = [article.article_tag1, article.article_tag2, article.article_tag3]
                .some(t => t?.toLowerCase().includes(q))
            const rawType = article.article_type?.toLowerCase() || ""
            const cleanType = article.article_type ? replaceUnderscore(article.article_type).toLowerCase() : ""
            const labelType = article.article_type ? getMediaSegmentLabel(article.article_type).toLowerCase() : ""
            const typeMatch = rawType.includes(q) || cleanType.includes(q) || labelType.includes(q)
            const authorMatch = article.article_staff?.some(s =>
                s.staff?.staff_display_name?.toLowerCase().includes(q) ||
                s.staff?.staff_pseudonym?.toLowerCase().includes(q) ||
                s.staff?.staff_first_name?.toLowerCase().includes(q) ||
                s.staff?.staff_last_name?.toLowerCase().includes(q)
            )
            if (!headlineMatch && !tagMatch && !typeMatch && !authorMatch) {
                return false
            }
        }

        if (selectedFilters.length === 0) {
            return true
        }

        return selectedFilters.some(filterName => {
            const criteria = filterMap[filterName]
            if (!criteria) {
                return false
            }

            const types = criteria.types || (criteria.type ? [criteria.type] : [])
            const typeMatch = types.length > 0 && types.includes(article.article_type)

            const tags = criteria.tags || (criteria.tag ? [criteria.tag] : [])
            const articleTags = [article.article_tag1, article.article_tag2, article.article_tag3]
                .filter(Boolean)
                .map(t => t.toLowerCase())
            const tagMatch = tags.some(tagWord => articleTags.some(t => t.includes(tagWord)))

            const multiPhotoMatch = Boolean(
                criteria.matchMultiPhoto &&
                article.article_media &&
                article.article_media.length > 1
            )

            return typeMatch || tagMatch || multiPhotoMatch
        })
    })

    const isSearchActive = Boolean(searchQuery.trim())

    // When searching, sort matching articles by relevance score
    const rankedArticles = isSearchActive
        ? [...filteredArticles].sort((a, b) => scoreArticle(b, searchQuery) - scoreArticle(a, searchQuery))
        : filteredArticles

    // Top 3 or 4 articles best matching the query
    const bestMatchingArticles = isSearchActive ? rankedArticles.slice(0, 4) : []

    const groupedDates = groupArticlesByDate(rankedArticles)
    const isFiltering = Boolean(searchQuery.trim() || selectedFilters.length > 0)
    const datesToDisplay = isFiltering ? groupedDates : groupedDates.slice(0, visibleDates)

    return (
        <div className="Latest-Posts-Page">
            <CoverPhotoSearch searchQuery = {searchQuery} setSearchQuery = {setSearchQuery} />
            <Tabs />

            <div className="Latest-Article-Two-Part">
                <div className="Latest-Articles-Container">
                    {isSearchActive && (
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "#f0f7ff",
                            border: "1px solid rgba(2, 101, 169, 0.25)",
                            borderRadius: "6px",
                            padding: "0.75rem 1.25rem",
                            marginBottom: "1.5rem"
                        }}>
                            <span style={{ fontSize: "0.9rem", color: "#0f172a", fontWeight: "600" }}>
                                Showing {filteredArticles.length} {filteredArticles.length === 1 ? "article" : "articles"} matching "{searchQuery}"
                            </span>
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                style={{
                                    background: "none",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "4px",
                                    padding: "0.3rem 0.75rem",
                                    fontSize: "0.8rem",
                                    fontWeight: "600",
                                    color: "#475569",
                                    cursor: "pointer"
                                }}
                            >
                                Clear search
                            </button>
                        </div>
                    )}

                    {selectedFilters.length > 0 && (
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "#eff6ff",
                            border: "1px solid #bfdbfe",
                            borderRadius: "6px",
                            padding: "0.75rem 1.25rem",
                            marginBottom: "1.5rem"
                        }}>
                            <span style={{ fontSize: "0.9rem", color: "#1e40af", fontWeight: "600" }}>
                                Filtered by: <strong>{selectedFilters.join(", ")}</strong> ({filteredArticles.length} {filteredArticles.length === 1 ? "article" : "articles"})
                            </span>
                            <button
                                type="button"
                                onClick={() => setSelectedFilters([])}
                                style={{
                                    background: "none",
                                    border: "1px solid #93c5fd",
                                    borderRadius: "4px",
                                    padding: "0.3rem 0.75rem",
                                    fontSize: "0.8rem",
                                    fontWeight: "600",
                                    color: "#1e40af",
                                    cursor: "pointer"
                                }}
                            >
                                Clear filter
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div style={{ color: "black", padding: "5rem", minHeight: "40dvh" }}>
                            <h3>Loading articles...</h3>
                        </div>
                    ) : filteredArticles.length === 0 ? (
                        <div style={{ color: "black", padding: "5rem", minHeight: "40dvh" }}>
                            <h3>No articles found matching your criteria.</h3>
                            {isSearchActive && (
                                <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
                                    Try searching with different keywords, topics, or writer names.
                                </p>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Best Matching Articles Section (Top 3 or 4) */}
                            {isSearchActive && bestMatchingArticles.length > 0 && (
                                <div className="Best-Matches-Section">
                                    <div className="Best-Matches-Header">
                                        <h2>Best Matching Articles</h2>
                                        <span className="Best-Matches-Subtitle">
                                            Top {bestMatchingArticles.length} {bestMatchingArticles.length === 1 ? "article" : "articles"} matching "{searchQuery}"
                                        </span>
                                    </div>
                                    <div className="Best-Matches-Grid">
                                        {bestMatchingArticles.map((article) => {
                                            const firstMedia = article.article_media?.[0]?.media?.media_url || Photo2
                                            const staffList = article.article_staff || []
                                            const authorsCount = staffList.filter(s => s.contribution_as === "Author" && s.staff?.staff_display_name).length
                                            const medProvsCount = staffList.filter(s => s.contribution_as === "Media_Provider" && s.staff?.staff_display_name).length

                                            const authorsStr = getAuthorsString(article)
                                            const medProvsStr = getMedProvString(article)
                                            const authorMediaDisplay = (authorsCount > 1 || medProvsCount > 1)
                                                ? "TPA Staffers"
                                                : (authorsStr === medProvsStr ? authorsStr : `${authorsStr} & ${medProvsStr}`)

                                            const formattedDate = new Date(article.published_at).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric"
                                            })

                                            const detailLink = getArticleUrl(article)

                                            return (
                                                <Link to={detailLink} className="Best-Match-Card" key={`best-${article.article_id}`}>
                                                    <div className="Best-Match-Image-Wrapper">
                                                        <img loading="lazy" src={firstMedia} alt={article.article_headline} />
                                                        {article.article_type && (
                                                            <span className="Best-Match-Badge">
                                                                {getMediaSegmentLabel(article.article_type)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="Best-Match-Card-Body">
                                                        <h3 className="Best-Match-Headline">{article.article_headline}</h3>
                                                        <div className="Best-Match-Meta">
                                                            <span className="Best-Match-Date">{formattedDate}</span>
                                                            <span className="Best-Match-Author">{authorMediaDisplay}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* More Results by Date when there are more than 4 matches, or all dates during regular browsing */}
                            {(!isSearchActive || rankedArticles.length > 4) && (
                                <>
                                    {isSearchActive && rankedArticles.length > 4 && (
                                        <div className="Search-More-Results-Header">
                                            <h3>All Results by Date ({rankedArticles.length} total)</h3>
                                            <hr className="Horizontal-Line-Date" />
                                        </div>
                                    )}

                                    {datesToDisplay.map((dayGroup, groupIdx) => (
                                        <React.Fragment key={groupIdx}>
                                            <div className="Latest-Articles-Date">
                                                <h1>{dayGroup.label}</h1>
                                                <hr className="Horizontal-Line-Date" />
                                            </div>
                                            <div className="Day-Articles">
                                                <hr className="Vertical-Line-Date" />
                                                <div className="Three-Article-Column">
                                                    {dayGroup.articles.map((article) => {
                                                        const firstMedia = article.article_media?.[0]?.media?.media_url || Photo2
                                                        const staffList = article.article_staff || [];
                                                        const authorsCount = staffList.filter(s => s.contribution_as === "Author" && s.staff?.staff_display_name).length;
                                                        const medProvsCount = staffList.filter(s => s.contribution_as === "Media_Provider" && s.staff?.staff_display_name).length;

                                                        const authorsStr = getAuthorsString(article)
                                                        const medProvsStr = getMedProvString(article)
                                                        const authorMediaDisplay = (authorsCount > 1 || medProvsCount > 1)
                                                            ? "TPA Staffers"
                                                            : (authorsStr === medProvsStr ? authorsStr : `${authorsStr} & ${medProvsStr}`);

                                                        const formattedDate = new Date(article.published_at).toLocaleDateString("en-US", {
                                                            month: "long",
                                                            day: "numeric",
                                                            year: "numeric"
                                                        })

                                                        const detailLink = getArticleUrl(article)

                                                        return (
                                                            <Link to={detailLink} className="Individual-Article" key={article.article_id}>
                                                                <img loading="lazy" src={firstMedia} alt={article.article_headline} />
                                                                <div className="Individual-Article-Texts">
                                                                    {article.article_type && (
                                                                        <div className = "Article-Type-Indicator">
                                                                            { getMediaSegmentLabel(article.article_type)}
                                                                        </div>
                                                                    )}
                                                                    <div className="Individual-Article-Headline">
                                                                        <p> {article.article_headline} </p>
                                                                        <div className="Latest-Posts-Article-Author-Time">
                                                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                                                <p style={{ fontSize: "0.8rem", color: "var(--text-dark)", margin: "0", padding: "0" }}> {formattedDate} </p>
                                                                                <p> {authorMediaDisplay}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </>
                            )}
                        </>
                    )}

                    {!isFiltering && visibleDates < groupedDates.length && (
                        <div className="Load-More-Container">
                            <button className="Load-More-Button" onClick={() => setVisibleDates(prev => prev + 5)}>
                                Load More Articles
                            </button>
                        </div>
                    )}
                </div>


                <div className="Latest-Post-Filters-Container">
                    <div className="Latest-Post-Filter">

                        <br></br><h3>Short-Form News</h3><br></br>
                        <hr></hr>
                        <div>
                            {["Just In", "In Case You Missed It!", "Announcement", "Advisory", "Alert", "Walang Pasok", "Happening Now", "Erratum"].map(renderCheckbox)}
                        </div>

                        <br></br><h3>Long-Form News</h3><br></br>
                        <hr></hr>
                        <div>
                            {["University News", "Local News", "National News", "International News", "Sports News", "Developing Story"].map(renderCheckbox)}
                        </div>

                        <br></br><h3>Opinion & Editorial</h3><br></br>
                        <hr></hr>
                        <div>
                            {["Opinion", "Editorial"].map(renderCheckbox)}
                        </div>

                        <br></br><h3>Look & Highlights</h3><br></br>
                        <hr></hr>
                        <div>
                            {["Look", "In Photos", "Highlights"].map(renderCheckbox)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LatestPosts;