import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient.js"
import { getMediaSegmentLabel, isMediaSegment } from "../utils/articleUtils.js"
import React, { useState, useEffect } from "react"

import Photo2 from "../Sample-Photos/Multification-Invication.jpg"

import "../CSS/LatestPosts.css"

import CoverPhotoSearch from "../Components/CoverPhotoSearch.jsx";
import Tabs from "../Components/Tabs.jsx"

const LatestPosts = () => {

    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedFilters, setSelectedFilters] = useState([])
    const [visibleWeeks, setVisibleWeeks] = useState(3) // only three weeks

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                // 1. Fetch published articles
                const { data: articlesData, error: articlesError } = await supabase
                    .from('article')
                    .select(`
                        article_id,
                        article_headline,
                        article_type,
                        slug_headline,
                        published_at,
                        article_tag1,
                        article_tag2,
                        article_tag3,
                        article_media(
                            media(
                                media_url
                            )
                        )    
                    `)
                    .eq("is_published", true)
                    .order('published_at', { ascending: false })
                    .limit(21);

                if (articlesError) {
                    throw articlesError;
                }

                if (articlesData && articlesData.length > 0) {
                    const articleIds = articlesData.map(a => a.article_id);
                    
                    let staffContributions = [];
                    try {
                        // 2. Fetch staff contributions
                        const { data: staffData, error: staffError } = await supabase
                            .from("article_staff")
                            .select(`
                                article_id,
                                contribution_as,
                                staff(
                                    staff_id,
                                    staff_display_name
                                )
                            `)
                            .in("article_id", articleIds);

                        if (staffError) {
                            // 3. Fallback manually if relationship fetching fails
                            if (staffError.code === "PGRST200" || staffError.message?.includes("relationship")) {
                                const { data: rawStaffRel, error: rawStaffRelErr } = await supabase
                                    .from("article_staff")
                                    .select("article_id, contribution_as, staff_id")
                                    .in("article_id", articleIds);

                                if (!rawStaffRelErr && rawStaffRel && rawStaffRel.length > 0) {
                                    const staffIds = [...new Set(rawStaffRel.map(r => r.staff_id).filter(Boolean))];
                                    
                                    // Fetch staff details manually
                                    const { data: staffRows, error: staffRowsErr } = await supabase
                                        .from("staff")
                                        .select("staff_id, staff_display_name")
                                        .in("staff_id", staffIds);

                                    if (!staffRowsErr && staffRows) {
                                        staffContributions = rawStaffRel.map(rel => ({
                                            article_id: rel.article_id,
                                            contribution_as: rel.contribution_as,
                                            staff: staffRows.find(s => s.staff_id === rel.staff_id)
                                        })).filter(c => c.staff);
                                    }
                                }
                            } else {
                                throw staffError;
                            }
                        } else {
                            // Populate contributions if no error
                            staffContributions = staffData || [];
                        }
                    } catch (staffErr) {
                        console.error("Error fetching staff contributors: ", staffErr);
                    }

                    // 4. Map staff contributions back to articles
                    const mappedArticles = articlesData.map(article => {
                        const contributions = staffContributions.filter(
                            sc => sc.article_id === article.article_id
                        );
                        return {
                            ...article, 
                            article_staff: contributions
                        };
                    });

                    setArticles(mappedArticles);
                } else {
                    setArticles([]);
                }
            } catch (err) {
                console.error("Error fetching articles: ", err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const getAuthorsString = (article) => {
        if(!article.article_staff || article.article_staff.length === 0)
            return "The Philippine Artisan Staff"
        const authors = article.article_staff
            .filter(articlestaff => articlestaff.contribution_as === "Author")
            .map(articlestaff => articlestaff.staff?.staff_display_name)
            .filter(Boolean)
        return authors.length > 0 ? authors.join(", ") : "TPA Staff"
    }

    const formatWeekInterval = (start, end) => {
        const startMonth = String(start.getMonth() + 1).padStart(2, '0') 
        // + 1 because Jan = 0; padStart(2,  0) so it's '03' instead of just '3'
        const startDay = String(start.getDate()).padStart(2, '0')
        const startYear = start.getFullYear()

        const endMonth = String(end.getMonth() + 1).padStart(2, '0')
        const endDay = String(end.getDate()).padStart(2, '0')
        const endYear = end.getFullYear()

        // return as string formatted 1 week interval
        // like this: • 07 / 13-19 / 2026
        if(startYear !== endYear){
            return `• ${startMonth}/${startDay}/${startYear} - ${endMonth}/${endDay}/${endYear}`;
        }
        if (startMonth !== endMonth) {
            return `• ${startMonth}/${startDay} - ${endMonth}/${endDay} / ${startYear}`;
        }
        return `• ${startMonth} / ${startDay}-${endDay} / ${startYear}`;
    };
    
    const groupArticlesByWeek = (articlesList) => {
        const groups = {} // initiate map using timestamps

        articlesList.forEach(article =>{
            if(!article.published_at) 
                return // skip
            const date = new Date(article.published_at)

            if(isNaN(date.getTime())) 
                return // skip

            // Sunday = 0, Saturday is 6
            const start = new Date(date)
            const day = start.getDay()
            start.setDate(start.getDate() - day)
            start.setHours(0, 0, 0, 0)

            // end of week
            const end = new Date(start)
            end.setDate(start.getDate() + 6)
            end.setHours(23, 59, 59, 999)

            const key = start.getTime()
            if(!groups[key]){
                groups[key] = {
                    start,
                    end,
                    label: formatWeekInterval(start, end),
                    articles: []
                }
            }
            groups[key].articles.push(articles) // data structure stack, add
        })

        
        // Sort groups by start date descending
        return Object.keys(groups)
            .sort((a, b) => b - a) // timestamps, descending order
            .map(key => groups[key]); // sorted keys into article groups array

    }

    const filterMap = {
        "Just In": { type: "JUST_IN" },
        "In Case You Missed It!": { type: "ICYMI" },
        "Announcement": { type: "ANNOUNCEMENT" },
        "Advisory": { type: "ADVISORY" },
        "Alert": { type: "ALERT" },
        "Walang Pasok": { type: "WALANG_PASOK", tag: "walang pasok" },
        "University News": { type: "UNIVERSITY_NEWS" },
        "Local News": { type: "LOCAL_NEWS", tag: "local news" },
        "National News": { type: "NATIONAL_NEWS" },
        "International News": { type: "INTERNATIONAL_NEWS" },
        "Developing Story": { type: "DEVELOPING_STORY" },
        "Look": { type: "LOOK" },
        "In Photos": { type: "IN_PHOTOS", tag: "in photos" },
        "Highlights": { type: "HIGHLIGHTS", tag: "highlights" }
    }

    const handleFilterChange = (filterName => {
        setSelectedFilters(prev =>
            prev.includes(filterName)
                ? prev.filter(f => f !== filterName)
                : [...prev, filterName] // add latest toggled filter into the list
        )
        setVisibleWeeks(3)
    })

    const renderCheckbox = (filterName) => {
        return (
            <div className = "Individual-Filters" key = {filterName}>
                <input
                    type = "checkbox"
                    checked = {selectedFilters.includes(filterName)}
                    onChange = {() => handleFilterChange(filterName)}
                />
                <p> {filterName} </p>
            </div>
        )
    }

    const filteredArticles = articles.filter(article => {
        if(selectedFilters.length === 0)
            return true
        return selectedFilters.some(filterName => {
            const criteria = filterMap[filterName]
            if(!criteria)
                return false

            const typeMatch = criteria.type && article.article_type === criteria.type
            const tagMatch = criteria.tag && (
                (article.article_tag1 && article.article_tag1.toLowerCase().includes(criteria.tag)) ||
                (article.article_tag2 && article.article_tag1.toLowerCase().includes(criteria.tag)) ||
                (article.article_tag3 && article.article_tag1.toLowerCase().includes(criteria.tag))
            )
            return typeMatch || tagMatch
        })
    })

    const groupedWeeks = groupArticlesByWeek(filteredArticles)

    return (
        <div className="Latest-Posts-Page">
            <CoverPhotoSearch />
            <Tabs />
            <div className = "Latest-Article-Two-Part">
                <div className = "Latest-Articles-Container">
                    {loading ? (
                        <div style={{ color: "black", padding: "5rem", minHeight: "40dvh" }}>
                            <h3>Loading articles...</h3>
                        </div>
                        ) : groupedWeeks.length === 0 ? (
                            <div style={{ color: "black", padding: "5rem", minHeight: "40dvh" }}>
                                <h3>No articles found.</h3>
                            </div>
                        ) : (
                            groupedWeeks.slice(0, visibleWeeks).map((week, weekIdx) => (
                                <React.Fragment key = {weekIdx}>
                                    <div className="Latest-Articles-Date">
                                        <h1>{week.label}</h1>
                                        <hr className="Horizontal-Line-Date" />
                                    </div>
                                    <div className = "Day-Articles">
                                        <hr className = "Vertical-Line-Date" />
                                        <div className = "Three-Article-Column">
                                            {week.articles.map((article) => {
                                                const firstMedia = article.article_media?.[0]?.media?.media_url
                                                const authorsStr = getAuthorsString(article)
                                                const formattedDate = new Date(article.published_at).toLocaleDateString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric"
                                                })
                                                const detailLink = isMediaSegment(article.article_type) // use util
                                                ? `/media-segment/${article.article_id}/${article.slug_headline}`
                                                : `/article/${article.article_id}/${article.slug_headline}`

                                                return(
                                                    <Link to = {detailLink} className = "Individual-Article" key = {article.article_id}>
                                                        <img loading = "lazy" src = {firstMedia} alt = {article.article_headline} />
                                                        <div className = "Individual-Article-Texts">
                                                            <div className = "Individual-Article-Headline">
                                                                <p> {article.article_headline} </p>
                                                                <div className = "Latest-Posts-Article-Author-Time">
                                                                    <p> {authorsStr} </p>
                                                                    <p> {formattedDate} </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))
                    )}

                    {visibleWeeks < groupedWeeks.length && (
                        <div className="Load-More-Container">
                            <button className="Load-More-Button" onClick={() => setVisibleWeeks(prev => prev + 3)}>
                                Load More Articles
                            </button>
                        </div>
                    )}
                </div>


            <div className = "Latest-Post-Filters-Container">
                <div className = "Latest-Post-Filter">

                    <br></br><h3>Short-Form News</h3><br></br> 
                    <hr></hr>
                        <div>
                            {["Just In", "In Case You Missed It!", "Announcement", "Advisory", "Alert", "Walang Pasok"].map(renderCheckbox)}
                        </div>
                    
                    <br></br><h3>Long-Form News</h3><br></br>
                    <hr></hr>
                        <div>        
                            {["University News", "Local News", "National News", "International News", "Developing Story"].map(renderCheckbox)}
                        </div>

                    <br></br><h3>Look, In Photos, Highlights</h3><br></br> 
                    <hr></hr>
                    <div>       
                        {["Look", "In Photos", "Highlights"].map(renderCheckbox)}
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default LatestPosts;