import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../supabaseClient"
import { isMediaSegment, getMediaSegmentLabel, getArticleUrl } from "../utils/articleUtils.js"
import { replaceUnderscore } from "../utils/slugifyUtils.js"

import "./ManageArticles.css"
import "./ManageStaff.css"
import EditArticleModal from "./Modals/EditArticleModal.jsx"

const ManageArticles = () => {
    const [loading, setLoading] = useState(true)
    const [articles, setArticles] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [selectedArticleToEdit, setSelectedArticleToEdit] = useState(null)

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(30)

    const handleArticleUpdated = (updatedArt) => {
        setArticles((prev) =>
            prev.map((a) => (a.article_id === updatedArt.article_id ? { ...a, ...updatedArt } : a))
        )
    }

    const fetchArticles = async () => {
        setLoading(true)
        try {
            // Fetch all articles without hardcoded 30-item limit
            const { data: articlesData, error: articlesError } = await supabase
                .from('article')
                .select(`*`)
                .order('published_at', { ascending: false })

            if (articlesError) {
                throw articlesError
            }

            if (articlesData && articlesData.length > 0) {
                const articleIds = articlesData.map(a => a.article_id)

                let staffContributions = []
                try {
                    // Chunk requests in batches of 80 to avoid URL length limitations
                    const chunkSize = 80
                    const chunks = []
                    for (let i = 0; i < articleIds.length; i += chunkSize) {
                        chunks.push(articleIds.slice(i, i + chunkSize))
                    }

                    const chunkResults = await Promise.all(
                        chunks.map(chunk =>
                            supabase
                                .from("article_staff")
                                .select(`article_id, contribution_as, use_pseudonym,
                                    staff(
                                        staff_id, staff_display_name, staff_last_name, staff_pseudonym
                                    )
                                `).in("article_id", chunk)
                        )
                    )

                    for (const res of chunkResults) {
                        if (res.data) {
                            staffContributions.push(...res.data)
                        }
                    }
                } catch (staffErr) {
                    console.error("Error fetching staff contributors: ", staffErr)
                }

                const mappedArticles = articlesData.map(article => {
                    const contributions = staffContributions.filter(
                        sc => sc.article_id === article.article_id
                    )
                    return { ...article, article_staff: contributions }
                })

                setArticles(mappedArticles)
            } else {
                setArticles([])
            }
        } catch (err) {
            console.error("Error fetching articles: ", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchArticles()
    }, [])

    // Reset to page 1 whenever search, status filter, or page size changes
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, statusFilter, pageSize])

    const getContributorName = (articlestaff) => {
        if (articlestaff.use_pseudonym && articlestaff.staff?.staff_pseudonym) {
            return `${articlestaff.staff.staff_pseudonym} (Pseudonym)`
        }
        return articlestaff.staff?.staff_last_name || articlestaff.staff?.staff_display_name
    }

    const getAuthorsString = (article) => {
        if (!article.article_staff || article.article_staff.length === 0) {
            return "TPA"
        }
        const authors = article.article_staff
            .filter(articlestaff => articlestaff.contribution_as === "Author")
            .map(getContributorName)
            .filter(Boolean)
        return authors.length > 0 ? authors.join(", ") : "TPA"
    }

    const getMedProvsString = (article) => {
        if (!article.article_staff || article.article_staff.length === 0)
            return "TPA"
        const MedProvs = article.article_staff
            .filter(articlestaff => articlestaff.contribution_as === "Media_Provider")
            .map(getContributorName)
            .filter(Boolean)
        return MedProvs.length > 0 ? MedProvs.join(", ") : "TPA"
    }

    const isArticlePinned = (article) => {
        if (!article) return false
        if (article.is_pinned === true || article.is_pinned === "true" || article.is_pinned === 1) return true
        const tags = [article.article_tag1, article.article_tag2, article.article_tag3]
            .filter(Boolean)
            .map(t => t.toLowerCase().trim())
        return tags.some(t => t === "pinned" || t === "featured" || t === "top" || t === "top story")
    }

    const handleTogglePin = async (e, article) => {
        e.stopPropagation()
        const currentlyPinned = isArticlePinned(article)
        const newPinnedState = !currentlyPinned
        let updatedTag1 = article.article_tag1
        let updatedTag2 = article.article_tag2
        let updatedTag3 = article.article_tag3

        const isPinTag = (t) => {
            if (!t) return false
            const lower = t.toLowerCase().trim()
            return lower === "pinned" || lower === "featured" || lower === "top" || lower === "top story"
        }

        if (currentlyPinned) {
            if (isPinTag(updatedTag1)) updatedTag1 = null
            if (isPinTag(updatedTag2)) updatedTag2 = null
            if (isPinTag(updatedTag3)) updatedTag3 = null
        }

        try {
            if (newPinnedState) {
                // Ensure single-pin exclusivity in database so only one story holds the spotlight
                await supabase
                    .from("article")
                    .update({ is_pinned: false })
                    .eq("is_pinned", true)
            }

            let { error } = await supabase
                .from("article")
                .update({
                    is_pinned: newPinnedState,
                    article_tag1: updatedTag1,
                    article_tag2: updatedTag2,
                    article_tag3: updatedTag3
                })
                .eq("article_id", article.article_id)

            if (error && (error.code === "PGRST204" || error.message?.includes("is_pinned"))) {
                const fallback = await supabase
                    .from("article")
                    .update({
                        article_tag1: updatedTag1,
                        article_tag2: updatedTag2,
                        article_tag3: updatedTag3
                    })
                    .eq("article_id", article.article_id)
                error = fallback.error
            }

            if (error) throw error

            setArticles(prev => prev.map(a => {
                if (a.article_id === article.article_id) {
                    return { ...a, is_pinned: newPinnedState, article_tag1: updatedTag1, article_tag2: updatedTag2, article_tag3: updatedTag3 }
                }
                if (newPinnedState && (a.is_pinned || isPinTag(a.article_tag1) || isPinTag(a.article_tag2) || isPinTag(a.article_tag3))) {
                    return {
                        ...a,
                        is_pinned: false,
                        article_tag1: isPinTag(a.article_tag1) ? null : a.article_tag1,
                        article_tag2: isPinTag(a.article_tag2) ? null : a.article_tag2,
                        article_tag3: isPinTag(a.article_tag3) ? null : a.article_tag3
                    }
                }
                return a
            }))
        } catch (err) {
            console.error("Error toggling pin:", err)
            alert("Could not update pin status: " + (err.message || err))
        }
    }

    const filteredArticles = useMemo(() => {
        return articles.filter((article) => {
            // Status filter
            if (statusFilter === "PUBLISHED" && !article.is_published) return false
            if (statusFilter === "DRAFT" && article.is_published) return false

            if (!searchTerm.trim()) {
                return true
            }
            const query = searchTerm.toLowerCase().trim()
            const idMatch = String(article.article_id).includes(query)
            const typeMatch = (article.article_type || "").toLowerCase().includes(query) ||
                getMediaSegmentLabel(article.article_type).toLowerCase().includes(query)
            const headlineMatch = (article.article_headline || "").toLowerCase().includes(query)
            const authorMatch = getAuthorsString(article).toLowerCase().includes(query)
            const medProvMatch = getMedProvsString(article).toLowerCase().includes(query)
            const tagMatch = [article.article_tag1, article.article_tag2, article.article_tag3]
                .filter(Boolean)
                .some(tag => tag.toLowerCase().includes(query))
            const statusMatch = (article.is_published ? "published" : "draft").includes(query)

            return idMatch || typeMatch || headlineMatch || authorMatch || medProvMatch || tagMatch || statusMatch
        })
    }, [articles, searchTerm, statusFilter])

    // Pagination calculations
    const totalArticles = filteredArticles.length
    const totalPages = Math.max(1, Math.ceil(totalArticles / pageSize))
    const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
    const startIndex = (safeCurrentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, totalArticles)
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

    // Generate smart page list
    const pageNumbers = useMemo(() => {
        const pages = []
        const maxButtons = 7

        if (totalPages <= maxButtons) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            pages.push(1)
            if (safeCurrentPage > 3) {
                pages.push("...")
            }

            const start = Math.max(2, safeCurrentPage - 1)
            const end = Math.min(totalPages - 1, safeCurrentPage + 1)

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) {
                    pages.push(i)
                }
            }

            if (safeCurrentPage < totalPages - 2) {
                pages.push("...")
            }

            if (!pages.includes(totalPages)) {
                pages.push(totalPages)
            }
        }
        return pages
    }, [totalPages, safeCurrentPage])

    return (
        <div className="Manage-Staff-Page">
            <div className="Manage-Staff-Page-Header">
                <h1> Manage Articles </h1>
                <p> Click any article row below to edit its headline, type, publication status, date, tags, or content directly. </p>
            </div>

            <div className="Admin-Search-Container Manage-Articles-Search-Container">
                <div className="Admin-Search-Input-Wrapper">
                    <svg className="Admin-Search-Icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        className="Admin-Search-Input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by headline, category, ID, author, tags..."
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            className="Admin-Search-Clear"
                            onClick={() => setSearchTerm("")}
                            aria-label="Clear search"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    )}
                </div>

                <div className="Manage-Articles-Controls-Group">
                    <div className="Manage-Articles-Filter-Item">
                        <label htmlFor="status-filter">Status:</label>
                        <select
                            id="status-filter"
                            className="Manage-Articles-Select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="PUBLISHED">Published Only</option>
                            <option value="DRAFT">Drafts Only</option>
                        </select>
                    </div>

                    <div className="Manage-Articles-Filter-Item">
                        <label htmlFor="page-size-select">Per page:</label>
                        <select
                            id="page-size-select"
                            className="Manage-Articles-Select"
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                            <option value={15}>15</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        className="Manage-Articles-Refresh-Btn"
                        onClick={fetchArticles}
                        title="Refresh articles from database"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            <div className="Manage-Staff-Grid-Container">
                {loading ? (
                    <div style={{ color: "black", padding: "5rem", textAlign: "center" }}>
                        <h3>Loading articles...</h3>
                    </div>
                ) : filteredArticles.length === 0 ? (
                    <div style={{ color: "black", padding: "5rem", textAlign: "center" }}>
                        <h3>No articles found matching your criteria.</h3>
                    </div>
                ) : (
                    <table className="Manage-Staff-Table">
                        <thead className="Manage-Staff-Grid-Columns">
                            <tr>
                                <th className="Manage-Staff-Grid-Column"> ID </th>
                                <th className="Manage-Staff-Grid-Column"> Type </th>
                                <th className="Manage-Staff-Grid-Column"> Headline </th>
                                <th className="Manage-Staff-Grid-Column"> Authors </th>
                                <th className="Manage-Staff-Grid-Column"> Media Providers </th>
                                <th className="Manage-Staff-Grid-Column"> Publish Date & Status </th>
                                <th className="Manage-Staff-Grid-Column" style={{ width: "190px" }}> Actions </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedArticles.map((article) => (
                                <tr
                                    key={article.article_id}
                                    className="Manage-Staff-Clickable-Row"
                                    onClick={() => setSelectedArticleToEdit(article)}
                                    title="Click to edit article"
                                >
                                    <td className="Manage-Staff-Grid-Row"> {article.article_id} </td>
                                    <td className="Manage-Staff-Grid-Row">
                                        {article.article_type ? replaceUnderscore(article.article_type) : "Standard Article"}
                                    </td>
                                    <td className="Manage-Staff-Grid-Row" style={{ textAlign: "left", maxWidth: "35ch", overflow: "hidden", textOverflow: "ellipsis" }} title={article.article_headline}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            {isArticlePinned(article) && (
                                                <span className="Badge-Pinned-Table" title="Pinned to Front Page / Facade">
                                                    Pinned
                                                </span>
                                            )}
                                            <span style={{ color: "var(--primary-blue)", fontWeight: "600" }}>
                                                {article.article_headline}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="Manage-Staff-Grid-Row"> {getAuthorsString(article)} </td>
                                    <td className="Manage-Staff-Grid-Row"> {getMedProvsString(article)} </td>
                                    <td className="Manage-Staff-Grid-Row">
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                                            <span>
                                                {article.published_at ? new Date(article.published_at).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric"
                                                }) : "No Date"}
                                            </span>
                                            <span className={`Article-Status-Badge ${article.is_published ? "status-published" : "status-draft"}`}>
                                                {article.is_published ? "Published" : "Draft"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="Manage-Staff-Grid-Row" style={{ whiteSpace: "nowrap" }}>
                                        <button
                                            type="button"
                                            className={`Manage-Article-Pin-Btn ${isArticlePinned(article) ? "is-pinned" : ""}`}
                                            onClick={(e) => handleTogglePin(e, article)}
                                            title={isArticlePinned(article) ? "Unpin story from homepage" : "Pin story to top of homepage"}
                                        >
                                            {isArticlePinned(article) ? "Unpin" : "Pin"}
                                        </button>
                                        <button
                                            type="button"
                                            className="Manage-Article-Edit-Btn"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedArticleToEdit(article)
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <a
                                            href={getArticleUrl(article)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="Manage-Article-View-Btn"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            View
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination Controls */}
            {totalArticles > 0 && (
                <div className="Manage-Articles-Pagination">
                    <div className="Pagination-Info">
                        Showing <strong>{startIndex + 1}</strong>–<strong>{endIndex}</strong> of <strong>{totalArticles}</strong> articles
                        {filteredArticles.length !== articles.length && (
                            <span className="Pagination-Filter-Note"> (filtered from {articles.length} total)</span>
                        )}
                    </div>

                    <div className="Pagination-Controls-Wrapper">
                        <div className="Pagination-Nav">
                            <button
                                type="button"
                                className="Pagination-Btn"
                                onClick={() => setCurrentPage(1)}
                                disabled={safeCurrentPage === 1}
                                title="First Page"
                            >
                                «
                            </button>
                            <button
                                type="button"
                                className="Pagination-Btn"
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={safeCurrentPage === 1}
                                title="Previous Page"
                            >
                                ‹ Prev
                            </button>

                            {pageNumbers.map((page, idx) =>
                                page === "..." ? (
                                    <span key={`ellipsis-${idx}`} className="Pagination-Ellipsis">...</span>
                                ) : (
                                    <button
                                        key={page}
                                        type="button"
                                        className={`Pagination-Btn ${safeCurrentPage === page ? "active" : ""}`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                )
                            )}

                            <button
                                type="button"
                                className="Pagination-Btn"
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={safeCurrentPage === totalPages}
                                title="Next Page"
                            >
                                Next ›
                            </button>
                            <button
                                type="button"
                                className="Pagination-Btn"
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={safeCurrentPage === totalPages}
                                title="Last Page"
                            >
                                »
                            </button>
                        </div>

                        {totalPages > 3 && (
                            <div className="Pagination-Jump">
                                <span>Go to:</span>
                                <input
                                    type="number"
                                    min="1"
                                    max={totalPages}
                                    value={safeCurrentPage}
                                    onChange={(e) => {
                                        const p = parseInt(e.target.value, 10)
                                        if (!isNaN(p) && p >= 1 && p <= totalPages) {
                                            setCurrentPage(p)
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selectedArticleToEdit && (
                <EditArticleModal
                    article={selectedArticleToEdit}
                    onClose={() => setSelectedArticleToEdit(null)}
                    onSave={handleArticleUpdated}
                />
            )}
        </div>
    )
}

export default ManageArticles