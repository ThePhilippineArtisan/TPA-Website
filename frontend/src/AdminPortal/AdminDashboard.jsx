import { supabase } from "../supabaseClient.js"
import React, { useState, useEffect} from "react"

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
            try{
                // Article Count
                const { count: totalArticlesCount } = await supabase
                    .from('article')
                    .select('*', { count: 'exact', head: true})

                // Staff Count
                const { count: totalStaffCount } = await supabase
                    .from('staff')
                    .select('*', { count: 'exact', head: true})
                
                // Images

                // Visits

                // Interval Website Visits

                // Releases Count
                const { count: totalReleasesCount } = await supabase
                    .from('releases')
                    .select('*', { count: 'exact', head: true})
                
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

                if(tagData){
                    const tagCounts = {}
                    tagData.forEach(row => {
                        [row.article_tag1, row.article_tag2, row.article_tag3].forEach(t => {
                            if(t && t.trim()){
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
            } catch (error){
                console.error("Error loading dashboard metrics: ", error)
            } finally{ 
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    return(
        <div className = "Admin-Dashboard">
            <div className = "Admin-Dashboard-Header">
                <h1> Welcome to the Admin Dashboard!</h1>
                <p> Check the website's stats, nerd crap, and everything in between. </p>
            </div>

            <div className = "Admin-Dashboard-BTN">
                <div className = "Admin-Dashboard-BTN-Stats">
                    <h3> { loading ? "..." : stats.totalArticles }</h3>
                    <p> Total Articles </p>
                    
                </div>

                <div className = "Admin-Dashboard-BTN-Stats">
                    <h3> { loading ? "..." : stats.totalStaff}</h3>
                    <p> Total Staff </p>
                </div>

                <div className = "Admin-Dashboard-BTN-Stats">
                    <h3> { loading ? "..." : stats.totalReleases }</h3>
                    <p> Total Releases </p>
                </div>

                <div className = "Admin-Dashboard-BTN-Stats">
                    <p> 23.26 GB / 100 GB </p>
                    <h3> Cloudflare R2 Image storage </h3>
                </div>
                <div className = "Admin-Dashboard-BTN-Stats">
                    <p> $123.67 </p>
                    <h3> Cloudflare monthly bill </h3>
                </div>
            </div>
            
            <hr></hr>
            <div className = "Admin-Dashboard-Bottom-BTN">
                <div className = "Admin-Dashboard-Superlative-Container">
                   <div>
                        <h2> Most recent posts </h2>
                        <div className = "Admin-Dashboard-Mosts">
                            <div>
                                <p> Nuremberg: Death Toll at Auschwitz climbs... </p>
                                <p id = "Author-Media-Provider-Name"> Jombag, Jombagin, Jombaggerists</p>
                            </div>
                            <div>
                                <p> <span> Makata Mondays </span></p>
                                <p>  6,000,000 visits </p>
                            </div>
                        </div>
                    </div>
 
                    <div >
                        <h2> Most popular tags </h2>
                        <p className = "Admin-Dashboard-Mosts"> • Dog-fighting rink</p>
                        <p className = "Admin-Dashboard-Mosts"> • Gawad Tek </p>
                        <p className = "Admin-Dashboard-Mosts"> • Earthquake Drill </p>
                    </div>
                    
                </div>

                <div className = "Admin-Dashboard-Quick-Actions">
                    <h2> Quick Actions </h2>
                    <div className = "Admin-Quick-Actions">
                        <p> Create an Article </p>
                    </div>
                    <div className = "Admin-Quick-Actions">
                        <p> Configure Website Showcase Slides </p>
                    </div>
                    <div className = "Admin-Quick-Actions">
                        <p> Add New Releases </p>
                    </div>
                    <div className = "Admin-Quick-Actions">
                        <p> Add New Staff </p>
                    </div>
                    <div className = "Admin-Quick-Actions">
                        <p> Add New YouTube Video Embed </p>
                    </div>
                    <div className = "Admin-Quick-Actions">
                        <p> Coming Soon... </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard;