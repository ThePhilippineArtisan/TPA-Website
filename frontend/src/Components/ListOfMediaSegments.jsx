import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { getArticleUrl, getMediaSegmentLabel } from "../utils/articleUtils.js";

import "../CSS/ListOfMediaSegments.css";

const WEEKLY_TYPES = [
    "MAKATA_MONDAYS",
    "TEK_TUESDAY",
    "WANKJOB_WEDNESDAY",
    "TALA_THURSDAY",
    "FEATURES_FRIDAY",
    "STREAMING_SATURDAY",
    "SPORTS_SUNDAY"
];

const ListOfMediaSegments = () => {
    const [latestSegments, setLatestSegments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchLatestWeeklySegments = async () => {
            try {
                // Perform optimized select query limited to 30 most recent published articles
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
                    .in("article_type", WEEKLY_TYPES)
                    .eq("is_published", true)
                    .order("published_at", { ascending: false })
                    .limit(30);

                if (error) {
                    console.warn("Supabase query error for weekly segments:", error);
                    return;
                }

                if (isMounted && data && data.length > 0) {
                    const segmentMap = {};
                    data.forEach(item => {
                        if (item.article_type && !segmentMap[item.article_type]) {
                            segmentMap[item.article_type] = item;
                        }
                    });
                    
                    const activeSegments = WEEKLY_TYPES
                        .map(type => segmentMap[type])
                        .filter(Boolean);

                    setLatestSegments(activeSegments);
                }
            } catch (err) {
                console.warn("Could not fetch weekly segments (timeout or network error):", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchLatestWeeklySegments();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading || latestSegments.length === 0) {
        return null;
    }

    return (
        <div className="List-of-Media-Segments">
            <div className="Media-Segment-Card-Wrapper">
                <h1 id="Latest-Weekly-Segments"> Latest Weekly Segments </h1>
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
            </div>
        </div>
    );
};

export default ListOfMediaSegments;