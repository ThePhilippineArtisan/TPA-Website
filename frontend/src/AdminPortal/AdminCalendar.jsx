import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient.js"
import { getArticleUrl } from "../utils/articleUtils.js"

import "./AdminCalendar.css"

const AdminCalendar = () => {
    const [ currentDate, setCurrentDate ] = useState(new Date())
    const [ articles, setArticles ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ selectedArticle, setSelectedArticle ] = useState(null)
    const [ filterStatus, setFilterStatus ] = useState("ALL")

    const navigate = useNavigate()

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    useEffect(() => {
        const fetchMonthArticles = async () => {
            setLoading(true)
            try{
                const firstDay = new Date(year, month, 1, 0, 0, 0).toISOString()
                const lastDay = new Date(year, month + 1, 0, 23, 59, 59).toISOString()
            
                const { data, error } = await supabase
                    .from("article")
                    .select("article_id, article_headline, article_type, published_at, scheduled_at, is_published, slug_headline")
                
                if (error) throw error

                setArticles(data || [])
            } catch(err){
                console.error("Error fetching calendar: ", err)
            } finally {
                setLoading(false)
            }
        }
        fetchMonthArticles()
    }, [year, month])

    const getArticleStatus = (art) => {
        const now = new Date()
        const pubDate = art.published_at ? new Date(art.published_at) : null
        const schedDate = art.scheduled_at ? new Date(art.scheduled_at) : null

        if(art.is_published){
            if(pubDate && pubDate <= now){ return "published" }
            else { return "scheduled" }
        } else {
            if(schedDate && schedDate > now) {
                return "scheduled"
            } else if (pubDate && pubDate > now){
                return "scheduled"
            } return "draft"
        }
    }

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
    const resetToday = () => setCurrentDate(new Date())

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const startingWeekday = new Date(year, month, 1).getDay()

    const articlesByDate = {}
    let monthPublishedCount = 0
    let monthScheduledCount = 0
    let monthDraftCount = 0

    articles.forEach((art) => {
        const targetTimeStr = art.published_at || art.scheduled_at 
        if(!targetTimeStr) return

        const dateObj = new Date(targetTimeStr)
        if(isNaN(dateObj.getTime())) return

        if(dateObj.getFullYear() === year && dateObj.getMonth() === month){
            const status = getArticleStatus(art)
            if(status === "published") monthPublishedCount++
            else if(status === "scheduled") monthScheduledCount++
            else if(status === "darft") monthDraftCount++
        }

        const dateKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`
        const status = getArticleStatus(art)

        if (filterStatus !== "ALL" && status !== filterStatus.toLowerCase()) return

        if (!articlesByDate[dateKey]) {
            articlesByDate[dateKey] = []
        }
        articlesByDate[dateKey].push({ ...art, status, targetDate: dateObj })
    })

    return(
        <div className = "Content-Calendar-Container">
            <div className = "Calendar-Header-Row">
                <div>
                    <h1> Content Calendar </h1>
                    <p> Track published and scheduled articles here.</p>
                </div>
                
                <div className="Calendar-Header-Actions">
                    <button 
                        className="Calendar-Primary-Btn"
                        onClick={() => navigate("/admin/create-article")}
                    >
                        + Schedule Article
                    </button>
                </div>

                {/* Monthly Summary Stats */}
                <div className="Calendar-Stats-Bar">
                    <div className="Stat-Item">
                        <span className="Stat-Label">Published this month</span>
                        <span className="Stat-Value published">{monthPublishedCount}</span>
                    </div>
                    <div className="Stat-Item">
                        <span className="Stat-Label">Scheduled Queued</span>
                        <span className="Stat-Value scheduled">{monthScheduledCount}</span>
                    </div>
                    <div className="Stat-Item">
                        <span className="Stat-Label">Drafts</span>
                        <span className="Stat-Value draft">{monthDraftCount}</span>
                    </div>
                </div>
            </div>
            {/* Controls Bar */}
            <div className="Calendar-Controls-Bar">
                <div className="Month-Navigator">
                    <button className="Nav-Btn" onClick={prevMonth} title="Previous Month">&larr;</button>
                    <h2>{monthNames[month]} {year}</h2>
                    <button className="Nav-Btn" onClick={nextMonth} title="Next Month">&rarr;</button>
                    <button className="Today-Btn" onClick={resetToday}>Today</button>
                </div>

                <div className="Filter-Pills">
                    <button 
                        className={`Filter-Pill ${filterStatus === "ALL" ? "active" : ""}`}
                        onClick={() => setFilterStatus("ALL")}
                    >
                        All Posts
                    </button>
                    <button 
                        className={`Filter-Pill published ${filterStatus === "PUBLISHED" ? "active" : ""}`}
                        onClick={() => setFilterStatus("PUBLISHED")}
                    >
                        Published ({monthPublishedCount})
                    </button>
                    <button 
                        className={`Filter-Pill scheduled ${filterStatus === "SCHEDULED" ? "active" : ""}`}
                        onClick={() => setFilterStatus("SCHEDULED")}
                    >
                        Scheduled ({monthScheduledCount})
                    </button>
                    <button 
                        className={`Filter-Pill draft ${filterStatus === "DRAFT" ? "active" : ""}`}
                        onClick={() => setFilterStatus("DRAFT")}
                    >
                        Drafts ({monthDraftCount})
                    </button>
                </div>
            </div>

            {/* Main Calendar Grid */}
            <div className="Calendar-Grid-Wrapper">
                {loading ? (
                    <div className="Calendar-Loading">
                        <h3>Loading editorial schedule...</h3>
                    </div>
                ) : (
                    <div className="Calendar-Grid">
                        {/* Day Names Header */}
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
                            <div key={dayName} className="Calendar-Weekday-Header">
                                {dayName}
                            </div>
                        ))}

                        {/* Empty Offset Cells */}
                        {Array.from({ length: startingWeekday }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="Calendar-Cell empty"></div>
                        ))}

                        {/* Month Days */}
                        {Array.from({ length: daysInMonth }).map((_, idx) => {
                            const dayNum = idx + 1
                            const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`
                            const dayArticles = articlesByDate[dateKey] || []

                            const now = new Date()
                            const isToday = 
                                now.getDate() === dayNum &&
                                now.getMonth() === month &&
                                now.getFullYear() === year

                            return (
                                <div 
                                    key={dayNum} 
                                    className={`Calendar-Cell ${isToday ? "is-today" : ""}`}
                                >
                                    <div className="Cell-Top-Bar">
                                        <span className={`Day-Number ${isToday ? "today-badge" : ""}`}>
                                            {dayNum}
                                        </span>
                                        {isToday && <span className="Today-Text">Today</span>}
                                    </div>

                                    <div className="Cell-Articles-List">
                                        {dayArticles.map((art) => (
                                            <div 
                                                key={art.article_id}
                                                className={`Calendar-Article-Card status-${art.status}`}
                                                onClick={() => setSelectedArticle(art)}
                                                title={art.article_headline}
                                            >
                                                <div className="Card-Header">
                                                    <span className="Card-Type">
                                                        {art.article_type ? art.article_type.replace(/_/g, " ") : "ARTICLE"}
                                                    </span>
                                                    <span className="Card-Time">
                                                        {art.targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className="Card-Title">
                                                    {art.article_headline}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Selected Article Detail Modal */}
            {selectedArticle && (
                <div className="Calendar-Modal-Overlay" onClick={() => setSelectedArticle(null)}>
                    <div className="Calendar-Modal-Content" onClick={(e) => e.stopPropagation()}>
                        <div className="Modal-Header">
                            <span className={`Modal-Status-Badge status-${selectedArticle.status}`}>
                                {selectedArticle.status.toUpperCase()}
                            </span>
                            <button className="Modal-Close-Btn" onClick={() => setSelectedArticle(null)}>✕</button>
                        </div>

                        <h2>{selectedArticle.article_headline}</h2>

                        <div className="Modal-Details-Grid">
                            <div>
                                <strong>Category:</strong>
                                <p>{selectedArticle.article_type ? selectedArticle.article_type.replace(/_/g, " ") : "Standard Article"}</p>
                            </div>
                            <div>
                                <strong>Date & Time:</strong>
                                <p>{selectedArticle.targetDate.toLocaleString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}</p>
                            </div>
                            <div>
                                <strong>Article ID:</strong>
                                <p>#{selectedArticle.article_id}</p>
                            </div>
                        </div>

                        <div className="Modal-Footer-Actions">
                            <a 
                                href={getArticleUrl(selectedArticle)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="Modal-View-Btn"
                            >
                                Open Article View
                            </a>
                            <button 
                                className="Modal-Secondary-Btn"
                                onClick={() => setSelectedArticle(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminCalendar;