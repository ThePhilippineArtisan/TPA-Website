import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../supabaseClient";
import { compressImage, uploadToR2Storage } from "../utils/imageUtils.js";
import "./ManageReleases.css";

const RELEASE_CATEGORIES = [
    { label: "Kalyo", value: "Kalyo" },
    { label: "Newsletter", value: "Newsletter" },
    { label: "Tabula Rasa", value: "Tabula_Rasa" },
    { label: "Broadsheet", value: "Broadsheet" },
    { label: "PhilArts", value: "PhilArts" },
    { label: "Duh! Filipit Artihan", value: "Duh_Filipit_Artihan" }
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
    isFeatured: false,
    order: ""
};

const ManageReleases = () => {
    const [loading, setLoading] = useState(true);
    const [releases, setReleases] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formState, setFormState] = useState(initialFormState);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [uploadingPages, setUploadingPages] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, active: false });
    const [draggedPageIndex, setDraggedPageIndex] = useState(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

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

    const handleMovePage = (currentIndex, targetIndex) => {
        setFormState(prev => {
            const pages = prev.photosText ? prev.photosText.split("\n").map(u => u.trim()).filter(Boolean) : [];
            if (targetIndex < 0 || targetIndex >= pages.length) return prev;
            const [moved] = pages.splice(currentIndex, 1);
            pages.splice(targetIndex, 0, moved);
            return {
                ...prev,
                photosText: pages.join("\n")
            };
        });
    };

    const handleSetPageAsCover = (index) => {
        if (index === 0) return;
        handleMovePage(index, 0);
    };

    const handleSetAsReleaseCover = (url) => {
        if (!url) return;
        setFormState(prev => ({ ...prev, coverUrl: url }));
        alert("Set page as main Release Cover!");
    };

    const handleClearAllPages = () => {
        if (pageUrls.length === 0) return;
        if (window.confirm(`Are you sure you want to remove all ${pageUrls.length} page(s)?`)) {
            setFormState(prev => ({ ...prev, photosText: "" }));
        }
    };

    const handleReversePages = () => {
        if (pageUrls.length <= 1) return;
        setFormState(prev => ({
            ...prev,
            photosText: [...pageUrls].reverse().join("\n")
        }));
    };

    const handleSortPagesNumerically = () => {
        if (pageUrls.length <= 1) return;
        const sorted = [...pageUrls].sort((a, b) => {
            const fileA = a.split("/").pop().split("?")[0];
            const fileB = b.split("/").pop().split("?")[0];
            return fileA.localeCompare(fileB, undefined, { numeric: true, sensitivity: 'base' });
        });
        setFormState(prev => ({
            ...prev,
            photosText: sorted.join("\n")
        }));
    };

    const handleDragStart = (e, index) => {
        setDraggedPageIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        if (draggedPageIndex === null || draggedPageIndex === targetIndex) {
            setDraggedPageIndex(null);
            return;
        }
        handleMovePage(draggedPageIndex, targetIndex);
        setDraggedPageIndex(null);
    };

    const normalizeAndSetReleases = (rawList) => {
        const normalized = (rawList || []).map(item => {
            const sortedPages = (item.releases_pages || [])
                .sort((a, b) => a.page_number - b.page_number)
                .map(p => p.image_url);
            const cover = sortedPages[0] || "";
            return {
                ...item,
                title: item.release_title || item.title || "Untitled Release",
                description: item.releases_description || item.description || "",
                cover_url: cover,
                photos: sortedPages,
                photosText: sortedPages.join("\n")
            };
        });
        setReleases(normalized);
    };

    const fetchReleases = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('releases')
                .select('*, releases_pages(*)')
                .order('order', { ascending: true, nullsFirst: false })
                .order('release_date', { ascending: false });

            if (error) {
                console.warn("Could not order releases, falling back:", error);
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('releases')
                    .select('*, releases_pages(*)');

                if (fallbackError) throw fallbackError;
                normalizeAndSetReleases(fallbackData || []);
            } else {
                normalizeAndSetReleases(data || []);
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
                const { publicUrl } = await uploadToR2Storage({
                    file: compressedBlob,
                    filename: compressedFileName,
                    folder: 'releases/covers',
                    contentType: 'image/webp',
                    bucket: 'article-photos'
                });

                if (publicUrl) {
                    setFormState(prev => ({ ...prev, coverUrl: publicUrl }));
                    alert("Cover image compressed and uploaded successfully!");
                    return;
                }
            } catch (r2Err) {
                console.warn("R2 upload error, using compressed Data URL fallback:", r2Err);
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

    // Natural numeric sorting for file lists (page_1, page_2, ... page_10)
    const naturalSortFiles = (fileList) => {
        return Array.from(fileList).sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
        );
    };

    // Upload multiple flipbook page files concurrently with natural sort and progress tracking
    const processBulkPageFiles = async (fileList) => {
        const rawFiles = Array.from(fileList).filter(f => f.type && f.type.startsWith('image/'));
        if (rawFiles.length === 0) {
            alert("Please select image files (PNG, JPG, WebP, etc.).");
            return;
        }

        const sortedFiles = naturalSortFiles(rawFiles);
        const total = sortedFiles.length;

        setUploadingPages(true);
        setUploadProgress({ current: 0, total, active: true });

        const results = new Array(total);
        let completedCount = 0;
        let nextIndex = 0;
        const batchId = Date.now();
        const concurrency = Math.min(3, total);

        const worker = async () => {
            while (nextIndex < total) {
                const currentIndex = nextIndex++;
                const file = sortedFiles[currentIndex];

                try {
                    const compressedBlob = await compressImage(file, 1400, 1400, 0.82, 'image/webp');
                    const cleanBase = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
                    const pageNum = String(currentIndex + 1).padStart(3, "0");
                    const uniqueFileName = `${batchId}_p${pageNum}_${cleanBase}.webp`;

                    const uploadResult = await uploadToR2Storage({
                        file: compressedBlob,
                        filename: uniqueFileName,
                        folder: 'releases/pages',
                        contentType: 'image/webp',
                        bucket: 'article-photos'
                    });

                    if (uploadResult?.publicUrl) {
                        results[currentIndex] = uploadResult.publicUrl;
                    } else {
                        throw new Error("R2 upload did not return a public URL");
                    }
                } catch (r2Err) {
                    console.error(`R2 upload failed for page ${currentIndex + 1} (${file.name}):`, r2Err);
                    results[currentIndex] = null;
                } finally {
                    completedCount++;
                    setUploadProgress({ current: completedCount, total, active: true });
                }
            }
        };

        try {
            const workers = Array.from({ length: concurrency }, () => worker());
            await Promise.all(workers);

            const successfulUrls = results.filter(Boolean);
            const failedCount = total - successfulUrls.length;

            if (successfulUrls.length > 0) {
                setFormState(prev => {
                    const existing = prev.photosText ? prev.photosText.trim() : "";
                    const newText = successfulUrls.join("\n");
                    return {
                        ...prev,
                        photosText: existing ? `${existing}\n${newText}` : newText
                    };
                });
            }

            if (failedCount > 0) {
                alert(`Uploaded ${successfulUrls.length} of ${total} page(s). ${failedCount} failed.\n\nNote: If you encounter a CORS error, please configure CORS on your Cloudflare R2 'article-photos' bucket to allow origin 'https://philartisan.org'.`);
            } else {
                alert(`Successfully processed and uploaded ${successfulUrls.length} page(s) in sequential order.`);
            }
        } catch (err) {
            console.error("Bulk upload batch error:", err);
            alert("Error during page upload: " + (err.message || err));
        } finally {
            setUploadingPages(false);
            setUploadProgress({ current: 0, total: 0, active: false });
        }
    };

    const handlePagePhotosUpload = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processBulkPageFiles(files);
        }
        e.target.value = "";
    };

    // Dropzone drag-and-drop handlers
    const handleDropzoneDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDraggingOver) setIsDraggingOver(true);
    };

    const handleDropzoneDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
    };

    const handleDropzoneDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);

        const droppedFiles = e.dataTransfer?.files;
        if (droppedFiles && droppedFiles.length > 0) {
            processBulkPageFiles(droppedFiles);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);

        let formattedDate = "";
        const rawDate = item.release_date || item.date_published;
        if (rawDate) {
            formattedDate = String(rawDate).split("T")[0];
        }

        const pages = item.photos || (item.releases_pages || [])
            .sort((a, b) => a.page_number - b.page_number)
            .map(p => p.image_url);

        setFormState({
            title: item.release_title || item.title || "",
            releaseType: item.release_type || "Kalyo",
            academicYear: item.academic_year || "",
            subtitle: item.subtitle || "",
            description: item.releases_description || item.description || "",
            coverUrl: item.cover_url || pages[0] || "",
            softCopyUrl: item.soft_copy_url || "",
            photosText: pages.join("\n"),
            datePublished: formattedDate,
            isVisible: item.is_visible ?? true,
            isFeatured: false,
            order: item.order !== null && item.order !== undefined ? item.order : ""
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

        // If coverUrl is provided and not already first in photosArray, ensure it's at index 0
        if (formState.coverUrl && formState.coverUrl.trim()) {
            const coverTrimmed = formState.coverUrl.trim();
            if (!photosArray.includes(coverTrimmed)) {
                photosArray.unshift(coverTrimmed);
            } else if (photosArray[0] !== coverTrimmed) {
                const rest = photosArray.filter(u => u !== coverTrimmed);
                photosArray.splice(0, photosArray.length, coverTrimmed, ...rest);
            }
        }

        let dateOnly = null;
        if (formState.datePublished) {
            dateOnly = formState.datePublished.split("T")[0];
        } else {
            dateOnly = new Date().toISOString().split("T")[0];
        }

        const orderVal = formState.order !== "" && formState.order !== null && !isNaN(formState.order)
            ? parseInt(formState.order, 10)
            : null;

        const releasePayload = {
            release_title: title,
            releases_description: formState.description.trim() || title,
            release_date: dateOnly,
            release_type: formState.releaseType || "Kalyo",
            order: orderVal,
            is_visible: Boolean(formState.isVisible)
        };

        try {
            let targetReleaseId = editingId;

            if (editingId) {
                const { error: updateErr } = await supabase
                    .from('releases')
                    .update(releasePayload)
                    .eq('id', editingId);

                if (updateErr) throw updateErr;

                // Delete old pages to re-insert in the updated sequence
                await supabase
                    .from('releases_pages')
                    .delete()
                    .eq('releases_id', editingId);
            } else {
                const { data: inserted, error: insertErr } = await supabase
                    .from('releases')
                    .insert([releasePayload])
                    .select('id')
                    .single();

                if (insertErr) throw insertErr;
                targetReleaseId = inserted.id;
            }

            // Insert flipbook pages into releases_pages
            if (targetReleaseId && photosArray.length > 0) {
                const pageRows = photosArray.map((url, idx) => ({
                    releases_id: targetReleaseId,
                    page_number: idx + 1,
                    image_url: url,
                    alt_text: idx === 0 ? "Cover" : `Page ${idx + 1}`
                }));

                const { error: pagesErr } = await supabase
                    .from('releases_pages')
                    .insert(pageRows);

                if (pagesErr) {
                    console.error("Error saving releases_pages:", pagesErr);
                    alert(`Release metadata saved, but could not link pages: ${pagesErr.message}`);
                }
            }

            alert(editingId ? "Release updated successfully!" : "Release saved successfully!");
            handleCancelEdit();
            fetchReleases();
        } catch (err) {
            console.error("Error saving release to Supabase:", err);
            alert(`Failed to save release: ${err.message || err}`);
        }
    };

    const handleReorderRelease = async (releaseId, direction) => {
        const sorted = [...releases].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
        const index = sorted.findIndex(r => r.id === releaseId);
        if (index === -1) return;
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= sorted.length) return;

        const currentItem = sorted[index];
        const targetItem = sorted[targetIndex];

        const currentOrder = currentItem.order ?? index + 1;
        const targetOrder = targetItem.order ?? targetIndex + 1;

        const newCurrentOrder = targetOrder === currentOrder ? (direction === "up" ? currentOrder - 1 : currentOrder + 1) : targetOrder;
        const newTargetOrder = currentOrder;

        setReleases(prev => prev.map(r => {
            if (r.id === currentItem.id) return { ...r, order: newCurrentOrder };
            if (r.id === targetItem.id) return { ...r, order: newTargetOrder };
            return r;
        }));

        try {
            await Promise.all([
                supabase.from('releases').update({ order: newCurrentOrder }).eq('id', currentItem.id),
                supabase.from('releases').update({ order: newTargetOrder }).eq('id', targetItem.id)
            ]);
            fetchReleases();
        } catch (err) {
            console.error("Error reordering releases:", err);
            fetchReleases();
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
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="Form-Group">
                                <label htmlFor="academicYear">Academic Year / Period</label>
                                <input
                                    type="text"
                                    id="academicYear"
                                    name="academicYear"
                                    list="academic-year-suggestions"
                                    value={formState.academicYear}
                                    onChange={handleChange}
                                    placeholder="e.g. AY 2025 - 2026 or 2025"
                                />
                                <datalist id="academic-year-suggestions">
                                    <option value="AY 2025 - 2026" />
                                    <option value="AY 2024 - 2025" />
                                    <option value="AY 2023 - 2024" />
                                    <option value="AY 2022 - 2023" />
                                    <option value="AY 2021 - 2022" />
                                </datalist>
                            </div>
                        </div>

                        <div className="Form-Row-Two">
                            <div className="Form-Group">
                                <label htmlFor="order">Catalog Display Order (Lower = First)</label>
                                <input
                                    type="number"
                                    id="order"
                                    name="order"
                                    value={formState.order}
                                    onChange={handleChange}
                                    placeholder="e.g. 1, 2, 3..."
                                    min="1"
                                />
                            </div>

                            <div className="Form-Group">
                                <label htmlFor="datePublished">Publication Date</label>
                                <input
                                    type="date"
                                    id="datePublished"
                                    name="datePublished"
                                    value={formState.datePublished}
                                    onChange={handleChange}
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
                                <label className="Admin-Primary-Button" style={{ cursor: uploadingPages ? 'not-allowed' : 'pointer', margin: 0, fontSize: '0.8rem' }}>
                                    {uploadingPages ? "Processing..." : "+ Add Images"}
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

                            {/* Drag and Drop Dropzone */}
                            <div 
                                className={`Page-Upload-Dropzone ${isDraggingOver ? 'is-dragover' : ''} ${uploadingPages ? 'is-uploading' : ''}`}
                                onDragOver={handleDropzoneDragOver}
                                onDragEnter={handleDropzoneDragOver}
                                onDragLeave={handleDropzoneDragLeave}
                                onDrop={handleDropzoneDrop}
                            >
                                <div className="Dropzone-Content">
                                    <svg className="Dropzone-Icon-Svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0265A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                    <div className="Dropzone-Text">
                                        <p className="Dropzone-Title">
                                            {uploadingPages ? "Uploading pages in parallel..." : "Drag & Drop multiple page images here"}
                                        </p>
                                        <p className="Dropzone-Subtitle">
                                            or <label className="Dropzone-Browse-Label">
                                                browse files
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handlePagePhotosUpload}
                                                    disabled={uploadingPages}
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                            — auto-sorted numerically (P.1, P.2... P.10) & converted to WebP
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {uploadProgress.active && (
                                <div className="Batch-Upload-Progress">
                                    <div className="Batch-Upload-Status">
                                        <span>Uploading page {uploadProgress.current} of {uploadProgress.total}...</span>
                                        <span>{uploadProgress.total > 0 ? Math.round((uploadProgress.current / uploadProgress.total) * 100) : 0}%</span>
                                    </div>
                                    <div className="Progress-Track">
                                        <div 
                                            className="Progress-Bar" 
                                            style={{ width: `${uploadProgress.total > 0 ? (uploadProgress.current / uploadProgress.total) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {pageUrls.length > 0 && (
                                <>
                                    {/* Batch Actions Toolbar */}
                                    <div className="Batch-Actions-Toolbar">
                                        <span className="Batch-Count-Badge">{pageUrls.length} Pages Loaded</span>
                                        <div className="Batch-Buttons-Group">
                                            <button
                                                type="button"
                                                className="Batch-Btn"
                                                onClick={() => handleSetAsReleaseCover(pageUrls[0])}
                                                title="Set Page 1 as the main Release Cover Image"
                                            >
                                                Set P.1 as Cover
                                            </button>
                                            <button
                                                type="button"
                                                className="Batch-Btn"
                                                onClick={handleSortPagesNumerically}
                                                title="Sort all pages numerically by filename"
                                            >
                                                Sort Numerically
                                            </button>
                                            <button
                                                type="button"
                                                className="Batch-Btn"
                                                onClick={handleReversePages}
                                                title="Reverse page sequence"
                                            >
                                                Reverse Order
                                            </button>
                                            <button
                                                type="button"
                                                className="Batch-Btn Batch-Btn-Danger"
                                                onClick={handleClearAllPages}
                                                title="Clear all pages"
                                            >
                                                Clear All
                                            </button>
                                        </div>
                                    </div>

                                    <div className="Thumbnail-Grid" style={{ marginBottom: '0.5rem' }}>
                                        {pageUrls.map((url, idx) => (
                                            <div 
                                                key={idx} 
                                                className={`Page-Thumbnail-Card ${draggedPageIndex === idx ? 'is-dragging' : ''}`}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, idx)}
                                                onDragOver={(e) => handleDragOver(e, idx)}
                                                onDrop={(e) => handleDrop(e, idx)}
                                            >
                                                <div className="Thumbnail-Wrapper">
                                                    <img src={url} alt={`Page ${idx + 1}`} draggable={false} />
                                                    <span className="Page-Number-Badge">P.{idx + 1}</span>
                                                    {idx === 0 && <span className="Page-Cover-Badge">Cover</span>}
                                                    <button
                                                        type="button"
                                                        className="Remove-Page-Btn"
                                                        title="Remove page"
                                                        onClick={() => handleRemovePage(idx)}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                                <div className="Thumbnail-Controls">
                                                    <button
                                                        type="button"
                                                        className="Thumbnail-Control-Btn"
                                                        disabled={idx === 0}
                                                        title="Move left"
                                                        onClick={() => handleMovePage(idx, idx - 1)}
                                                    >
                                                        ◀
                                                    </button>
                                                    {idx !== 0 && (
                                                        <button
                                                            type="button"
                                                            className="Thumbnail-Control-Btn Make-First-Btn"
                                                            title="Set as Page 1"
                                                            onClick={() => handleSetPageAsCover(idx)}
                                                        >
                                                            ★
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="Thumbnail-Control-Btn"
                                                        disabled={idx === pageUrls.length - 1}
                                                        title="Move right"
                                                        onClick={() => handleMovePage(idx, idx + 1)}
                                                    >
                                                        ▶
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="Thumbnail-Helper-Note">
                                        <strong>Tip:</strong> Drag and drop thumbnails or use ◀ / ▶ to reorder. <strong>P.1</strong> is always the flipbook cover.
                                    </p>
                                </>
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
                        releases.map((item, relIdx) => {
                            const title = item.title || item.release_title || "Untitled Release";
                            const cover = item.cover_url || item.cover_image || item.thumbnail;
                            const type = item.release_type || item.type || item.category || "General";
                            const year = item.academic_year || item.year || "";
                            const isVisible = item.is_visible ?? true;
                            const isFeatured = item.is_featured ?? item.is_pinned ?? false;
                            const pubDate = formatDate(item.date_published || item.release_date || item.created_at || item.published_at);
                            const orderNum = item.order !== null && item.order !== undefined ? item.order : null;

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
                                                {orderNum !== null && <span className="Release-Badge Release-Badge-Order">#{orderNum}</span>}
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
                                            <div className="Release-Item-Reorder-Group">
                                                <button
                                                    type="button"
                                                    className="Btn-Action-Small Btn-Reorder-Arrow"
                                                    disabled={relIdx === 0}
                                                    title="Move up in list"
                                                    onClick={() => handleReorderRelease(item.id, 'up')}
                                                >
                                                    ▲
                                                </button>
                                                <button
                                                    type="button"
                                                    className="Btn-Action-Small Btn-Reorder-Arrow"
                                                    disabled={relIdx === releases.length - 1}
                                                    title="Move down in list"
                                                    onClick={() => handleReorderRelease(item.id, 'down')}
                                                >
                                                    ▼
                                                </button>
                                            </div>

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
