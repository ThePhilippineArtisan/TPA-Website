import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { getMediaSegmentLabel } from "../utils/articleUtils.js";
import "../CSS/LatestMediaSegment.css";

const LatestMediaSegment = () => {
    const [latestSegment, setLatestSegment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
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
                        ),
                        article_staff(
                            contribution_as,
                            staff(
                                staff_display_name
                            )
                        )
                    `)
                    .in("article_type", [
                        "MAKATA_MONDAYS",
                        "TEK_TUESDAY",
                        "WANKJOB_WEDNESDAY",
                        "TALA_THURSDAY",
                        "FEATURES_FRIDAY",
                        "STREAMING_SATURDAY",
                        "SPORTS_SUNDAY"
                    ])
                    .eq("is_published", true)
                    .order("published_at", { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (!error && data) {
                    setLatestSegment(data);
                }
            } catch (err) {
                console.error("Error fetching latest media segment:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLatest();
    }, []);

    if (isLoading) {
        return (
            <div className="Latest-Media-Segment-Image" style={{ width: "90%", background: "#f0f0f0", height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p>Loading latest segment...</p>
            </div>
        );
    }

    if (!latestSegment) {
        return null;
    }

    const firstMedia = latestSegment.article_media?.[0]?.media?.media_url || "https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/Bata.jpg";
    const authors = latestSegment.article_staff
        ? latestSegment.article_staff
            .filter(as => as.contribution_as === "Author")
            .map(as => as.staff?.staff_display_name)
            .filter(Boolean)
        : [];
    const authorStr = authors.length > 0 ? `by ${authors.join(", ")}` : "";

    return (
        <div>
            <div className="Latest-Media-Segment-Image"
                style={{ "--bgImage": `url(${firstMedia})`, width: "90%" }} >
                
                <Link to={`/media-segment/${latestSegment.slug_headline || latestSegment.article_id}`} className="Latest-MS-Title">
                    <img
                        src={firstMedia}
                        alt={latestSegment.article_headline}
                    />
                    <div className="Media-Segment-Title-Author">
                        <div className="Segment-Container">
                            <p>{getMediaSegmentLabel(latestSegment.article_type)}</p>
                        </div>
                        <h2>{latestSegment.article_headline}</h2>
                        <h3>{authorStr}</h3>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default LatestMediaSegment;