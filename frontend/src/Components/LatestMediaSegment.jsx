import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { getMediaSegmentLabel, getArticleUrl } from "../utils/articleUtils.js";

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

                if (error) {
                    console.error("Supabase error fetching latest media segment:", error);
                    return;
                }

                if (data) {
                    let staffContributions = [];
                    try {
                        const { data: staffData, error: staffError } = await supabase
                            .from("article_staff")
                            .select(`
                                contribution_as,
                                use_pseudonym,
                                staff (
                                    staff_id,
                                    staff_display_name,
                                    staff_pseudonym
                                )
                            `)
                            .eq("article_id", data.article_id);

                        if (staffError) {
                            if (staffError.code === "PGRST200" || staffError.message?.includes("relationship")) {
                                console.warn("No FK relationship between article_staff and staff. Fetching manually...");
                                const { data: rawStaffRel, error: rawStaffRelErr } = await supabase
                                    .from("article_staff")
                                    .select("contribution_as, staff_id, use_pseudonym")
                                    .eq("article_id", data.article_id);

                                if (!rawStaffRelErr && rawStaffRel && rawStaffRel.length > 0) {
                                    const staffIds = rawStaffRel.map(r => r.staff_id).filter(Boolean);
                                    const { data: staffRows, error: staffRowsErr } = await supabase
                                        .from("staff")
                                        .select("staff_id, staff_display_name, staff_pseudonym")
                                        .in("staff_id", staffIds);

                                    if (!staffRowsErr && staffRows) {
                                        staffContributions = rawStaffRel.map(rel => ({
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
                            staffContributions = staffData || [];
                        }
                    } catch (staffErr) {
                        console.error("Non-blocking error fetching staff contributors:", staffErr);
                    }

                    setLatestSegment({
                        ...data,
                        article_staff: staffContributions
                    });
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

    const firstMedia = latestSegment.article_media?.[0]?.media?.media_url

    const getContributorName = (as) => {
        if(as.use_pseudonym && as.staff?.staff_pseudonym){
            return as.staff.staff_pseudonym
        }
        return as.staff?.staff_display_name
    }

    const authors = latestSegment.article_staff
        ? latestSegment.article_staff
            .filter(as => as.contribution_as === "Author")
            .map(getContributorName)
            .filter(Boolean)
        : [];

    const mediaProviders = latestSegment.article_staff
        ? latestSegment.article_staff
            .filter(as => as.contribution_as === "Media Provider" || as.contribution_as === "Media_Provider" || as.contribution_as === "Photos" || as.contribution_as === "Visuals")
            .map(getContributorName)
            .filter(Boolean)
        : [];

    const authorStr = authors.length > 0 ? `Written by ${authors.join(", ")}` : "";
    const mediaStr = mediaProviders.length > 0 ? `by ${mediaProviders.join(", ")}` : "";
    const creditsStr = [authorStr, mediaStr].filter(Boolean).join(" • ")

    return (
        <div>
            <div className="Latest-Media-Segment-Image"
                style={{ "--bgImage": `url(${firstMedia})`, width: "90%" }} >
                
                <Link to = {getArticleUrl(latestSegment)} className="Latest-MS-Title">
                    <img
                        src={firstMedia}
                        alt={latestSegment.article_headline}
                    />
                    <div className="Media-Segment-Title-Author">
                        <div className="Segment-Container">
                            <p>{getMediaSegmentLabel(latestSegment.article_type)}</p>
                        </div>
                        <h2>{latestSegment.article_headline}</h2>
                        <h3>{creditsStr}</h3>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default LatestMediaSegment;