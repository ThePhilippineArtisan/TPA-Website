import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "../supabaseClient"
import { replaceUnderscore, slugify } from "../utils/slugifyUtils"
import { getArticleUrl, getMediaSegmentLabel, getCategoryFallbackImage } from "../utils/articleUtils"
import { formatDateReadable } from "../utils/dateUtils"
import EditStaffModal from "../AdminPortal/Modals/EditStaffModal.jsx"

import "../CSS/StaffProfile.css"

const StaffProfile = () => {
    const { staffSlug } = useParams()

    const [staffDetails, setStaffDetails] = useState(null)
    const [contributions, setContributions] = useState([])
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsAdmin(Boolean(session))
        })
    }, [])

    useEffect(() => {
        const fetchStaffMemberAndContributions = async () => {
            setLoading(true)
            try {
                // 1. Fetch staff records to match by slugified name, pseudonym, or legacy ID
                const { data: allStaff, error: staffErr } = await supabase
                    .from("staff")
                    .select("*")

                if (staffErr) throw staffErr

                // Match staff member:
                // - By slugified display name (e.g., 'john-doe' === slugify('John Doe'))
                // - By slugified pseudonym
                // - Backward-compat: exact staff_id match
                // - Backward-compat: legacy slug with ID ('john-doe-42')
                const matched = (allStaff || []).find((member) => {
                    const slugName = slugify(member.staff_display_name)
                    const slugPseudo = member.staff_pseudonym ? slugify(member.staff_pseudonym) : null
                    const legacySlugWithId = `${slugName}-${member.staff_id}`
                    return (
                        slugName === staffSlug ||
                        slugPseudo === staffSlug ||
                        legacySlugWithId === staffSlug ||
                        String(member.staff_id) === staffSlug
                    )
                })

                if (!matched) {
                    setStaffDetails(null)
                    setContributions([])
                    return
                }

                setStaffDetails(matched)

                // 2. Fetch Staff Articles / Media Contributions using matched.staff_id
                let publishedList = []
                const { data: rawContribs, error: contribErr } = await supabase
                    .from("article_staff")
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
                    .eq("staff_id", matched.staff_id)

                if (!contribErr && rawContribs && rawContribs.length > 0) {
                    publishedList = rawContribs
                        .filter((item) => item.article && item.article.is_published)
                        .sort((a, b) => new Date(b.article.published_at) - new Date(a.article.published_at))
                } else {
                    // Fallback: 2-step fetch when no foreign key relationship exists between article_staff and article
                    const { data: staffCredits, error: creditsErr } = await supabase
                        .from("article_staff")
                        .select("article_id, contribution_as, use_pseudonym")
                        .eq("staff_id", matched.staff_id)

                    if (!creditsErr && staffCredits && staffCredits.length > 0) {
                        const articleIds = [...new Set(staffCredits.map(c => c.article_id).filter(Boolean))]
                        if (articleIds.length > 0) {
                            const { data: articles, error: artErr } = await supabase
                                .from("article")
                                .select(`
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
                                `)
                                .in("article_id", articleIds)
                                .eq("is_published", true)

                            if (!artErr && articles) {
                                const articleMap = new Map(articles.map(a => [a.article_id, a]))
                                publishedList = staffCredits
                                    .map(credit => ({
                                        contribution_as: credit.contribution_as,
                                        use_pseudonym: credit.use_pseudonym,
                                        article: articleMap.get(credit.article_id)
                                    }))
                                    .filter(item => Boolean(item.article))
                                    .sort((a, b) => new Date(b.article.published_at) - new Date(a.article.published_at))
                            }
                        }
                    }
                }

                setContributions(publishedList)
            } catch (error) {
                console.error("Error fetching staff member profile or contributions:", error)
                setStaffDetails(null)
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
            <div className="Staff-Profile-Full-Page">
                <div className="Staff-Profile-Loading-Box">
                    <p>Loading staff profile...</p>
                </div>
            </div>
        )
    }

    if (!staffDetails) {
        return (
            <div className="Staff-Profile-Full-Page">
                <div className="Staff-Profile-Not-Found-Box">
                    <h2>Staff Member Not Found</h2>
                    <p>The profile you are looking for may have been moved or updated.</p>
                    <Link to="/about" className="Staff-Profile-Back-Btn">
                        Return to Staff Directory
                    </Link>
                </div>
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
        return getCategoryFallbackImage(article.article_type) || "/TPA-LEFT_BLUE.png"
    }

    const getContributionRoleLabel = (role) => {
        if (!role) return "Contributor"
        const mapping = {
            Author: "Written by",
            Media_Provider: "Photo by",
            Illustrator: "Graphics by",
            Broadcaster: "Broadcast by",
            Designer: "Designed by"
        }
        return mapping[role] || replaceUnderscore(role)
    }

    return (
        <div className="Staff-Profile-Full-Page">
            <div className="Staff-Profile-Container">
                {/* Top Navigation Bar */}
                <div className="Staff-Profile-Nav-Bar">
                    <Link to="/about" className="Staff-Profile-Back-Btn">
                        Back to Staff Directory & About
                    </Link>
                    {isAdmin && (
                        <button
                            type="button"
                            className="Staff-Profile-Admin-Edit-Btn"
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            Edit Staff Record
                        </button>
                    )}
                </div>

                {/* Main Profile Card */}
                <div className="Staff-Profile-Main-Content">
                    <div className="Horizontal-Staff-Profile-About">
                        <div className="Profile-Image-Container">
                            <img
                                src={staffDetails.staff_picture || "/TPA-LEFT_BLUE.png"}
                                alt={staffDetails.staff_display_name}
                                onError={(e) => {
                                    e.currentTarget.src = "/TPA-LEFT_BLUE.png"
                                }}
                            />
                        </div>

                        <div className="Right-Side-Profile-About">
                            <div className="Staff-Pills-Row">
                                {staffDetails.staff_isactive && (
                                    <span className="Staff-Active-Pill">Active</span>
                                )}
                                {staffDetails.is_editorial_board && (
                                    <span className="Staff-EdBoard-Pill">Editorial Board</span>
                                )}
                                <span className="Staff-Position-Pill">
                                    {replaceUnderscore(staffDetails.staff_position)}
                                </span>
                                {staffDetails.join_date && (
                                    <span className="Staff-Meta-Pill">
                                        Joined {staffDetails.join_date}
                                    </span>
                                )}
                                <span className="Staff-Meta-Pill">
                                    {contributions.length} {contributions.length === 1 ? "Contribution" : "Contributions"}
                                </span>
                            </div>

                            <h1 className="Staff-Display-Name">{staffDetails.staff_display_name}</h1>
                            {staffDetails.staff_pseudonym && (
                                <p className="Staff-Pseudonym-Line">
                                    Byline / Pseudonym: <span>{staffDetails.staff_pseudonym}</span>
                                </p>
                            )}

                            <div className="Profile-Bio-Container">
                                <h2>About {staffDetails.staff_first_name}</h2>
                                <p className="Staff-Bio-Paragraph">
                                    {staffDetails.staff_bio || "No biographical information provided yet."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Staff Creations & Contributions Section */}
                    <div className="Staff-Contributions-Section">
                        <div className="Staff-Contributions-Header-Bar">
                            <h2>Recent Creations & Contributions</h2>
                            <span className="Staff-Contributions-Total">
                                {contributions.length} {contributions.length === 1 ? "work published" : "works published"}
                            </span>
                        </div>

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
                                            <div className="Staff-Contrib-Img-Wrap">
                                                <img
                                                    src={getThumbnail(art)}
                                                    alt={art.article_headline}
                                                    className="Staff-Contrib-Image"
                                                    loading="lazy"
                                                />
                                                <span className="Staff-Contrib-Category-Tag">
                                                    {getMediaSegmentLabel(art.article_type)}
                                                </span>
                                            </div>
                                            <div className="Staff-Contrib-Details">
                                                <div className="Staff-Contrib-Tags">
                                                    <span className="Contrib-Role-Badge">
                                                        {getContributionRoleLabel(item.contribution_as)}
                                                    </span>
                                                    <span className="Staff-Contrib-Date">
                                                        {formatDateReadable(art.published_at)}
                                                    </span>
                                                </div>
                                                <h3 className="Staff-Contrib-Headline">{art.article_headline}</h3>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="Staff-No-Contribs-Box">
                                <p>No published creations or contributions found yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Admin Edit Modal */}
            {isEditModalOpen && (
                <EditStaffModal
                    staff={staffDetails}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={(updated) => {
                        setStaffDetails(updated)
                    }}
                />
            )}
        </div>
    )
}

export default StaffProfile