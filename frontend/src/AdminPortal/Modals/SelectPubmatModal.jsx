import React, { useState, useEffect } from "react"
import { supabase } from "../../supabaseClient"
import "./SelectPubmatModal.css"

const PUBMAT_CATEGORIES = [
    "ALL",
    "ANNOUNCEMENT",
    "BREAKING_NEWS",
    "CLOSURE_REPORT",
    "OFFICIAL_STATEMENT",
    "ELECTION_UPDATES",
    "LOCAL_NEWS",
    "WALANG_PASOK",
    "LOOK",
    "ICYMI",
    "ADVISORY",
    "ALERT",
    "JUST_IN",
    "HAPPENING_NOW",
    "DEVELOPING_STORY",
    "ERRATUM",
    "GENERAL"
]

const SelectPubmatModal = ({ isOpen, onClose, onSelectPubmat, selectedPubmatId }) => {
    const [pubmats, setPubmats] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("ALL")
    const [tableMissing, setTableMissing] = useState(false)

    useEffect(() => {
        if (isOpen) {
            fetchPubmats()
            setSearchQuery("")
            setCategoryFilter("ALL")
        }
    }, [isOpen])

    const fetchPubmats = async () => {
        setLoading(true)
        setTableMissing(false)
        try {
            const { data, error } = await supabase
                .from("pubmat")
                .select("*, media(media_id, media_url)")
                .eq("is_active", true)
                .order("created_at", { ascending: false })

            if (error) {
                if (error.code === "42P01" || error.message?.includes("does not exist") || error.code === "PGRST205") {
                    setTableMissing(true)
                } else {
                    throw error
                }
            } else {
                const formatted = (data || []).map(p => ({
                    ...p,
                    image_url: p.image_url || p.media?.media_url || ""
                }))
                setPubmats(formatted)
            }
        } catch (err) {
            console.error("Error fetching pubmats for selection:", err)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    const filteredPubmats = pubmats.filter(pubmat => {
        const matchesCategory = categoryFilter === "ALL" || pubmat.category === categoryFilter
        const matchesSearch = !searchQuery.trim() ||
            (pubmat.title || "").toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
            (pubmat.category || "").toLowerCase().includes(searchQuery.toLowerCase().trim())
        return matchesCategory && matchesSearch
    })

    return (
        <div className="Pubmat-Modal-Overlay" onClick={onClose}>
            <div className="Pubmat-Modal-Card" onClick={(e) => e.stopPropagation()}>
                <div className="Pubmat-Modal-Header">
                    <div>
                        <h2>Select Pubmat</h2>
                        <span className="Pubmat-Modal-Subtitle">
                            Choose a reusable graphic card for this post
                        </span>
                    </div>
                    <div className="Pubmat-Modal-Header-Actions">
                        <a
                            href="/admin/manage-pubmats"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="Pubmat-Modal-Manage-Link"
                        >
                            Manage Pubmats
                        </a>
                        <button type="button" className="Pubmat-Modal-Close-Btn" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>

                {tableMissing ? (
                    <div className="Pubmat-Modal-Missing-Notice">
                        <strong>Pubmat Table Not Created Yet</strong>
                        <p>Go to <strong>Manage Pubmats</strong> in the sidebar to view the SQL table setup instructions.</p>
                    </div>
                ) : (
                    <>
                        <div className="Pubmat-Modal-Toolbar">
                            <div className="Pubmat-Modal-Search-Wrap">
                                <input
                                    type="text"
                                    placeholder="Search pubmats by title..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="Pubmat-Modal-Search-Input"
                                    autoFocus
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        className="Pubmat-Modal-Search-Clear"
                                        onClick={() => setSearchQuery("")}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            <div className="Pubmat-Modal-Categories">
                                {PUBMAT_CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        className={`Pubmat-Modal-Category-Pill ${categoryFilter === cat ? "active" : ""}`}
                                        onClick={() => setCategoryFilter(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="Pubmat-Modal-Body">
                            {loading ? (
                                <div className="Pubmat-Modal-Status">Loading pubmats...</div>
                            ) : filteredPubmats.length > 0 ? (
                                <div className="Pubmat-Modal-Grid">
                                    {filteredPubmats.map(pubmat => {
                                        const isSelected = selectedPubmatId === pubmat.pubmat_id
                                        return (
                                            <div
                                                key={pubmat.pubmat_id}
                                                className={`Pubmat-Modal-Grid-Item ${isSelected ? "selected" : ""}`}
                                                onClick={() => {
                                                    onSelectPubmat(pubmat)
                                                    onClose()
                                                }}
                                            >
                                                <div className="Pubmat-Modal-Item-Thumb">
                                                    <img src={pubmat.image_url} alt={pubmat.title} />
                                                    <span className="Pubmat-Modal-Item-Category">
                                                        {pubmat.category || "GENERAL"}
                                                    </span>
                                                </div>
                                                <span className="Pubmat-Modal-Item-Title" title={pubmat.title}>
                                                    {pubmat.title}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="Pubmat-Modal-Status">
                                    {searchQuery || categoryFilter !== "ALL"
                                        ? `No pubmats found matching "${searchQuery || categoryFilter}".`
                                        : "No active pubmats available. Add one in Manage Pubmats."}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default SelectPubmatModal
