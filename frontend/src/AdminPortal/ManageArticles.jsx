import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

import "./ManageArticles.css"
import "./ManageStaff.css"

const ManageArticles = () => {
    const [loading, setLoading] = useState(true)
    const [articles, setArticles] = useState([])

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
                            .select(`article_id, contribution_as,
                                staff(
                                    staff_id, staff_display_name, staff_last_name
                                )
                            `).in("article_id", articleIds)

                        // if(staffError){}

                        staffContributions = staffData || []
                    } catch(staffErr){
                        console.errror("Error fetching staff contributors: ", staffErr)
                    }

                    const mappedArticles = articlesData.map( article => {
                        const contributions = staffContributions.filter(
                            // the article id inside the article_staff is the same as is in article table
                            sc => sc.article_id === article.article_id) 
                            return {... article, article_staff: contributions}
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

    const getAuthorsString = (article) => {
        if(!article.article_staff || article.article_staff.length === 0){
            return "TPA"
        }
        const authors = article.article_staff
        .filter(articlestaff => articlestaff.contribution_as === "Author")
        .map(articlestaff => articlestaff.staff?.staff_last_name)
        .filter(Boolean)
        return authors.length > 0 ? authors.join(", ") : "TPA"
    }

    const getMedProvsString = (article) => {
        if (!article.article_staff || article.article_staff.length === 0)
            return "TPA"
        const MedProvs = article.article_staff
            .filter(articlestaff => articlestaff.contribution_as === "Media_Provider")
            .map(articlestaff => articlestaff.staff?.staff_last_name)
            .filter(Boolean)
        return MedProvs.length > 0 ? MedProvs.join(", ") : "TPA"
    }

    return(
        <div className = "Manage-Staff-Page">
            <div className = "Manage-Staff-Page-Header">
                <h1> Manage Articles </h1>                
                <p> Add or edit staff details 
                    <span> <a href="https://supabase.com/dashboard/project/uapnaylpxunquhievzzm/editor/31990?schema=public" target = "_blank"> here! </a> 
                    </span> <br></br> <br></br> </p>

            </div>

            <div className = "Manage-Staff-Grid-Container">
                {loading ? (
                    <div style={{ color: "black", padding: "5rem", textAlign: "center" }}>
                        <h3>Loading articles...</h3>
                    </div>
                ) : articles.length === 0 ? ( 
                    <div style={{ color: "black", padding: "5rem", textAlign: "center" }}>
                        <h3>No articles found.</h3>
                    </div>) : (
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
                            {articles.map((article) => (
                                <tr key = {article.article_id}>
                                    <td className = "Manage-Staff-Grid-Row"> {article.article_id} </td>
                                    <td className = "Manage-Staff-Grid-Row"> {article.article_type} </td>
                                    <td className = "Manage-Staff-Grid-Row" title = {article.article_headline}> {article.article_headline} </td>
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
                <div className = "Manage-Staff-Grid-Rows">

                </div>

            </div>
    )
}

export default ManageArticles;