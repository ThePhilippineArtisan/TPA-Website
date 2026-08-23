import { supabase } from "../supabaseClient.js"
import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getArticleUrl } from "../utils/articleUtils.js"

import "./AdminDashboard.css"

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalArticles: 0,
        totalStaff: 0,
        totalImages: 0,
        totalReleases: 0,
        totalVisits: 0,
        websiteVisits: 0
    })

    const [recentArticles, setRecentArticles] = useState([])
    const [popularTags, setPopularTags] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true)
            try {
                // Article Count
                const { count: totalArticlesCount } = await supabase
                    .from('article')
                    .select('*', { count: 'exact', head: true })

                // Staff Count
                const { count: totalStaffCount } = await supabase
                    .from('staff')
                    .select('*', { count: 'exact', head: true })

                // Images

                // Visits

                // Interval Website Visits

                // Releases Count
                const { count: totalReleasesCount } = await supabase
                    .from('releases')
                    .select('*', { count: 'exact', head: true })

                setStats({
                    totalArticles: totalArticlesCount || 0,
                    totalStaff: totalStaffCount || 0,
                    totalReleases: totalReleasesCount || 0
                })

                const { data: articlesData } = await supabase
                    .from('article')
                    .select('article_id, article_headline, article_type, published_at, is_published, slug_headline')
                    .order('published_at', { ascending: false })
                    .limit(5)

                setRecentArticles(articlesData || [])

                const { data: tagData } = await supabase
                    .from('article')
                    .select('article_tag1, article_tag2, article_tag3')
                    .limit(50)

                if (tagData) {
                    const tagCounts = {}
                    tagData.forEach(row => {
                        [row.article_tag1, row.article_tag2, row.article_tag3].forEach(t => {
                            if (t && t.trim()) {
                                const cleanTag = t.trim()
                                tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1
                            }
                        })
                    })

                    const sortedTags = Object.entries(tagCounts)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 6)
                        .map(([name, count]) => ({ name, count }))

                    setPopularTags(sortedTags)
                }
            } catch (error) {
                console.error("Error loading dashboard metrics: ", error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    return (
        <div className="Admin-Dashboard">
            <div className="Admin-Dashboard-Header">
                <div>
                    <h1> Welcome to the Admin Dashboard!</h1>
                    <br />
                    <p> Check the website's stats, nerd crap, and everything in between. </p>
                </div>
                <div className="Create-Article-Button">
                    <button>
                        <Link to="/admin/create-article"> + Create Article </Link>
                    </button>
                </div>
            </div>

            <div className="Admin-Dashboard-BTN">
                <div className="Admin-Dashboard-BTN-Stats">
                    <h2> {loading ? "..." : stats.totalArticles}</h2>
                    <p> Total Articles </p>

                </div>

                <div className="Admin-Dashboard-BTN-Stats">
                    <h2> {loading ? "..." : stats.totalStaff}</h2>
                    <p> Total Staff </p>
                </div>

                <div className="Admin-Dashboard-BTN-Stats">
                    <h2> {loading ? "..." : stats.totalReleases}</h2>
                    <p> Total Releases </p>
                </div>

                <div className="Admin-Dashboard-BTN-Stats">
                    <p> 23.26 GB / 100 GB </p>
                    <h2> Cloudflare R2 Image storage </h2>
                </div>
                <div className="Admin-Dashboard-BTN-Stats">
                    <p> $123.67 </p>
                    <h2> Cloudflare monthly bill </h2>
                </div>
            </div>
            <div className="Admin-Dashboard-Bottom-BTN">
                <div className="Admin-Dashboard-Superlative-Container">
                    <div className="AD-Mosts-Full-Card">
                        <Link to="/admin/articles"><h2> Recent Articles </h2> </Link>
                        {loading ? (
                            <div> Loading recent articles... </div>
                        ) : recentArticles.length === 0 ? (<div> No articles found. </div>
                        ) : (
                            <div className="Admin-Dashboard-Mosts">
                                {recentArticles.map(art => (
                                    <Link key={art.article_id} to={getArticleUrl(art)} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "inherit" }} className="Individual-Card-Container">
                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "1rem" }}>
                                            <div className="Individual-Cards-Mosts" style={{ display: "flex", flexDirection: "column", lineHeight: "1.2", flex: 1, minWidth: 0 }}>
                                                <p style={{ color: "var(--text-dark)", fontWeight: "bold", margin: "0 0 4px 0" }}> {art.article_headline} </p>
                                                <p id="Author-Media-Provider-Name" style={{ fontSize: "0.75rem", color: "#666", margin: 0 }}>
                                                    {art.published_at ? new Date(art.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Draft"}
                                                </p>
                                            </div>
                                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                                                <span className="Article-Type-Badge">
                                                    {(art.article_type ? art.article_type.replace(/_/g, " ") : "ARTICLE")}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="AD-BTN-Side-Card">
                    <div className="AD-Mosts-Full-Card">
                        <h2> Most popular tags </h2>
                        {loading ? (<div> Loading tags... </div>) : popularTags.length === 0 ? (
                            <div> No tags to display. </div>
                        ) : (
                            <div className="Tags-Container">
                                {popularTags.map((tag, idx) => (
                                    <span key={idx} className="Tag-Pill">
                                        #{tag.name} <span className="Tag-Count">({tag.count})</span>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="Admin-Dashboard-Quick-Actions">
                        <h2> Quick Actions </h2>
                        <Link to="/admin/create-article" style={{ textDecoration: "none", color: "inherit" }} className="Admin-Quick-Actions">
                            <p> Create an Article </p>
                        </Link>
                        <Link to="/admin/manage-page" style={{ textDecoration: "none", color: "inherit" }} className="Admin-Quick-Actions">
                            <p> Configure Website Showcase Slides </p>
                        </Link>
                        <Link to="/admin/manage-releases" style={{ textDecoration: "none", color: "inherit" }} className="Admin-Quick-Actions">
                            <p> Manage Releases </p>
                        </Link>
                        <Link to="/admin/staff" style={{ textDecoration: "none", color: "inherit" }} className="Admin-Quick-Actions">
                            <p> Manage Staff </p>
                        </Link>
                        <Link to="/admin/manage-videos" style={{ textDecoration: "none", color: "inherit" }} className="Admin-Quick-Actions">
                            <p> Manage YouTube Videos </p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard;