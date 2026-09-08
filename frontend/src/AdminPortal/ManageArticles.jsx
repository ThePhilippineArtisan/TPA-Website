import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../supabaseClient"
import { isMediaSegment, getMediaSegmentLabel, getArticleUrl} from "../utils/articleUtils.js"

import "./ManageArticles.css"
import "./ManageStaff.css"
import EditArticleModal from "./Modals/EditArticleModal.jsx"

const ManageArticles = () => {
    const [loading, setLoading] = useState(true)
    const [articles, setArticles] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedArticleToEdit, setSelectedArticleToEdit] = useState(null)

    const handleArticleUpdated = (updatedArt) => {
        setArticles((prev) =>
            prev.map((a) => (a.article_id === updatedArt.article_id ? { ...a, ...updatedArt } : a))
        )
    }

    useEffect(() => {
        const fetchArticles = async () => {
            try{
                const { data: articlesData, error: articlesError } = await supabase
                .from('article')
                .select(`*`)
                .order('published_at', { ascending: false })
                .limit(30)

                if(articlesError) {
                    throw articlesError
                }

                if(articlesData && articlesData.length > 0){
                    const articleIds = articlesData.map(a => a.article_id)
                    // array

                    let staffContributions = []
                    try{
                        const { data: staffData, error: staffError } = await supabase
                            .from("article_staff")
                            .select(`article_id, contribution_as, use_pseudonym,
                                staff(
                                    staff_id, staff_display_name, staff_last_name, staff_pseudonym
                                )
                            `).in("article_id", articleIds)

                        if(staffError){
                            console.error("Error fetching staff contributors: ", staffError)
                        }

                        staffContributions = staffData || []
                    } catch(staffErr){
                        console.error("Error fetching staff contributors: ", staffErr)
                    }

                    const mappedArticles = articlesData.map( article => {
                        const contributions = staffContributions.filter(
                            // the article id inside the article_staff is the same as is in article table
                            sc => sc.article_id === article.article_id) 
                            return { ... article, article_staff: contributions }
                    })

                    setArticles(mappedArticles)
                } else {
                    setArticles([])
                }
            } catch(err){
                console.error("Error fetching articles: ", err)
            } finally {
                setLoading(false)
            }
        }
        fetchArticles()
    }, [])

    const getContributorName = (articlestaff) => {
        if (articlestaff.use_pseudonym && articlestaff.staff?.staff_pseudonym) {
            return `${articlestaff.staff.staff_pseudonym} (Pseudonym)`
        }
        return articlestaff.staff?.staff_last_name || articlestaff.staff?.staff_display_name
    }

    const getAuthorsString = (article) => {
        if(!article.article_staff || article.article_staff.length === 0){
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

    const filteredArticles = articles.filter((article) => {
        if (!searchTerm.trim()) {
            return true
        }
        const query = searchTerm.toLowerCase().trim()
        const idMatch = String(article.article_id).includes(query)
        const typeMatch = article.article_type?.toLowerCase().includes(query)
        const headlineMatch = article.article_headline?.toLowerCase().includes(query)
        const authorMatch = getAuthorsString(article).toLowerCase().includes(query)
        const medProvMatch = getMedProvsString(article).toLowerCase().includes(query)
        return idMatch || typeMatch || headlineMatch || authorMatch || medProvMatch
    })

    return (
        <div className = "Manage-Staff-Page">
            <div className = "Manage-Staff-Page-Header">
                <h1> Manage Articles </h1>                
                <p> Click any article row below to edit its headline, type, publication status, date, tags, or content directly. </p>
            </div>

            <div className = "Admin-Search-Container">
                <div className = "Admin-Search-Input-Wrapper">
                    <svg className = "Admin-Search-Icon" width = "16" height = "16" viewBox = "0 0 24 24" fill = "none" stroke = "currentColor" strokeWidth = "2">
                        <circle cx = "11" cy = "11" r = "8" />
                        <line x1 = "21" y1 = "21" x2 = "16.65" y2 = "16.65" />
                    </svg>
                    <input
                        type = "text"
                        className = "Admin-Search-Input"
                        value = {searchTerm}
                        onChange = {(e) => setSearchTerm(e.target.value)}
                        placeholder = "Search by headline, category, ID, or author..."
                    />
                    {searchTerm && (
                        <button
                            type = "button"
                            className = "Admin-Search-Clear"
                            onClick = {() => setSearchTerm("")}
                        >
                            ✕
                        </button>
                    )}
                </div>
                <span style = {{ fontSize: "0.85rem", color: "#64748b" }}>
                    Showing {filteredArticles.length} of {articles.length} articles
                </span>
            </div>

            <div className = "Manage-Staff-Grid-Container">
                {loading ? (
                    <div style={{ color: "black", padding: "5rem", textAlign: "center" }}>
                        <h3>Loading articles...</h3>
                    </div>
                ) : filteredArticles.length === 0 ? ( 
                    <div style={{ color: "black", padding: "5rem", textAlign: "center" }}>
                        <h3>No articles found matching "{searchTerm}".</h3>
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
                                <th className="Manage-Staff-Grid-Column"> Publish Date </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredArticles.map((article) => (
                                <tr 
                                    key = {article.article_id}
                                    className = "Manage-Staff-Clickable-Row"
                                    onClick = {() => setSelectedArticleToEdit(article)}
                                    title = "Click to edit article"
                                >
                                    <td className = "Manage-Staff-Grid-Row"> {article.article_id} </td>
                                    <td className = "Manage-Staff-Grid-Row"> {article.article_type} </td>
                                    <td className="Manage-Staff-Grid-Row" style={{ textAlign: "left", maxWidth: "35ch", overflow: "hidden", textOverflow: "ellipsis" }} title={article.article_headline}>
                                        <span style={{ color: "var(--primary-blue)", fontWeight: "600" }}>
                                            {article.article_headline}
                                        </span>
                                    </td>
                                    <td className = "Manage-Staff-Grid-Row"> {getAuthorsString(article)} </td>
                                    <td className = "Manage-Staff-Grid-Row"> {getMedProvsString(article)} </td>
                                    <td className = "Manage-Staff-Grid-Row"> 
                                        {article.published_at ? new Date(article.published_at).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric"
                                        }) : "N/A"
                                        } </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

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

export default ManageArticles;