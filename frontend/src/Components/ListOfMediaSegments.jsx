import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { getArticleUrl, getMediaSegmentLabel } from "../utils/articleUtils.js";

import "../CSS/ListOfMediaSegments.css";

const WEEKLY_DAYS_ORDER = [
    "MAKATA_MONDAYS",
    "TEK_TUESDAY",
    "WANKJOB_WEDNESDAY",
    "TALA_THURSDAY",
    "FEATURES_FRIDAY",
    "STREAMING_SATURDAY",
    "SPORTS_SUNDAY"
];

const ListOfMediaSegments = ({ filterType }) => {
    const [latestSegments, setLatestSegments] = useState([]);
    const [weeksCount, setWeeksCount] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);

    // Reset week count when filter changes
    useEffect(() => {
        setWeeksCount(1);
    }, [filterType]);

    useEffect(() => {
        let isMounted = true;

        const fetchWeeklySegments = async () => {
            setLoading(true);
            try {
                if (!filterType) {
                    // Fetch up to 100 recent articles across all weekly types
                    const { data, error } = await supabase
                        .from("article")
                        .select(`
                            article_id,
                            article_headline,
                            article_type,
                            slug_headline,
                            published_at,
                            article_media(
                                media(
                                    media_url
                                )
                            )
                        `)
                        .in("article_type", WEEKLY_DAYS_ORDER)
                        .eq("is_published", true)
                        .order("published_at", { ascending: false })
                        .limit(100);

                    if (error) {
                        console.warn("Supabase query error for weekly segments:", error);
                        return;
                    }

                    if (isMounted && data) {
                        // Group articles by article_type
                        const grouped = {};
                        WEEKLY_DAYS_ORDER.forEach(type => {
                            grouped[type] = [];
                        });

                        data.forEach(item => {
                            const typeUpper = item.article_type?.toUpperCase();
                            if (grouped[typeUpper]) {
                                grouped[typeUpper].push(item);
                            }
                        });

                        // Build ordered list (Monday -> Sunday) for each week iteration
                        const orderedList = [];
                        let moreAvailable = false;

                        for (let weekIdx = 0; weekIdx < weeksCount; weekIdx++) {
                            WEEKLY_DAYS_ORDER.forEach(dayType => {
                                if (grouped[dayType] && grouped[dayType][weekIdx]) {
                                    orderedList.push(grouped[dayType][weekIdx]);
                                }
                            });
                        }

                        // Check if any day category has more items beyond current weeksCount
                        WEEKLY_DAYS_ORDER.forEach(dayType => {
                            if (grouped[dayType] && grouped[dayType].length > weeksCount) {
                                moreAvailable = true;
                            }
                        });

                        setLatestSegments(orderedList);
                        setHasMore(moreAvailable);
                    }
                } else {
                    // Single category filter mode
                    const targetLimit = weeksCount * 7;
                    const { data, error } = await supabase
                        .from("article")
                        .select(`
                            article_id,
                            article_headline,
                            article_type,
                            slug_headline,
                            published_at,
                            article_media(
                                media(
                                    media_url
                                )
                            )
                        `)
                        .eq("article_type", filterType.toUpperCase())
                        .eq("is_published", true)
                        .order("published_at", { ascending: false })
                        .limit(targetLimit + 1);

                    if (error) {
                        console.warn("Supabase query error for category filter:", error);
                        return;
                    }

                    if (isMounted && data) {
                        if (data.length > targetLimit) {
                            setHasMore(true);
                            setLatestSegments(data.slice(0, targetLimit));
                        } else {
                            setHasMore(false);
                            setLatestSegments(data);
                        }
                    }
                }
            } catch (err) {
                console.warn("Could not fetch media segments:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchWeeklySegments();

        return () => {
            isMounted = false;
        };
    }, [filterType, weeksCount]);

    const sectionTitle = filterType
        ? `${getMediaSegmentLabel(filterType).toUpperCase()} SEGMENTS`
        : "LATEST WEEKLY SEGMENTS";

    if (loading && latestSegments.length === 0) {
        return (
            <div className="List-of-Media-Segments">
                <p style={{ textAlign: "center", color: "#ffffff", padding: "2rem" }}>Loading media segments...</p>
            </div>
        );
    }

    if (!loading && latestSegments.length === 0) {
        return (
            <div className="List-of-Media-Segments">
                <h1 id="Latest-Weekly-Segments">{sectionTitle}</h1>
                <p style={{ textAlign: "center", color: "#cbd5e1", padding: "2rem" }}>
                    No published segments found for this category yet.
                </p>
            </div>
        );
    }

    return (
        <div className="List-of-Media-Segments">
            <div className="Media-Segment-Card-Wrapper">
                <h1 id="Latest-Weekly-Segments">{sectionTitle}</h1>
                <div className="Media-Segment-Card">
                    {latestSegments.map(article => {
                        const mediaUrl = article.article_media?.[0]?.media?.media_url;
                        const label = getMediaSegmentLabel(article.article_type);

                        return (
                            <Link
                                key={article.article_id}
                                to={getArticleUrl(article)}
                                className="List-Of-MS-Card"
                                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: '240px' }}
                            >
                                <div className="Segment-Container">
                                    <p>{label}</p>
                                </div>
                                {mediaUrl && (
                                    <img
                                        src={mediaUrl}
                                        alt={article.article_headline}
                                        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                                    />
                                )}
                                <p style={{
                                    marginTop: '0.5rem',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    lineHeight: '1.3'
                                }}>
                                    {article.article_headline}
                                </p>
                            </Link>
                        );
                    })}
                </div>

                {hasMore && (
                    <div className="Load-More-Container" style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
                        <button
                            className="Load-More-Weeks-Btn"
                            onClick={() => setWeeksCount(prev => prev + 1)}
                        >
                            More
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListOfMediaSegments;