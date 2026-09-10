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

    const [auditLogs, setAuditLogs] = useState([])
    const [logsLoading, setLogsLoading] = useState(true)
    const [logsError, setLogsError] = useState(null)
    const [logActionFilter, setLogActionFilter] = useState("ALL")
    const [logTableFilter, setLogTableFilter] = useState("ALL")
    const [expandedLogId, setExpandedLogId] = useState(null)
    const [searchLogQuery, setSearchLogQuery] = useState("")
    const [showSqlGuide, setShowSqlGuide] = useState(false)

    const fetchAuditLogs = async () => {
        setLogsLoading(true)
        setLogsError(null)
        try {
            const { data, error } = await supabase
                .from('audit_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50)

            if (error) {
                if (error.code === '42P01' || error.message?.includes('relation "public.audit_logs" does not exist')) {
                    setLogsError("TABLE_NOT_FOUND")
                } else {
                    setLogsError(error.message)
                }
                setAuditLogs([])
            } else {
                setAuditLogs(data || [])
            }
        } catch (err) {
            setLogsError(err.message || "Failed to fetch logs")
            setAuditLogs([])
        } finally {
            setLogsLoading(false)
        }
    }

    useEffect(() => {
        fetchAuditLogs()
    }, [])

    const getLogRecordName = (log) => {
        const data = log.new_data || log.old_data
        if (!data) return log.record_id ? `ID #${log.record_id}` : "Unknown Item"
        return (
            data.article_headline ||
            data.headline ||
            data.release_title ||
            data.title ||
            data.staff_display_name ||
            data.staff_pseudonym ||
            data.header ||
            data.youtube_title ||
            (log.record_id ? `ID #${log.record_id}` : "Item")
        )
    }

    const getChangedFields = (oldData, newData) => {
        if (!oldData || !newData) return []
        const changed = []
        const allKeys = Array.from(new Set([...Object.keys(oldData), ...Object.keys(newData)]))
        allKeys.forEach(key => {
            if (['created_at', 'published_at', 'updated_at'].includes(key)) return
            const oldVal = JSON.stringify(oldData[key])
            const newVal = JSON.stringify(newData[key])
            if (oldVal !== newVal) {
                changed.push({ key, old: oldData[key], new: newData[key] })
            }
        })
        return changed
    }

    const formatLogDate = (dateStr) => {
        if (!dateStr) return ""
        const d = new Date(dateStr)
        if (isNaN(d.getTime())) return ""
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    const filteredLogs = auditLogs.filter(log => {
        if (logActionFilter !== "ALL" && log.action !== logActionFilter) return false
        if (logTableFilter !== "ALL" && log.table_name !== logTableFilter) return false
        if (searchLogQuery.trim()) {
            const q = searchLogQuery.toLowerCase()
            const name = getLogRecordName(log).toLowerCase()
            const email = (log.user_email || "").toLowerCase()
            const table = (log.table_name || "").toLowerCase()
            return name.includes(q) || email.includes(q) || table.includes(q)
        }
        return true
    })

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
                        <Link to="/admin/manage-pubmats" style={{ textDecoration: "none", color: "inherit" }} className="Admin-Quick-Actions">
                            <p> Manage Pubmats </p>
                        </Link>
                        <Link to="/admin/audit-logs" style={{ textDecoration: "none", color: "inherit" }} className="Admin-Quick-Actions">
                            <p> 📋 View Activity & Audit Logs </p>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Activity & Audit Preview */}
            <div className="Admin-Dashboard-Audit-Section">
                <div className="Audit-Logs-Card">
                    <div className="Audit-Logs-Header" style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem", marginBottom: "1rem" }}>
                        <div className="Audit-Logs-Title">
                            <h2>Recent Activity</h2>
                            <p>Recent database changes across articles, staff, and pubmats.</p>
                        </div>
                        <Link
                            to="/admin/audit-logs"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.4rem",
                                background: "#0265A9",
                                color: "#ffffff",
                                padding: "0.6rem 1.1rem",
                                borderRadius: "8px",
                                textDecoration: "none",
                                fontSize: "0.85rem",
                                fontWeight: "700"
                            }}
                        >
                            View All Activity & Audit Logs &rarr;
                        </Link>
                    </div>

                    {logsLoading ? (
                        <p style={{ color: "#64748b", padding: "1.5rem 0" }}>Loading recent activity...</p>
                    ) : auditLogs.length === 0 ? (
                        <div style={{ padding: "1.5rem 0", color: "#64748b" }}>
                            <p style={{ margin: "0 0 0.5rem 0" }}>No activity logs recorded yet.</p>
                            <Link to="/admin/audit-logs" style={{ color: "#0265A9", fontWeight: "700", fontSize: "0.85rem" }}>
                                Open Activity & Audit Center &rarr;
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {auditLogs.slice(0, 4).map(log => (
                                <div
                                    key={log.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "0.75rem 1rem",
                                        borderRadius: "8px",
                                        border: "1px solid #e2e8f0",
                                        background: "#ffffff",
                                        gap: "1rem",
                                        flexWrap: "wrap"
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                                        <span
                                            style={{
                                                fontSize: "0.75rem",
                                                fontWeight: "800",
                                                padding: "0.2rem 0.5rem",
                                                borderRadius: "4px",
                                                background: log.action === "INSERT" ? "#dcfce7" : log.action === "UPDATE" ? "#e0f2fe" : "#fee2e2",
                                                color: log.action === "INSERT" ? "#166534" : log.action === "UPDATE" ? "#0369a1" : "#991b1b"
                                            }}
                                        >
                                            {log.action === "INSERT" ? "+ Created" : log.action === "UPDATE" ? "✎ Edited" : "✕ Deleted"}
                                        </span>
                                        <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", background: "#f1f5f9", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                                            {log.table_name}
                                        </span>
                                        <strong style={{ fontSize: "0.9rem", color: "#0f172a" }}>
                                            {getLogRecordName(log)}
                                        </strong>
                                    </div>
                                    <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                                        <span>By <b>{log.user_email || "Admin"}</b> &bull; {formatLogDate(log.created_at)}</span>
                                    </div>
                                </div>
                            ))}

                            <div style={{ textAlign: "center", marginTop: "0.75rem" }}>
                                <Link
                                    to="/admin/audit-logs"
                                    style={{
                                        color: "#0265A9",
                                        fontWeight: "700",
                                        fontSize: "0.9rem",
                                        textDecoration: "none"
                                    }}
                                >
                                    View All {auditLogs.length} Records with Full Diff & Edit Shortcuts &rarr;
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard;