import React, { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import { getArticleUrl } from "../utils/articleUtils"
import EditArticleModal from "./Modals/EditArticleModal.jsx"
import EditStaffModal from "./Modals/EditStaffModal.jsx"
import "./ManageAuditLogs.css"

const formatLogDate = (dateString) => {
    if (!dateString) return "N/A"
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return dateString

    const now = new Date()
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000)

    let relative = ""
    if (diffSec < 60) relative = "Just now"
    else if (diffSec < 3600) relative = `${Math.floor(diffSec / 60)}m ago`
    else if (diffSec < 86400) relative = `${Math.floor(diffSec / 3600)}h ago`
    else if (diffSec < 604800) relative = `${Math.floor(diffSec / 86400)}d ago`
    else relative = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })

    const formattedFull = d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    })

    return `${relative} (${formattedFull})`
}

const getLogRecordName = (log) => {
    const data = log.new_data || log.old_data || {}
    if (log.table_name === "article") {
        return data.article_headline || data.title || `Article #${log.record_id || "N/A"}`
    }
    if (log.table_name === "staff") {
        return data.staff_display_name ||
            `${data.staff_first_name || ""} ${data.staff_last_name || ""}`.trim() ||
            data.staff_pseudonym ||
            `Staff Member #${log.record_id || "N/A"}`
    }
    if (log.table_name === "releases") {
        return data.release_title || data.title || `Release #${log.record_id || "N/A"}`
    }
    if (log.table_name === "pubmat") {
        return data.title || `Pubmat #${log.record_id || "N/A"}`
    }
    if (log.table_name === "videos") {
        return data.video_title || data.title || `Video #${log.record_id || "N/A"}`
    }
    return data.title || data.name || data.headline || `Record #${log.record_id || "N/A"}`
}

const getChangedFields = (oldData, newData) => {
    if (!oldData || !newData) return []
    const ignored = ["updated_at", "edit_history", "created_at"]
    const allKeys = Array.from(new Set([...Object.keys(oldData), ...Object.keys(newData)]))
    const diffs = []

    for (const key of allKeys) {
        if (ignored.includes(key)) continue
        const oldVal = oldData[key]
        const newVal = newData[key]
        const oldStr = typeof oldVal === "object" ? JSON.stringify(oldVal) : String(oldVal ?? "")
        const newStr = typeof newVal === "object" ? JSON.stringify(newVal) : String(newVal ?? "")

        if (oldStr !== newStr) {
            diffs.push({ key, old: oldVal, new: newVal })
        }
    }
    return diffs
}

