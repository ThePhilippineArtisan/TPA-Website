import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../supabaseClient";
import { compressImage } from "../utils/imageUtils.js";
import "./ManageReleases.css";

const RELEASE_CATEGORIES = [
    "Kalyo",
    "Newsletter",
    "Tabula Rasa",
    "Broadsheet",
    "PhilArts",
    "Duh! Filipit Artihan",
    "Special Release",
    "Other"
];

const initialFormState = {
    title: "",
    releaseType: "Kalyo",
    academicYear: "AY 2024 - 2025",
    subtitle: "",
    description: "",
    coverUrl: "",
    softCopyUrl: "",
    photosText: "",
    datePublished: "",
    isVisible: true,
    isFeatured: false
};

const ManageReleases = () => {
    const [loading, setLoading] = useState(true);
    const [releases, setReleases] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formState, setFormState] = useState(initialFormState);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [uploadingPages, setUploadingPages] = useState(false);

    const pageUrls = useMemo(() => {
        return formState.photosText
            ? formState.photosText.split("\n").map(u => u.trim()).filter(Boolean)
            : [];
    }, [formState.photosText]);

    const handleRemovePage = (indexToRemove) => {
        setFormState(prev => {
            const pages = prev.photosText ? prev.photosText.split("\n").map(u => u.trim()).filter(Boolean) : [];
            pages.splice(indexToRemove, 1);
            return {
                ...prev,
                photosText: pages.join("\n")
            };
        });
    };

    const fetchReleases = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('releases')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('releases')
                    .select('*');

                if (fallbackError) throw fallbackError;
                setReleases(fallbackData || []);
            } else {
                setReleases(data || []);
            }
        } catch (error) {
            console.warn("Could not fetch releases from Supabase:", error);
            setReleases([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReleases();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // Compress cover image file
    const handleCoverFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingCover(true);
        try {
            // Compress image file using HTML5 canvas utility (WebP format)
            const compressedBlob = await compressImage(file, 1200, 1200, 0.8, 'image/webp');
            const compressedFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";

            try {
                // Try R2 storage upload via presigned URL
                const presignRes = await fetch('/api/media/presign', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        filename: compressedFileName,
                        contentType: 'image/webp',
                        folder: 'releases/covers',
                        bucket: 'article-photos'
                    })
                });

                if (presignRes.ok) {
                    const { presignedUrl, publicUrl } = await presignRes.json();
                    const uploadRes = await fetch(presignedUrl, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'image/webp' },
                        body: compressedBlob
                    });

                    if (uploadRes.ok) {
                        setFormState(prev => ({ ...prev, coverUrl: publicUrl }));
                        alert("Cover image compressed and uploaded successfully!");
                        return;
                    }
                }
            } catch (r2Err) {
                console.warn("R2 upload endpoint not active, using compressed Data URL fallback:", r2Err);
            }

            // Fallback: Convert compressed WebP Blob to Data URL if direct R2 presign fails
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormState(prev => ({ ...prev, coverUrl: reader.result }));
                alert("Cover image compressed successfully!");
            };
            reader.readAsDataURL(compressedBlob);
        } catch (err) {
            console.error("Cover image compression error:", err);
            alert("Error compressing cover image: " + (err.message || err));
        } finally {
            setUploadingCover(false);
            e.target.value = "";
        }
    };

    // Upload multiple flipbook page files
    const handlePagePhotosUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setUploadingPages(true);
        try {
            const uploadedUrls = [];

            for (const file of files) {
                const compressedBlob = await compressImage(file, 1200, 1200, 0.8, 'image/webp');
                const compressedFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";

                let finalUrl = null;
                try {
                    const presignRes = await fetch('/api/media/presign', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            filename: compressedFileName,
                            contentType: 'image/webp',
                            folder: 'releases/pages',
                            bucket: 'article-photos'
                        })
                    });

                    if (presignRes.ok) {
                        const { presignedUrl, publicUrl } = await presignRes.json();
                        const uploadRes = await fetch(presignedUrl, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'image/webp' },
                            body: compressedBlob
                        });

                        if (uploadRes.ok) {
                            finalUrl = publicUrl;
                        }
                    }
                } catch (r2Err) {
                    console.warn("R2 presign failed for page photo, falling back to data URL:", r2Err);
                }

                if (!finalUrl) {
                    finalUrl = await new Promise((resolve) => {
                        const r = new FileReader();
                        r.onloadend = () => resolve(r.result);
                        r.readAsDataURL(compressedBlob);
                    });
                }

                if (finalUrl) uploadedUrls.push(finalUrl);
            }

            setFormState(prev => {
                const existing = prev.photosText ? prev.photosText.trim() : "";
                const newText = uploadedUrls.join("\n");
                return {
                    ...prev,
                    photosText: existing ? `${existing}\n${newText}` : newText
                };
            });

            alert(`Added ${uploadedUrls.length} page photo(s)!`);
        } catch (err) {
            console.error("Page photos upload error:", err);
            alert("Error uploading page images: " + (err.message || err));
        } finally {
            setUploadingPages(false);
            e.target.value = "";
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);

        let formattedDate = "";
        const rawDate = item.date_published || item.created_at || item.published_at;
        if (rawDate) {
            const d = new Date(rawDate);
            if (!isNaN(d.getTime())) {
                const tzOffset = d.getTimezoneOffset() * 60000;
                formattedDate = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
            }
        }

        let photosStr = "";
        const rawPhotos = item.photos || item.pages || item.page_urls;
        if (Array.isArray(rawPhotos)) {
            photosStr = rawPhotos.join("\n");
        } else if (typeof rawPhotos === 'string') {
            photosStr = rawPhotos;
        }

        setFormState({
            title: item.title || item.release_title || "",
            releaseType: item.release_type || item.type || item.category || "Kalyo",
            academicYear: item.academic_year || item.year || "AY 2024 - 2025",
            subtitle: item.subtitle || item.tagline || "",
            description: item.description || item.caption || "",
            coverUrl: item.cover_url || item.cover_image || item.thumbnail || "",
            softCopyUrl: item.soft_copy_url || item.pdf_url || item.link || "",
            photosText: photosStr,
            datePublished: formattedDate,
            isVisible: item.is_visible ?? true,
            isFeatured: item.is_featured ?? item.is_pinned ?? false
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormState(initialFormState);
    };

    const handleSubmitRelease = async (e) => {
        e.preventDefault();

        const title = formState.title.trim();
        if (!title) {
            alert("Please enter a title for the release.");
            return;
        }

        const photosArray = formState.photosText
            .split("\n")
            .map(url => url.trim())
            .filter(Boolean);

        const payload = {
            title: title,
            release_type: formState.releaseType,
            academic_year: formState.academicYear || "AY 2024 - 2025",
            subtitle: formState.subtitle || "",
            description: formState.description || "",
            cover_url: formState.coverUrl || "",
            soft_copy_url: formState.softCopyUrl || "",
            photos: photosArray,
            date_published: formState.datePublished ? new Date(formState.datePublished).toISOString() : new Date().toISOString(),
            is_visible: Boolean(formState.isVisible),
            is_featured: Boolean(formState.isFeatured)
        };

        try {
            if (editingId) {
                const { error } = await supabase
                    .from('releases')
                    .update(payload)
                    .eq('id', editingId);

                if (error) throw error;
                alert("Release updated successfully!");
            } else {
                const { error } = await supabase
                    .from('releases')
                    .insert([payload]);

                if (error) throw error;
                alert("Release saved successfully!");
            }

            handleCancelEdit();
            fetchReleases();
        } catch (err) {
            console.error("Error saving release to Supabase:", err);
            alert(`Failed to save release: ${err.message || err}`);
        }
    };

    const toggleVisibility = async (id) => {
        const itemToUpdate = releases.find(r => r.id === id);
        if (!itemToUpdate) return;
        const updatedVisibility = !itemToUpdate.is_visible;

        setReleases(prev => prev.map(r => r.id === id ? { ...r, is_visible: updatedVisibility } : r));

        try {
            const { error } = await supabase
                .from('releases')
                .update({ is_visible: updatedVisibility })
                .eq('id', id);

            if (error) throw error;
        } catch (err) {
            console.error("Error updating visibility:", err);
            alert(`Failed to update visibility: ${err.message || err}`);
            fetchReleases();
        }
    };

    const toggleFeatured = async (id) => {
        const itemToUpdate = releases.find(r => r.id === id);
        if (!itemToUpdate) return;
        const updatedFeatured = !itemToUpdate.is_featured;

        setReleases(prev => prev.map(r => r.id === id ? { ...r, is_featured: updatedFeatured } : r));

        try {
            const { error } = await supabase
                .from('releases')
                .update({ is_featured: updatedFeatured })
                .eq('id', id);

            if (error) throw error;
        } catch (err) {
            console.error("Error updating featured status:", err);
            alert(`Failed to update featured status: ${err.message || err}`);
            fetchReleases();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this release?")) {
            try {
                const { error } = await supabase
                    .from('releases')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                setReleases(prev => prev.filter(item => item.id !== id));
                if (editingId === id) {
                    handleCancelEdit();
                }
            } catch (err) {
                console.error("Error deleting release:", err);
                alert(`Failed to delete release: ${err.message || err}`);
            }
        }
    };

    const formatDate = (isoString) => {
        if (!isoString) return "N/A";
        const d = new Date(isoString);
        return isNaN(d.getTime()) ? isoString : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="Manage-Releases-Container">
            <div className="Manage-Releases-Header">
                <h1>Manage Media Releases</h1>
                <p>Add, edit, or remove TPA's literary folios, broadsheets, newsletters, and publications.</p>
            </div>

            <div className="Manage-Releases-Grid">
                {/* Form Section */}
                <div className="Add-Release-Form-Container">
                    <h2 className="Section-Title">
                        {editingId ? `Edit Release (ID: ${editingId})` : "Add New Release"}
                    </h2>
                    <hr className="Divider-Line" />

                    <form onSubmit={handleSubmitRelease}>
                        <div className="Form-Group">
                            <label htmlFor="title">Release Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formState.title}
                                onChange={handleChange}
                                placeholder="e.g. KALYO: ? '24 - '25"
                                required
                            />
                        </div>

                        <div className="Form-Row-Two">
                            <div className="Form-Group">
                                <label htmlFor="releaseType">Release Category / Type</label>
                                <select
                                    id="releaseType"
                                    name="releaseType"
                                    value={formState.releaseType}
                                    onChange={handleChange}
                                >
                                    {RELEASE_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="Form-Group">
                                <label htmlFor="academicYear">Academic Year</label>
                                <input
                                    type="text"
                                    id="academicYear"
                                    name="academicYear"
                                    value={formState.academicYear}
                                    onChange={handleChange}
                                    placeholder="e.g. AY 2025 - 2026"
                                />
                            </div>
                        </div>

                        <div className="Form-Group">
                            <label htmlFor="subtitle">Subtitle / Tagline</label>
                            <input
                                type="text"
                                id="subtitle"
                                name="subtitle"
                                value={formState.subtitle}
                                onChange={handleChange}
                                placeholder="e.g. The Official Literary Folio of The Philippine Artisan"
                            />
                        </div>

                        <div className="Form-Group">
                            <label htmlFor="description">Caption / Description</label>
                            <textarea
                                id="description"
                                name="description"
                                rows="3"
                                value={formState.description}
                                onChange={handleChange}
                                placeholder="Enter a brief summary or editorial note for this release..."
                            />
                        </div>

                        <div className="Form-Group">
                            <label htmlFor="coverUrl">
                                Cover Image / Mockup URL
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input
                                    type="url"
                                    id="coverUrl"
                                    name="coverUrl"
                                    value={formState.coverUrl}
                                    onChange={handleChange}
                                    placeholder="https://example.com/cover.png"
                                    style={{ flex: 1 }}
                                />
                                <label style={{
                                    padding: '0.55rem 0.8rem',
                                    background: '#0265A9',
                                    color: '#fff',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {uploadingCover ? "Compressing..." : "Upload Cover"}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCoverFileUpload}
                                        disabled={uploadingCover}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="Form-Group">
                            <label htmlFor="softCopyUrl">Soft Copy / Download Link (PDF URL)</label>
                            <input
                                type="url"
                                id="softCopyUrl"
                                name="softCopyUrl"
                                value={formState.softCopyUrl}
                                onChange={handleChange}
                                placeholder="https://drive.google.com/... or PDF asset link"
                            />
                        </div>

                        <div className="Form-Group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label htmlFor="photosText" style={{ margin: 0 }}>
                                    Flipbook Page Images ({pageUrls.length})
                                </label>
                                <label className="Admin-Primary-Button" style={{ cursor: 'pointer', margin: 0, fontSize: '0.8rem' }}>
                                    {uploadingPages ? "Uploading..." : "+ Add Images"}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handlePagePhotosUpload}
                                        disabled={uploadingPages}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>

                            {pageUrls.length > 0 && (
                                <div className="Thumbnail-Grid" style={{ marginBottom: '0.75rem' }}>
                                    {pageUrls.map((url, idx) => (
                                        <div key={idx} className="Page-Thumbnail-Card">
                                            <div className="Thumbnail-Wrapper">
                                                <img src={url} alt={`Page ${idx + 1}`} />
                                                <span className="Page-Number-Badge">P.{idx + 1}</span>
                                                <button
                                                    type="button"
                                                    className="Remove-Page-Btn"
                                                    title="Remove page"
                                                    onClick={() => handleRemovePage(idx)}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <textarea
                                id="photosText"
                                name="photosText"
                                rows="3"
                                value={formState.photosText}
                                onChange={handleChange}
                                placeholder="Page URLs (one per line, filled automatically when you add images)"
                            />
                        </div>

                        <div className="Form-Group">
                            <label htmlFor="datePublished">Publication Date</label>
                            <input
                                type="datetime-local"
                                id="datePublished"
                                name="datePublished"
                                value={formState.datePublished}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="Form-Group">
                            <div className="Form-Checkbox-Group">
                                <input
                                    type="checkbox"
                                    id="isVisible"
                                    name="isVisible"
                                    checked={formState.isVisible}
                                    onChange={handleChange}
                                />
                                <label htmlFor="isVisible">Visibility: ON (Publicly Visible)</label>
                            </div>
                        </div>

                        <div className="Form-Group">
                            <div className="Form-Checkbox-Group">
                                <input
                                    type="checkbox"
                                    id="isFeatured"
                                    name="isFeatured"
                                    checked={formState.isFeatured}
                                    onChange={handleChange}
                                />
                                <label htmlFor="isFeatured">Featured / Main Flipbook Highlight</label>
                            </div>
                        </div>

                        <div className="Form-Actions">
                            <button type="submit" className="Btn-Submit">
                                {editingId ? "Update Release" : "Save Release"}
                            </button>
                            {editingId && (
                                <button type="button" className="Btn-Cancel" onClick={handleCancelEdit}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Existing Releases List */}
                <div className="Existing-Releases-Container">
                    <h2 className="Section-Title">
                        Existing Releases ({releases.length})
                    </h2>
                    <hr className="Divider-Line" />

                    {loading ? (
                        <p style={{ color: "#666", padding: "1rem 0" }}>Loading releases...</p>
                    ) : releases.length === 0 ? (
                        <p style={{ color: "#666", padding: "1rem 0" }}>No media releases found. Add one on the left form!</p>
                    ) : (
                        releases.map((item) => {
                            const title = item.title || item.release_title || "Untitled Release";
                            const cover = item.cover_url || item.cover_image || item.thumbnail;
                            const type = item.release_type || item.type || item.category || "General";
                            const year = item.academic_year || item.year || "";
                            const isVisible = item.is_visible ?? true;
                            const isFeatured = item.is_featured ?? item.is_pinned ?? false;
                            const pubDate = formatDate(item.date_published || item.created_at || item.published_at);

                            return (
                                <div key={item.id} className={`Release-Item-Card ${!isVisible ? 'is-hidden' : ''}`}>
                                    {cover ? (
                                        <img src={cover} alt={title} className="Release-Item-Thumb" />
                                    ) : (
                                        <div className="Release-Item-Thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center' }}>
                                            No Cover
                                        </div>
                                    )}

                                    <hr style={{ height: "60%", marginLeft: "1rem" }} className="Vertical-Divider"></hr>

                                    <div className="Release-Item-Content">
                                        <div className="Release-Item-Header">
                                            <h3 className="Release-Item-Title">{title}</h3>
                                            {item.subtitle && <p className="Release-Item-Subtitle">{item.subtitle}</p>}

                                            <div className="Release-Badges">
                                                <span className="Release-Badge Release-Badge-Category">{type}</span>
                                                {year && <span className="Release-Badge Release-Badge-Year">{year}</span>}
                                                {isFeatured && <span className="Release-Badge Release-Badge-Featured">⭐ Featured</span>}
                                                <span className={`Release-Badge Release-Badge-Status ${isVisible ? 'visible' : 'hidden'}`}>
                                                    {isVisible ? 'Visible' : 'Hidden'}
                                                </span>
                                            </div>

                                            <p style={{ fontSize: '0.775rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                                                Published: {pubDate} | ID: {item.id}
                                            </p>
                                        </div>

                                        <div className="Release-Item-Actions">
                                            <button
                                                type="button"
                                                className="Btn-Action-Small"
                                                onClick={() => handleEdit(item)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="Btn-Action-Small"
                                                onClick={() => toggleFeatured(item.id)}
                                            >
                                                {isFeatured ? 'Unfeature' : '⭐ Feature'}
                                            </button>

                                            <button
                                                type="button"
                                                className="Btn-Action-Small"
                                                onClick={() => toggleVisibility(item.id)}
                                            >
                                                {isVisible ? 'Hide' : 'Show'}
                                            </button>

                                            <button
                                                type="button"
                                                className="Btn-Action-Small Btn-Action-Danger"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageReleases;
