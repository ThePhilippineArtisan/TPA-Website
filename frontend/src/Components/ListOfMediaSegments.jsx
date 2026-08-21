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
    const [latestWeek, setLatestWeek] = useState([]);
    const [pastWeeks, setPastWeeks] = useState([]);
    const [showPastWeeks, setShowPastWeeks] = useState(false);
    const [loading, setLoading] = useState(true);

    // Reset view when filterType changes
    useEffect(() => {
        setShowPastWeeks(false);
    }, [filterType]);

    useEffect(() => {
        let isMounted = true;

        const fetchWeeklySegments = async () => {
            setLoading(true);
            try {
                if (!filterType) {
                    // Fetch up to 100 articles across all 7 weekly types
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
                        // Group articles by day type
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

                        // Week 0: Latest week (1 item per day segment arranged Mon -> Sun)
                        const week0 = WEEKLY_DAYS_ORDER
                            .map(dayType => grouped[dayType]?.[0])
                            .filter(Boolean);

                        // Week 1: 1 week ago
                        const week1 = WEEKLY_DAYS_ORDER
                            .map(dayType => grouped[dayType]?.[1])
                            .filter(Boolean);

                        // Week 2: 2 weeks ago
                        const week2 = WEEKLY_DAYS_ORDER
                            .map(dayType => grouped[dayType]?.[2])
                            .filter(Boolean);

                        setLatestWeek(week0);

                        const past = [];
                        if (week1.length > 0) past.push(week1);
                        if (week2.length > 0) past.push(week2);

                        setPastWeeks(past);
                    }
                } else {
                    // Single Category Filter (e.g. OPINION or TEK_TUESDAY)
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
                        .limit(21);

                    if (error) {
                        console.warn("Supabase query error for category filter:", error);
                        return;
                    }

                    if (isMounted && data) {
                        const week0 = data.slice(0, 7);
                        const week1 = data.slice(7, 14);
                        const week2 = data.slice(14, 21);

                        setLatestWeek(week0);
                        const past = [];
                        if (week1.length > 0) past.push(week1);
                        if (week2.length > 0) past.push(week2);
                        setPastWeeks(past);
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
    }, [filterType]);

    const renderCard = (article) => {
        const mediaUrl = article.article_media?.[0]?.media?.media_url;
        const label = getMediaSegmentLabel(article.article_type);

        return (
            <Link
                key={article.article_id}
                to={getArticleUrl(article)}
                className="List-Of-MS-Card"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: '220px' }}
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
    };

    const sectionTitle = filterType
        ? `${getMediaSegmentLabel(filterType).toUpperCase()} SEGMENTS`
        : "LATEST WEEKLY SEGMENTS";

    if (loading && latestWeek.length === 0) {
        return (
            <div className="List-of-Media-Segments">
                <p style={{ textAlign: "center", color: "#ffffff", padding: "2rem" }}>Loading media segments...</p>
            </div>
        );
    }

    if (!loading && latestWeek.length === 0) {
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

                {/* Main Top Row: Latest Week (Monday to Sunday) */}
                <div className="Media-Segment-Card">
                    {latestWeek.map(renderCard)}
                </div>

                {/* More Button to Toggle Past 2 Weeks Grid */}
                {pastWeeks.length > 0 && (
                    <div className="Load-More-Container" style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
                        <button
                            className="Load-More-Weeks-Btn"
                            onClick={() => setShowPastWeeks(prev => !prev)}
                        >
                            {showPastWeeks ? "Show Less" : "More"}
                        </button>
                    </div>
                )}

                {/* Past 2 Weeks Grid Section */}
                {showPastWeeks && pastWeeks.length > 0 && (
                    <div className="Past-Weeks-Section">
                        {pastWeeks.map((weekArticles, index) => {
                            const topFour = weekArticles.slice(0, 4);
                            const bottomThree = weekArticles.slice(4, 7);

                            return (
                                <div className="Past-Week-Container" key={index}>
                                    <div className="Past-Week-Header-Wrapper">
                                        <hr className="Horizontal-Line-Date" />
                                    </div>

                                    <div className="Past-Week-Grid-Block">
                                        {/* Top Row: 4 items (Monday - Thursday) */}
                                        <div className="Past-Week-Row-4">
                                            {topFour.map(renderCard)}
                                        </div>

                                        {/* Bottom Row: 3 items (Friday - Sunday) */}
                                        {bottomThree.length > 0 && (
                                            <div className="Past-Week-Row-3">
                                                {bottomThree.map(renderCard)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListOfMediaSegments;