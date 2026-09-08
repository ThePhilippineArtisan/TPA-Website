import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "../supabaseClient"
import { replaceUnderscore } from "../utils/slugifyUtils"
import { getArticleUrl, getMediaSegmentLabel, getCategoryFallbackImage } from "../utils/articleUtils"
import { formatDateReadable } from "../utils/dateUtils"

import "../CSS/StaffProfile.css"

const StaffProfile = () => {
    const { staffSlug } = useParams()

    const [staffDetails, setStaffDetails] = useState(null)
    const [contributions, setContributions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStaffMemberAndContributions = async () => {
            try {
                const slugParts = staffSlug.split('-')
                const staffId = slugParts[slugParts.length - 1]

                // 1. Fetch Staff Member Details
                const { data: staffData, error: staffErr } = await supabase
                    .from('staff')
                    .select('*')
                    .eq('staff_id', staffId)
                    .single()

                if (staffErr) throw staffErr
                setStaffDetails(staffData)

                // 2. Fetch Staff Articles / Media Contributions
                const { data: rawContribs, error: contribErr } = await supabase
                    .from('article_staff')
                    .select(`
                        contribution_as,
                        article (
                            article_id,
                            article_headline,
                            slug_headline,
                            published_at,
                            article_type,
                            is_published,
                            article_media (
                                media_order,
                                media (
                                    media_url
                                )
                            )
                        )
                    `)
                    .eq('staff_id', staffId)

                if (!contribErr && rawContribs) {
                    // Filter published articles and sort chronologically (most recent first)
                    const publishedList = rawContribs
                        .filter(item => item.article && item.article.is_published)
                        .sort((a, b) => new Date(b.article.published_at) - new Date(a.article.published_at))
                    setContributions(publishedList)
                } else {
                    setContributions([])
                }
            } catch (error) {
                console.error("Error fetching staff member profile or contributions:", error)
            } finally {
                setLoading(false)
            }
        }

        if (staffSlug) {
            fetchStaffMemberAndContributions()
        }
    }, [staffSlug])

    if (loading) {
        return (
            <div className="Staff-Profile-Full-Page" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <p style={{ color: "#0265A9", fontWeight: "bold" }}>Loading profile...</p>
            </div>
        )
    }

    if (!staffDetails) {
        return (
            <div className="Staff-Profile-Full-Page" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <p style={{ color: "#0265A9", fontWeight: "bold" }}>Staff member not found.</p>
            </div>
        )
    }

    const getThumbnail = (article) => {
        if (!article) return null
        if (article.article_media && article.article_media.length > 0) {
            const sorted = [...article.article_media].sort((a, b) => (a.media_order || 0) - (b.media_order || 0))
            const url = sorted[0]?.media?.media_url
            if (url) return url
        }
        return getCategoryFallbackImage(article.article_type) || "https://media.philartisan.org/sample-photos/1.jpg"
    }

    const getContributionRoleLabel = (role) => {
        if (!role) return "Contributor"
        const mapping = {
            "Author": "Written by",
            "Media_Provider": "Photo by",
            "Illustrator": "Graphics by",
            "Broadcaster": "Broadcast by",
            "Designer": "Designed by"
        }
        return mapping[role] || replaceUnderscore(role)
    }

    return (
        <div className="Staff-Profile-Full-Page">
            <div className="Staff-Profile-Main-Content">
                <div className="Staff-Profile-Image-Content" style={{ width: "100%" }}>
                    <div className="Horizontal-Staff-Profile-About">
                        <div className="Profile-Image-Container">
                            <img
                                src={staffDetails.staff_picture || "https://media.philartisan.org/sample-photos/1.jpg"}
                                alt={staffDetails.staff_display_name}
                            />
                        </div>
                        <div className="Right-Side-Profile-About">
                            <h1>{staffDetails.staff_display_name}</h1>
                            <p>
                                {replaceUnderscore(staffDetails.staff_position)}{" "}
                                {staffDetails.join_date && (
                                    <span style={{ color: "gray" }}> | Joined {staffDetails.join_date}</span>
                                )}
                            </p>
                            <br />

                            <div className="Profile-Bio-Container">
                                <h2>About {staffDetails.staff_first_name}</h2>
                                <br />
                                <p>{staffDetails.staff_bio || "No bio information provided yet."}</p>
                            </div>
                        </div>
                    </div>

                    {/* Staff Creations & Contributions Section */}
                    <div className="Staff-Contributions-Section">
                        <h2>Recent Creations & Contributions ({contributions.length})</h2>
                        {contributions.length > 0 ? (
                            <div className="Staff-Contributions-Grid">
                                {contributions.map((item, idx) => {
                                    const art = item.article
                                    return (
                                        <Link
                                            to={getArticleUrl(art)}
                                            key={`${art.article_id}-${idx}`}
                                            className="Staff-Contrib-Card"
                                        >
                                            <img
                                                src={getThumbnail(art)}
                                                alt={art.article_headline}
                                                className="Staff-Contrib-Image"
                                            />
                                            <div className="Staff-Contrib-Details">
                                                <div className="Staff-Contrib-Tags">
                                                    <span className="Contrib-Role-Badge">
                                                        {getContributionRoleLabel(item.contribution_as)}
                                                    </span>
                                                    <span className="Contrib-Type-Badge">
                                                        {getMediaSegmentLabel(art.article_type)}
                                                    </span>
                                                </div>
                                                <h3 className="Staff-Contrib-Headline">{art.article_headline}</h3>
                                                <span className="Staff-Contrib-Date">
                                                    {formatDateReadable(art.published_at)}
                                                </span>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="No-Contribs-Text">No published creations or contributions yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StaffProfile