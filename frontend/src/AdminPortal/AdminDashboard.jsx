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
                        <a href="#activity-logs" style={{ textDecoration: "none", color: "inherit" }} className="Admin-Quick-Actions">
                            <p> 📋 View Activity Logs </p>
                        </a>
                    </div>
                </div>
            </div>

            {/* Audit & Activity Logs Section */}
            <div className="Admin-Dashboard-Audit-Section" id="activity-logs">
                <div className="Audit-Logs-Card">
                    <div className="Audit-Logs-Header">
                        <div className="Audit-Logs-Title">
                            <h2> Activity & Audit Logs </h2>
                            <p> Track who created, updated, or deleted articles, releases, staff, and other content. </p>
                        </div>
                        <button className="Audit-Refresh-Button" onClick={fetchAuditLogs} disabled={logsLoading}>
                            {logsLoading ? "Refreshing..." : "↻ Refresh Logs"}
                        </button>
                    </div>

                    {/* Controls & Filter Bar */}
                    <div className="Audit-Logs-Controls">
                        <div className="Audit-Action-Tabs">
                            {["ALL", "INSERT", "UPDATE", "DELETE"].map(action => (
                                <button
                                    key={action}
                                    className={`Audit-Action-Tab ${logActionFilter === action ? "active" : ""}`}
                                    onClick={() => setLogActionFilter(action)}
                                >
                                    {action === "ALL" ? "All Actions" : action === "INSERT" ? "Created (+)" : action === "UPDATE" ? "Updated (✎)" : "Deleted (✕)"}
                                </button>
                            ))}
                        </div>

                        <div className="Audit-Filters-Right">
                            <select
                                className="Audit-Table-Select"
                                value={logTableFilter}
                                onChange={(e) => setLogTableFilter(e.target.value)}
                            >
                                <option value="ALL">All Tables</option>
                                <option value="article">Articles</option>
                                <option value="staff">Staff</option>
                                <option value="releases">Releases</option>
                                <option value="pubmat">Pubmats</option>
                                <option value="videos">Videos</option>
                                <option value="homepage_slides">Slides</option>
                            </select>

                            <input
                                type="text"
                                className="Audit-Search-Input"
                                placeholder="Search by title, email..."
                                value={searchLogQuery}
                                onChange={(e) => setSearchLogQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Content / Logs List */}
                    {logsLoading ? (
                        <div className="Audit-Loading-State">
                            <p>Loading activity logs...</p>
                        </div>
                    ) : logsError === "TABLE_NOT_FOUND" ? (
                        <div className="Audit-Setup-Card">
                            <div className="Audit-Setup-Header">
                                <h3> Database Audit Trigger Setup Required</h3>
                                <p>
                                    To automatically track changes, create the <code>audit_logs</code> table and triggers in your Supabase project.
                                </p>
                            </div>
                            <button
                                className="Audit-Setup-Toggle"
                                onClick={() => setShowSqlGuide(!showSqlGuide)}
                            >
                                {showSqlGuide ? "Hide SQL Setup Script ▲" : "View SQL Setup Script ▼"}
                            </button>

                            {showSqlGuide && (
                                <div className="Audit-Sql-Box">
                                    <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                                        Copy and run this in your <b>Supabase Dashboard &rarr; SQL Editor</b>:
                                    </p>
                                    <pre className="Audit-Sql-Code">
{`-- 1. Create audit_logs table
create table if not exists public.audit_logs (
    id bigint generated by default as identity primary key,
    table_name text not null,
    action text not null,
    record_id text,
    user_id uuid,
    user_email text,
    old_data jsonb,
    new_data jsonb,
    created_at timestamp with time zone default now()
);

-- 2. Enable RLS
alter table public.audit_logs enable row level security;

create policy "Authenticated users can read audit logs"
on public.audit_logs for select to authenticated using (true);

-- 3. Create Trigger Function
create or replace function public.process_audit_log()
returns trigger language plpgsql security definer as $$
declare
    current_user_id uuid;
    current_user_email text;
    rec_id text;
    data_json jsonb;
begin
    current_user_id := auth.uid();
    current_user_email := auth.jwt() ->> 'email';

    if (tg_op = 'DELETE') then
        data_json := to_jsonb(old);
        rec_id := coalesce(
            data_json ->> 'article_id',
            data_json ->> 'staff_id',
            data_json ->> 'pubmat_id',
            data_json ->> 'id'
        );
        insert into public.audit_logs (table_name, action, record_id, user_id, user_email, old_data)
        values (tg_table_name, tg_op, rec_id, current_user_id, current_user_email, data_json);
        return old;
    elsif (tg_op = 'UPDATE') then
        data_json := to_jsonb(new);
        rec_id := coalesce(
            data_json ->> 'article_id',
            data_json ->> 'staff_id',
            data_json ->> 'pubmat_id',
            data_json ->> 'id'
        );
        insert into public.audit_logs (table_name, action, record_id, user_id, user_email, old_data, new_data)
        values (tg_table_name, tg_op, rec_id, current_user_id, current_user_email, to_jsonb(old), data_json);
        return new;
    elsif (tg_op = 'INSERT') then
        data_json := to_jsonb(new);
        rec_id := coalesce(
            data_json ->> 'article_id',
            data_json ->> 'staff_id',
            data_json ->> 'pubmat_id',
            data_json ->> 'id'
        );
        insert into public.audit_logs (table_name, action, record_id, user_id, user_email, new_data)
        values (tg_table_name, tg_op, rec_id, current_user_id, current_user_email, data_json);
        return new;
    end if;
    return null;
end;
$$;

-- 4. Attach Triggers
create or replace trigger audit_article_trigger
after insert or update or delete on public.article
for each row execute function public.process_audit_log();

create or replace trigger audit_releases_trigger
after insert or update or delete on public.releases
for each row execute function public.process_audit_log();

create or replace trigger audit_staff_trigger
after insert or update or delete on public.staff
for each row execute function public.process_audit_log();

create or replace trigger audit_pubmat_trigger
after insert or update or delete on public.pubmat
for each row execute function public.process_audit_log();`}
                                    </pre>
                                </div>
                            )}
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="Audit-Empty-State">
                            <p>No activity logs found {searchLogQuery || logActionFilter !== "ALL" || logTableFilter !== "ALL" ? "matching your filters" : "yet"}.</p>
                        </div>
                    ) : (
                        <div className="Audit-Logs-List">
                            {filteredLogs.map(log => {
                                const isExpanded = expandedLogId === log.id
                                const recordTitle = getLogRecordName(log)
                                const changedFields = log.action === "UPDATE" ? getChangedFields(log.old_data, log.new_data) : []

                                return (
                                    <div key={log.id} className={`Audit-Log-Item ${isExpanded ? "expanded" : ""}`}>
                                        <div className="Audit-Log-Row" onClick={() => setExpandedLogId(isExpanded ? null : log.id)}>
                                            <div className="Audit-Log-Left">
                                                <span className={`Audit-Badge badge-${(log.action || "").toLowerCase()}`}>
                                                    {log.action === "INSERT" ? "+ Created" : log.action === "UPDATE" ? "✎ Updated" : "✕ Deleted"}
                                                </span>
                                                <span className="Audit-Entity-Badge">
                                                    {log.table_name}
                                                </span>
                                                <div className="Audit-Log-Info">
                                                    <p className="Audit-Log-Title">{recordTitle}</p>
                                                    <p className="Audit-Log-Meta">
                                                        By <b>{log.user_email || "Admin User"}</b> &bull; {formatLogDate(log.created_at)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="Audit-Log-Right">
                                                <button className="Audit-Expand-Btn" type="button">
                                                    {isExpanded ? "Close Details ▲" : "View Details ▼"}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expanded Details / Diff Box */}
                                        {isExpanded && (
                                            <div className="Audit-Details-Box">
                                                <div className="Audit-Details-Meta">
                                                    <p><b>Record ID:</b> {log.record_id || "N/A"}</p>
                                                    <p><b>User ID:</b> {log.user_id || "N/A"}</p>
                                                    <p><b>Table:</b> {log.table_name}</p>
                                                    <p><b>Time:</b> {formatLogDate(log.created_at)}</p>
                                                </div>

                                                {log.action === "UPDATE" && changedFields.length > 0 && (
                                                    <div className="Audit-Diff-Section">
                                                        <h4>Changed Fields ({changedFields.length}):</h4>
                                                        <div className="Audit-Diff-List">
                                                            {changedFields.map(({ key, old: oldVal, new: newVal }) => (
                                                                <div key={key} className="Audit-Diff-Item">
                                                                    <span className="Audit-Diff-Key">{key}:</span>
                                                                    <div className="Audit-Diff-Values">
                                                                        <span className="Audit-Diff-Old">{typeof oldVal === "object" ? JSON.stringify(oldVal) : String(oldVal || "null")}</span>
                                                                        <span className="Audit-Diff-Arrow">&rarr;</span>
                                                                        <span className="Audit-Diff-New">{typeof newVal === "object" ? JSON.stringify(newVal) : String(newVal || "null")}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="Audit-Raw-Json-Section">
                                                    <h4>Full Record Data:</h4>
                                                    <div className="Audit-Json-Columns">
                                                        {log.old_data && (
                                                            <div className="Audit-Json-Column">
                                                                <p className="Audit-Json-Label">Previous Data:</p>
                                                                <pre>{JSON.stringify(log.old_data, null, 2)}</pre>
                                                            </div>
                                                        )}
                                                        {log.new_data && (
                                                            <div className="Audit-Json-Column">
                                                                <p className="Audit-Json-Label">New Data:</p>
                                                                <pre>{JSON.stringify(log.new_data, null, 2)}</pre>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard;