import {useEffect, useState} from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../supabaseClient.js"
import { formatDateReadable } from "../utils/dateUtils.js"

import VerticalFastNews from "../Components/VerticalFastNews.jsx";
import "../CSS/ArticlePage.css"
import AnimatedLoader from "./AnimatedLoader.jsx";

const ArticlePage = () => {

    const { articleId } = useParams(); // get the articleId from the URL parameters

    const [articleDetails, setArticleDetails] = useState(null)
    const [mediaUrls, setMediaUrls] = useState([])
    const [currentPhoto, setCurrentPhoto] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchArticleDetails = async () => {
            if(!articleId) return

            setIsLoading(true)
            setError(null)

            try { // from article, take all, in article, article_staff*, article_media*, media*
                const query = supabase
                .from("article")
                .select(`
                    *, 
                    article_media(
                        media_order,
                        media(
                            media_id,
                            media_url
                            )
                        )
                    `)

                // Check if parameter is a hybrid (ID-slug), numeric ID, or slug headline
                const idMatch = articleId.match(/^(\d+)-/);
                if (idMatch) {
                    query.eq("article_id", parseInt(idMatch[1], 10));
                } else if (/^\d+$/.test(articleId)) {
                    query.eq("article_id", parseInt(articleId, 10));
                } else {
                    query.eq("slug_headline", articleId);
                }

                const {data: articleData, error: fetchError } = await query.maybeSingle()

                if (fetchError)
                    throw fetchError
                if(!articleData){
                    setError("Article not found.")
                    return
                }
                // Fetch the related staff contributions separately to bypass lack of FK relations in PostgreSQL
                let staffContributions = [];
                try {
                    const { data: staffData, error: staffError } = await supabase
                        .from("article_staff")
                        .select(`
                            contribution_as,
                            staff (
                                staff_id,
                                staff_display_name
                            )
                        `)
                        .eq("article_id", articleData.article_id);

                    if (staffError) {
                        // Resilient fallback if foreign key constraint is missing on article_staff -> staff
                        if (staffError.code === "PGRST200" || staffError.message?.includes("relationship")) {
                            console.warn("No FK relationship between article_staff and staff. Fetching manually...");
                            const { data: rawStaffRel, error: rawStaffRelErr } = await supabase
                                .from("article_staff")
                                .select("contribution_as, staff_id")
                                .eq("article_id", articleData.article_id);

                            if (!rawStaffRelErr && rawStaffRel && rawStaffRel.length > 0) {
                                const staffIds = rawStaffRel.map(r => r.staff_id).filter(Boolean);
                                const { data: staffRows, error: staffRowsErr } = await supabase
                                    .from("staff")
                                    .select("staff_id, staff_display_name")
                                    .in("staff_id", staffIds);

                                if (!staffRowsErr && staffRows) {
                                    staffContributions = rawStaffRel.map(rel => ({
                                        contribution_as: rel.contribution_as,
                                        staff: staffRows.find(s => s.staff_id === rel.staff_id)
                                    })).filter(c => c.staff);
                                }
                            }
                        } else {
                            throw staffError;
                        }
                    } else {
                        staffContributions = staffData || [];
                    }
                } catch (staffErr) {
                    console.error("Non-blocking error fetching staff contributors:", staffErr);
                }

                // Combine the fetched article data with its staff contributions
                setArticleDetails({
                    ...articleData,
                    article_staff: staffContributions
                });

                // sort media by media_order
                if(articleData.article_media && articleData.article_media.length > 0){
                    const sortedMedia = [...articleData.article_media].sort(
                        (a, b) => (a.media_order || 0) - (b.media_order || 0)
                    )
                    const urls = sortedMedia
                        .map((item) => item.media?.media_url)
                        .filter(Boolean)
                        // if you want to limit how much photos are taken, uncomment this .slice(0,7)
                    setMediaUrls(urls)
                    setCurrentPhoto(urls[0] || null)
                } else {
                    setMediaUrls([])
                    setCurrentPhoto(null)
                }
            } catch(err){
                console.error("Error fetching article details: ", err)
                setError(err.message || "An error occurred while fetching the articles.")
            } finally {
                setIsLoading(false)
            }
        };
        fetchArticleDetails() // call the function before loading 
    }, [articleId])

    if(isLoading) {
        return <AnimatedLoader />
    }

    if (error || !articleDetails) {
        return (
            <div className="Article-Page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", flexDirection: "column" }}>
                <h2>Oops! Article not found.</h2>
                <p style={{ color: "#0265A9", marginTop: "10px" }}>{"The article you are looking for does not exist."}</p>
            </div>
        );
    }

    const authors = articleDetails.article_staff ? articleDetails.article_staff
        .filter((as) => as.contribution_as === "Author")
        .map((as) => as.staff?.staff_display_name)
        .filter(Boolean)
        : []

    const mediaProviders = articleDetails.article_staff
        ? articleDetails.article_staff
              .filter((as) => as.contribution_as === "Media_Provider")
              .map((as) => as.staff?.staff_display_name)
              .filter(Boolean)
        : [];

    // Tags
    const tags = [
        articleDetails.article_type,
        articleDetails.article_tag1,
        articleDetails.article_tag2,
        articleDetails.article_tag3
    ].filter((tag) => tag && tag !== "NULL" && tag !== "");

    return( 
        <div className = "Article-Page">
            
            <div className = "Article-Headline">
                <div className = "Simple-Tag"> 
                    <h4>  {tags.join(", ").replace(/_/g, " ")} </h4>  
                </div>
                
                <h1> {articleDetails.article_headline} </h1>

                <hr></hr>

                <div className = "Author-and-Date">                
                    <div className = "Author">
                        {authors.length > 0 ? (
                            authors.map((display_name, idx) => (
                                <a key = {idx}>
                                    <h3> {display_name} {idx < authors.length - 1 ? ", " : ""}</h3>
                                </a>
                            ))
                        ) : ( 
                            <a>
                                <h3>TPA Staff</h3>
                            </a>
                        )}
                    </div>

                    <div className = "Date">
                        <a> <h3> {formatDateReadable(articleDetails.published_at)} </h3> </a>
                    </div>
                </div>

            </div>

            <div style={{display: "flex", justifyContent: "center"}}>
                {currentPhoto && (
                    <div className = "Foreground-Photo ">
                        <img src = {currentPhoto} alt = {articleDetails.article_headline} loading = "lazy"/>                
                    </div>
                )}
                
{/** 
                <div className = "Extra-Photos-Container-Two">
                    <div className = "Extra-Photos"> 
                        
                        {photos.slice(0).map((photo, index) => (
                            <img
                                key = {index}
                                src = {photo}
                                loading = "lazy"
                                onClick = {() => setCurrentPhoto(photo)}
                                style = {{ cursor: "pointer" }}
                            />
                        ))}
                        
                        {/** <img loading = "lazy" src = {ARROW} style = {{cursor: "pointer", height: "3rem"}}/>
                    </div>
                </div>
*/}
            </div>

            <div className = "Photo-Illustration-Layout-Credits" style = {{textAlign: "center"}}> 
                Photos by {mediaProviders.join(", ")}
            </div>

            {mediaUrls.length > 1 && (
            <div className = "Extra-Photos-Container">
                <div className = "Extra-Photos">         
                    {mediaUrls.map((photo, index) => (
                        <img
                            key = {index}
                            src = {photo}
                            alt = {`Extra ${index + 1}`}
                            loading = "lazy"
                            onClick = {() => setCurrentPhoto(photo)}
                            style = {{ cursor: "pointer",
                                    border: photo === currentPhoto ? "3px solid #0265A9" : "none" }}
                        />
                    ))}
                    
                    {/** <img loading = "lazy" src = {ARROW} style = {{cursor: "pointer", height: "3rem"}}/> */} 
                </div>

            </div>
            )}  
            

            <div className = "Below-Small-Photos">
                <div className = "Article-Body" dangerouslySetInnerHTML={{ __html: articleDetails.article_body }}/>
                    
                <div>
                    <h4> <span style = {{color: "#0265A9"}}> 
                        Click this link to view the <a href = {articleDetails.article_source} >sources</a>, interview, or media used in this article. 
                    </span> </h4>
                    <h4> {articleDetails.word_count || 0 } words | {Math.ceil((articleDetails.word_count || 0) / 200)} minute read </h4>
                    <h4> Want to request full-quality images? <span style = {{color: "#0265A9"}}> <a>Click here.</a></span> </h4>
                    <hr ></hr>                 
                    <VerticalFastNews />
                </div>
            </div>
            <div style={{marginLeft: "10%", marginRight: "10%"}}>
                <hr style={{borderBottom: "2px solid #0265A9"}}></hr>
            </div>
            <h1 id = "Read-More"> READ MORE </h1>
            
            <div className = "Suggested-Articles">
                <div className = "Suggested-News">
                        <div className = "Three-News">
                            <a> TUPM Shifts from deathly afraid of the dark </a>
                        </div>
                        <div className = "Three-News">
                            <a> TUPM Shifts from deathly afraid of the dark </a>
                        </div>
                        <div className = "Three-News">  
                            <a> TUPM Shifts from deathly afraid of the dark </a>
                        </div>
                        
                </div>
            </div>
        </div>
    )
} 

export default ArticlePage;