const ManageAuditLogs = () => {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [errorState, setErrorState] = useState(null)
    const [showSqlGuide, setShowSqlGuide] = useState(false)

    // Filters
    const [actionFilter, setActionFilter] = useState("ALL")
    const [tableFilter, setTableFilter] = useState("ALL")
    const [searchQuery, setSearchQuery] = useState("")
    const [expandedLogId, setExpandedLogId] = useState(null)

    // Modals for Direct Editing
    const [selectedArticleToEdit, setSelectedArticleToEdit] = useState(null)
    const [selectedStaffToEdit, setSelectedStaffToEdit] = useState(null)
    const [actionLoadingId, setActionLoadingId] = useState(null)

    const fetchLogs = async () => {
        setLoading(true)
        setErrorState(null)
        try {
            const { data, error } = await supabase
                .from("audit_logs")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(250)

            if (error) {
                if (error.code === "42P01" || error.message?.includes("does not exist") || error.code === "PGRST205") {
                    setErrorState("TABLE_NOT_FOUND")
                    setLogs([])
                } else {
                    throw error
                }
            } else {
                setLogs(data || [])
            }
        } catch (err) {
            console.error("Error fetching audit logs:", err)
            setErrorState(err.message || "Failed to load audit logs")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLogs()
    }, [])

    const handleEditArticleFromLog = async (log) => {
        if (log.action === "DELETE") {
            alert("This article was deleted from the database.")
            return
        }
        setActionLoadingId(log.id)
        try {
            const recordId = log.record_id || (log.new_data && log.new_data.article_id)
            if (!recordId) {
                alert("Cannot determine article ID from this log entry.")
                return
            }

            const { data, error } = await supabase
                .from("article")
                .select("*")
                .eq("article_id", recordId)
                .single()

            if (error || !data) {
                alert(`Article #${recordId} could not be found. It may have been deleted or archived.`)
                return
            }

            setSelectedArticleToEdit(data)
        } catch (err) {
            console.error("Error loading article for edit:", err)
            alert("Failed to load article: " + (err.message || err))
        } finally {
            setActionLoadingId(null)
        }
    }

    const handleEditStaffFromLog = async (log) => {
        if (log.action === "DELETE") {
            alert("This staff member was removed from the database.")
            return
        }
        setActionLoadingId(log.id)
        try {
            const recordId = log.record_id || (log.new_data && log.new_data.staff_id)
            if (!recordId) {
                alert("Cannot determine staff ID from this log entry.")
                return
            }

            const { data, error } = await supabase
                .from("staff")
                .select("*")
                .eq("staff_id", recordId)
                .single()

            if (error || !data) {
                alert(`Staff member #${recordId} could not be found.`)
                return
            }

            setSelectedStaffToEdit(data)
        } catch (err) {
            console.error("Error loading staff for edit:", err)
            alert("Failed to load staff member: " + (err.message || err))
        } finally {
            setActionLoadingId(null)
        }
    }

    const filteredLogs = logs.filter(log => {
        if (actionFilter !== "ALL" && log.action !== actionFilter) {
            return false
        }
        if (tableFilter !== "ALL" && log.table_name !== tableFilter) {
            return false
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim()
            const name = getLogRecordName(log).toLowerCase()
            const email = (log.user_email || "").toLowerCase()
            const table = (log.table_name || "").toLowerCase()
            const recId = String(log.record_id || "").toLowerCase()
            return name.includes(q) || email.includes(q) || table.includes(q) || recId.includes(q)
        }
        return true
    })

    return (
        <div className="Manage-Audit-Logs-Page">
            <div className="Manage-Audit-Logs-Header">
                <div className="Audit-Header-Title">
                    <h1>Activity & Audit Logs</h1>
                    <p>
                        Track who created, modified, or removed articles, staff, releases, and graphics with full diff inspection and direct edit shortcuts.
                    </p>
                </div>
                <div className="Audit-Header-Actions">
                    <button
                        type="button"
                        className="Audit-Refresh-Btn"
                        onClick={fetchLogs}
                        disabled={loading}
                    >
                        {loading ? "Refreshing..." : "↻ Refresh Logs"}
                    </button>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="Audit-Filter-Toolbar">
                <div className="Audit-Filter-Group-Actions">
                    {["ALL", "INSERT", "UPDATE", "DELETE"].map(action => (
                        <button
                            key={action}
                            type="button"
                            className={`Audit-Action-Chip ${actionFilter === action ? "active" : ""}`}
                            onClick={() => setActionFilter(action)}
                        >
                            {action === "ALL" && "All Actions"}
                            {action === "INSERT" && "+ Created"}
                            {action === "UPDATE" && "✎ Edited"}
                            {action === "DELETE" && "✕ Deleted"}
                        </button>
                    ))}
                </div>

                <div className="Audit-Filter-Group-Right">
                    <select
                        className="Audit-Table-Filter-Select"
                        value={tableFilter}
                        onChange={(e) => setTableFilter(e.target.value)}
                    >
                        <option value="ALL">All Tables</option>
                        <option value="article">Articles</option>
                        <option value="staff">Staff Members</option>
                        <option value="releases">Releases</option>
                        <option value="pubmat">Pubmats</option>
                        <option value="videos">Videos</option>
                        <option value="homepage_slides">Homepage Slides</option>
                    </select>

                    <div className="Audit-Search-Input-Wrapper">
                        <input
                            type="text"
                            placeholder="Search by title, email, or record ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="Audit-Search-Input"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className="Audit-Search-Clear-Btn"
                                onClick={() => setSearchQuery("")}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content area */}
            {loading ? (
                <div className="Audit-Status-Card">
                    <p>Loading activity logs...</p>
                </div>
            ) : errorState === "TABLE_NOT_FOUND" ? (
                <div className="Audit-Setup-Card">
                    <div className="Audit-Setup-Header">
                        <h3>Database Audit Trigger Setup Required</h3>
                        <p>
                            To automatically track all edits and deletions, run the audit log trigger script in your Supabase SQL Editor.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="Audit-Setup-Toggle"
                        onClick={() => setShowSqlGuide(!showSqlGuide)}
                    >
                        {showSqlGuide ? "Hide SQL Setup Script ▲" : "View SQL Setup Script ▼"}
                    </button>

                    {showSqlGuide && (
                        <div className="Audit-Sql-Box">
                            <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
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
        rec_id := coalesce(data_json ->> 'article_id', data_json ->> 'staff_id', data_json ->> 'pubmat_id', data_json ->> 'id');
        insert into public.audit_logs (table_name, action, record_id, user_id, user_email, old_data)
        values (tg_table_name, tg_op, rec_id, current_user_id, current_user_email, data_json);
        return old;
    elsif (tg_op = 'UPDATE') then
        data_json := to_jsonb(new);
        rec_id := coalesce(data_json ->> 'article_id', data_json ->> 'staff_id', data_json ->> 'pubmat_id', data_json ->> 'id');
        insert into public.audit_logs (table_name, action, record_id, user_id, user_email, old_data, new_data)
        values (tg_table_name, tg_op, rec_id, current_user_id, current_user_email, to_jsonb(old), data_json);
        return new;
    elsif (tg_op = 'INSERT') then
        data_json := to_jsonb(new);
        rec_id := coalesce(data_json ->> 'article_id', data_json ->> 'staff_id', data_json ->> 'pubmat_id', data_json ->> 'id');
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
                <div className="Audit-Status-Card">
                    <p>No activity logs found matching your selected filters.</p>
                </div>
            ) : (
                <div className="Audit-Logs-Container">
                    <div className="Audit-Logs-Summary-Bar">
                        <span>Showing {filteredLogs.length} activity event{filteredLogs.length === 1 ? "" : "s"}</span>
                    </div>

                    <div className="Audit-Cards-List">
                        {filteredLogs.map(log => {
                            const isExpanded = expandedLogId === log.id
                            const recordTitle = getLogRecordName(log)
                            const changedFields = log.action === "UPDATE" ? getChangedFields(log.old_data, log.new_data) : []
                            const isActionLoading = actionLoadingId === log.id

                            const isArticle = log.table_name === "article"
                            const isStaff = log.table_name === "staff"
                            const isDeleted = log.action === "DELETE"
                            const articleData = log.new_data || log.old_data || {}

                            return (
                                <div key={log.id} className={`Audit-Log-Card ${isExpanded ? "is-expanded" : ""}`}>
                                    <div className="Audit-Card-Main-Row">
                                        <div className="Audit-Card-Left-Info">
                                            <div className="Audit-Card-Badges">
                                                <span className={`Audit-Action-Badge badge-${(log.action || "").toLowerCase()}`}>
                                                    {log.action === "INSERT" && "+ Created"}
                                                    {log.action === "UPDATE" && "✎ Edited"}
                                                    {log.action === "DELETE" && "✕ Deleted"}
                                                </span>
                                                <span className="Audit-Table-Badge">
                                                    {log.table_name}
                                                </span>
                                                {log.record_id && (
                                                    <span className="Audit-Record-Id-Badge">
                                                        #{log.record_id}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="Audit-Card-Headline">{recordTitle}</h3>

                                            <div className="Audit-Card-Metadata">
                                                <span>User: <strong>{log.user_email || "System / Admin"}</strong></span>
                                                <span>•</span>
                                                <span>{formatLogDate(log.created_at)}</span>
                                                {log.action === "UPDATE" && changedFields.length > 0 && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="Audit-Fields-Changed-Count">
                                                            {changedFields.length} field{changedFields.length > 1 ? "s" : ""} modified
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Direct Action Buttons */}
                                        <div className="Audit-Card-Actions-Row">
                                            {isArticle && !isDeleted && (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="Audit-Action-Btn Audit-Btn-Edit"
                                                        onClick={() => handleEditArticleFromLog(log)}
                                                        disabled={isActionLoading}
                                                    >
                                                        {isActionLoading ? "Loading..." : "✎ Edit Article"}
                                                    </button>
                                                    {articleData.is_published && (
                                                        <a
                                                            href={getArticleUrl(articleData)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="Audit-Action-Btn Audit-Btn-View"
                                                        >
                                                            Open Live ↗
                                                        </a>
                                                    )}
                                                </>
                                            )}

                                            {isStaff && !isDeleted && (
                                                <button
                                                    type="button"
                                                    className="Audit-Action-Btn Audit-Btn-Edit"
                                                    onClick={() => handleEditStaffFromLog(log)}
                                                    disabled={isActionLoading}
                                                >
                                                    {isActionLoading ? "Loading..." : "✎ Edit Staff Member"}
                                                </button>
                                            )}

                                            {log.table_name === "releases" && (
                                                <a
                                                    href="/admin/manage-releases"
                                                    className="Audit-Action-Btn Audit-Btn-Secondary"
                                                >
                                                    Manage Releases
                                                </a>
                                            )}

                                            {log.table_name === "pubmat" && (
                                                <a
                                                    href="/admin/manage-pubmats"
                                                    className="Audit-Action-Btn Audit-Btn-Secondary"
                                                >
                                                    Manage Pubmats
                                                </a>
                                            )}

                                            <button
                                                type="button"
                                                className="Audit-Action-Btn Audit-Btn-Expand"
                                                onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                                            >
                                                {isExpanded ? "Close Diff ▲" : "View Diff ▼"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Diff and JSON Details */}
                                    {isExpanded && (
                                        <div className="Audit-Card-Expanded-Details">
                                            {log.action === "UPDATE" && changedFields.length > 0 && (
                                                <div className="Audit-Diff-Container">
                                                    <h4>Modified Fields ({changedFields.length})</h4>
                                                    <div className="Audit-Diff-Table-Wrapper">
                                                        <table className="Audit-Diff-Table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Field</th>
                                                                    <th>Previous Value</th>
                                                                    <th>New Value</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {changedFields.map(({ key, old: oldVal, new: newVal }) => (
                                                                    <tr key={key}>
                                                                        <td className="Audit-Diff-Key-Cell"><code>{key}</code></td>
                                                                        <td className="Audit-Diff-Old-Cell">
                                                                            <pre>{typeof oldVal === "object" ? JSON.stringify(oldVal, null, 1) : String(oldVal || "(empty)")}</pre>
                                                                        </td>
                                                                        <td className="Audit-Diff-New-Cell">
                                                                            <pre>{typeof newVal === "object" ? JSON.stringify(newVal, null, 1) : String(newVal || "(empty)")}</pre>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="Audit-Json-Section">
                                                <h4>Raw Record Payloads</h4>
                                                <div className="Audit-Json-Cols">
                                                    {log.old_data && (
                                                        <div className="Audit-Json-Col">
                                                            <span className="Audit-Json-Label">Previous State (Before):</span>
                                                            <pre>{JSON.stringify(log.old_data, null, 2)}</pre>
                                                        </div>
                                                    )}
                                                    {log.new_data && (
                                                        <div className="Audit-Json-Col">
                                                            <span className="Audit-Json-Label">New State (After):</span>
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
                </div>
            )}

            {/* Direct Edit Modals */}
            {selectedArticleToEdit && (
                <EditArticleModal
                    article={selectedArticleToEdit}
                    onClose={() => setSelectedArticleToEdit(null)}
                    onSave={() => {
                        setSelectedArticleToEdit(null)
                        fetchLogs()
                    }}
                />
            )}

            {selectedStaffToEdit && (
                <EditStaffModal
                    staff={selectedStaffToEdit}
                    onClose={() => setSelectedStaffToEdit(null)}
                    onSave={() => {
                        setSelectedStaffToEdit(null)
                        fetchLogs()
                    }}
                />
            )}
        </div>
    )
}

export default ManageAuditLogs
