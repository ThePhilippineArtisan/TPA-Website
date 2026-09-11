import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { getYoutubeThumbnail, getYoutubeId, sanitizeUrl } from "../utils/stringUtils";
import { formatRelativeTime } from "../utils/dateUtils";
import AnimatedLoader from "./AnimatedLoader";
import "../CSS/VideosPage.css";

const cleanTitle = (title) => {
    if (!title) return "";
    return title.trim();
};

const VideosPage = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        document.title = "Videos | The Philippine Artisan";
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchVideos = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("videos")
                    .select("*")
                    .order("date_added", { ascending: false });

                if (error) {
                    console.error("Error fetching videos:", error);
                    return;
                }

                if (isMounted && data) {
                    // Only show visible videos (or where is_visible is null/true)
                    const visibleVideos = data.filter((v) => v.is_visible !== false);
                    setVideos(visibleVideos);
                }
            } catch (err) {
                console.error("Failed to load videos:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchVideos();

        return () => {
            isMounted = false;
        };
    }, []);

    // Prevent background scrolling when video modal is open
    useEffect(() => {
        if (selectedVideo) {
            document.body.style.overflow = "hidden";
            const handleKeyDown = (e) => {
                if (e.key === "Escape") {
                    setSelectedVideo(null);
                }
            };
            window.addEventListener("keydown", handleKeyDown);
            return () => {
                document.body.style.overflow = "";
                window.removeEventListener("keydown", handleKeyDown);
            };
        } else {
            document.body.style.overflow = "";
        }
    }, [selectedVideo]);

    const featuredVideo = videos[0];

    if (loading) {
        return <AnimatedLoader />;
    }

    const featuredThumbnail =
        featuredVideo?.thumbnail ||
        getYoutubeThumbnail(featuredVideo?.youtube_url, "maxresdefault") ||
        getYoutubeThumbnail(featuredVideo?.youtube_url, "hqdefault");

    return (
        <div className="Videos-Page">
            {/* Top Featured Video Banner */}
            {featuredVideo && (
                <div className="Latest-Video-Image">
                    <div
                        className="Latest-Video-Card"
                        onClick={() => setSelectedVideo(featuredVideo)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") setSelectedVideo(featuredVideo);
                        }}
                    >
                        <div className="Latest-Video-Thumb-Container">
                            <img
                                src={featuredThumbnail}
                                alt={featuredVideo.youtube_title}
                                onError={(e) => {
                                    const fallback = getYoutubeThumbnail(featuredVideo.youtube_url, "hqdefault");
                                    if (fallback && e.currentTarget.src !== fallback) {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = fallback;
                                    }
                                }}
                            />
                            <div className="Latest-Video-Play-Overlay">
                                <div className="Latest-Video-Play-Badge" aria-label="Play Featured Video">
                                    <svg viewBox="0 0 24 24" fill="white" width="30" height="30">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="Latest-Video-Info">
                            <h2>{cleanTitle(featuredVideo.youtube_title)}</h2>
                            <h3>{formatRelativeTime(featuredVideo.date_added)} • YouTube</h3>
                            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                                <a
                                    href={sanitizeUrl(featuredVideo.youtube_url)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="Latest-Video-Watch-Button"
                                    style={{ background: "rgba(255, 255, 255, 0.15)", color: "#ffffff", border: "1px solid rgba(255, 255, 255, 0.3)" }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <span>Play on YouTube</span>
                                    <span>↗</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Catalog Grid Section */}
            <div className="Below-Videos">
                <div className="Videos-Section-Header">
                    <h2 id="Latest-Videos-Heading">LATEST VIDEOS</h2>
                    <a
                        href="https://www.youtube.com/@tek_artisanmnl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="Videos-Channel-Link"
                    >
                        Visit TEK YouTube Channel ⟶
                    </a>
                </div>

                {videos.length === 0 ? (
                    <div className="Videos-Empty-State">
                        <p>No videos found.</p>
                    </div>
                ) : (
                    <div className="Videos-Grid">
                        {videos.map((video) => {
                            const thumbUrl =
                                video.thumbnail ||
                                getYoutubeThumbnail(video.youtube_url, "hqdefault");

                            return (
                                <div
                                    key={video.id}
                                    className="Video-Card"
                                    onClick={() => setSelectedVideo(video)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") setSelectedVideo(video);
                                    }}
                                >
                                    <div className="Video-Card-Thumbnail-Wrapper">
                                        <img
                                            src={thumbUrl}
                                            alt={video.youtube_title}
                                            loading="lazy"
                                            onError={(e) => {
                                                const fallback = getYoutubeThumbnail(video.youtube_url, "hqdefault");
                                                if (fallback && e.currentTarget.src !== fallback) {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = fallback;
                                                }
                                            }}
                                        />
                                        <div className="Video-Card-Play-Badge">
                                            <div className="Video-Card-Play-Circle">
                                                <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="Video-Card-Content">
                                        <h3 className="Video-Card-Title">{cleanTitle(video.youtube_title)}</h3>
                                        <div className="Video-Card-Meta">
                                            <span>{formatRelativeTime(video.date_added)}</span>
                                            <a
                                                href={sanitizeUrl(video.youtube_url)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                style={{ color: "var(--primary-blue, #0265a9)", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "2px" }}
                                                title="Open directly on YouTube"
                                            >
                                                YouTube ↗
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Pure YouTube Embed Modal (Zero Custom Chrome/Palette, Pure Iframe) */}
            {selectedVideo && (
                <div
                    className="Video-Modal-Backdrop"
                    onClick={() => setSelectedVideo(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={selectedVideo.youtube_title}
                >
                    <div
                        className="Video-Modal-Container"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="Video-Modal-Close-Btn"
                            onClick={() => setSelectedVideo(null)}
                            aria-label="Close video player"
                        >
                            ✕
                        </button>

                        <div className="Video-Modal-Iframe-Wrapper">
                            {getYoutubeId(selectedVideo.youtube_url) ? (
                                <iframe
                                    src={`https://www.youtube-nocookie.com/embed/${getYoutubeId(selectedVideo.youtube_url)}?autoplay=1&rel=0`}
                                    title={selectedVideo.youtube_title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            ) : (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8" }}>
                                    <p>Video embed not available.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideosPage;
