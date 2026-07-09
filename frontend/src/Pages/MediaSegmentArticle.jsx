import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { supabase } from "../supabaseClient.js"
import { formatDateReadable } from "../utils/dateUtils.js"
import { isMediaSegment, getMediaSegmentLabel } from "../utils/articleUtils.js"
import AnimatedLoader from "./AnimatedLoader.jsx"

import "../CSS/MediaSegmentArticle.css"
import ListOfMediaSegments from "../Components/ListOfMediaSegments.jsx"
import "../CSS/LatestMediaSegment.css"
import VerticalFastNews from "../Components/VerticalFastNews.jsx";

const MediaSegmentArticle = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [articleDetails, setArticleDetails] = useState(null);
    const [mediaUrls, setMediaUrls] = useState([]);
    const [currentPhoto, setCurrentPhoto] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticleDetails = async () => {
            if (!id) return;

            setIsLoading(true);
            setError(null);

            try {
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
                    `);

                // Check if parameter is a hybrid (ID-slug), numeric ID, or slug headline
                const idMatch = id.match(/^(\d+)-/);
                if (idMatch) {
                    query.eq("article_id", parseInt(idMatch[1], 10));
                } else if (/^\d+$/.test(id)) {
                    query.eq("article_id", parseInt(id, 10));
                } else {
                    query.eq("slug_headline", id);
                }

                const { data: articleData, error: fetchError } = await query.maybeSingle();

                if (fetchError) throw fetchError;
                if (!articleData) {
                    setError("Article not found.");
                    return;
                }

                // If not a media segment, redirect to the normal article page
                if (!isMediaSegment(articleData.article_type)) {
                    navigate(`/article/${id}`, { replace: true });
                    return;
                }

                // Fetch staff contributions
                let staffContributions = [];
                try {
                    const { data: staffData, error: staffError } = await supabase
                        .from("article_staff")
                        .select(`
                            contribution_as,
                            staff (
                                staff_id,
                                staff_display_name,
                                staff_bio,
                                staff_picture
                            )
                        `)
                        .eq("article_id", articleData.article_id);

                    if (staffError) {
                        // Fallback
                        if (staffError.code === "PGRST200" || staffError.message?.includes("relationship")) {
                            const { data: rawStaffRel, error: rawStaffRelErr } = await supabase
                                .from("article_staff")
                                .select("contribution_as, staff_id")
                                .eq("article_id", articleData.article_id);

                            if (!rawStaffRelErr && rawStaffRel && rawStaffRel.length > 0) {
                                const staffIds = rawStaffRel.map(r => r.staff_id).filter(Boolean);
                                const { data: staffRows, error: staffRowsErr } = await supabase
                                    .from("staff")
                                    .select("staff_id, staff_display_name, staff_bio, staff_picture")
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

                setArticleDetails({
                    ...articleData,
                    article_staff: staffContributions
                });

                if (articleData.article_media && articleData.article_media.length > 0) {
                    const sortedMedia = [...articleData.article_media].sort(
                        (a, b) => (a.media_order || 0) - (b.media_order || 0)
                    );
                    const urls = sortedMedia
                        .map(item => item.media?.media_url)
                        .filter(Boolean);
                    setMediaUrls(urls);
                    setCurrentPhoto(urls[0] || null);
                } else {
                    setMediaUrls([]);
                    setCurrentPhoto(null);
                }
            } catch (err) {
                console.error("Error fetching article details: ", err);
                setError(err.message || "An error occurred while fetching the article.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticleDetails();
    }, [id, navigate]);

    if (isLoading) {
        return <AnimatedLoader />;
    }

    if (error || !articleDetails) {
        return (
            <div className="Media-Segment-Article-Page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", flexDirection: "column" }}>
                <h2>Oops! Media segment not found.</h2>
                <p style={{ color: "#0265A9", marginTop: "10px" }}>The media segment you are looking for does not exist.</p>
            </div>
        );
    }

    const authors = articleDetails.article_staff
        ? articleDetails.article_staff
              .filter(as => as.contribution_as === "Author")
              .map(as => as.staff)
              .filter(Boolean)
        : [];

    const mediaProviders = articleDetails.article_staff
        ? articleDetails.article_staff
              .filter(as => as.contribution_as === "Media_Provider")
              .map(as => as.staff)
              .filter(Boolean)
        : [];

    const firstAuthor = authors[0];


    return (
        <div className="Media-Segment-Article-Page">
            <div className="Media-Segment-Article">

                <div className="Media-Segment-Image">
                    {/** style={{ "--bgImage": `url(${"https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos/Features_Friday.jpg"})`}}  */}
                    <div className="Author-and-Details">
                        <div>
                            <span id="Week-Segment"> {getMediaSegmentLabel(articleDetails.article_type)} </span>
                            <h1> {articleDetails.article_headline} </h1>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <p id="Muted-Text"> 
                                    Written by {" "}
                                    {authors.length > 0 ? (
                                        authors.map((auth, idx) => (
                                            <span key = {auth.staff_id}>
                                                <Link to = {`/staff/${auth.staff_id}`}>
                                                    {auth.staff_display_name}
                                                {idx < authors.length - 1 ? ", " : ""}
                                                </Link>
                                            </span>
                                        ))
                                    ) : ( 
                                        "TPA Staff"
                                    )}
                                </p>
                                {mediaProviders.length > 0 && (
                                    <p id = "Muted-Text">
                                    {mediaProviders.length > 0 ? (
                                        mediaProviders.map((med, idx) => (
                                            <span key = {med.staff_id}>
                                                <Link to = {`/staff/${med.staff_id}`}>
                                                    {med.staff_display_name}
                                                {idx < mediaProviders.length - 1 ? ", " : ""}
                                                </Link>
                                            </span>
                                        ))
                                    ) : ( 
                                        "TPA Staff"
                                    )}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <img
                        src = {currentPhoto}
                        alt = {articleDetails.article_headline}
                    />
                </div>

                <div className="Media-Segment-Article-Below-Photo">
                    <div className="Author-and-Details">
                        <div>
                            <h3> <span> {authors.length > 1 ? "About the Author" : "About the Author"} </span>  </h3> <br></br>
                            {authors.length > 0 ? (
                                authors.map((auth, idx) => (
                                    <div key={auth.staff_id} style={{ marginBottom: idx < authors.length - 1 ? "1.5rem" : "0" }}>
                                        {authors.length > 1 && (
                                            <h4 style={{ color: "#0265A9", fontWeight: "bold", marginBottom: "0.25rem" }}>
                                                {auth.staff_display_name}
                                            </h4>
                                        )}
                                        <h5>{auth.staff_bio || "No bio available."}</h5>
                                    </div>
                                ))
                            ) : (
                                <h5>No bio available.</h5>
                            )}
                            <br></br>
                            <h5> Published on <span> {formatDateReadable(articleDetails.published_at)} </span></h5>

                            <h5> {articleDetails.word_count || 0} <span>words</span> | {Math.ceil((articleDetails.word_count || 0) / 200 <span>min read</span></h5> <br></br>
                            <h5> <span> Click this link to view the sources, interview, or media used in this article. </span> </h5>
                            <br></br>
                            {articleDetails.article_source && (
                                <h5>
                                    <span>
                                        Click this link to view the <a target="_blank" href={articleDetails.article_source} rel="noreferrer" style={{color: '#0265A9', textDecoration: 'underline'}}>sources</a>, interview, or media used in this article.
                                    </span>
                                </h5>
                            )}
                            <div className="Sidebar-Fast-News-Section">
                                <hr></hr>
                                <VerticalFastNews />
                                <hr></hr>
                                <br></br>
                            </div>
                        </div>
                    </div>

                    <div className="Media-Segment-Article-Text" dangerouslySetInnerHTML={{ __html: articleDetails.article_body }} />
                </div>
            </div>

            <ListOfMediaSegments />
        </div>
    )
}

export default MediaSegmentArticle;