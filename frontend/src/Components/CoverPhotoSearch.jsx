import React, { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import "../CSS/SecondFacade.css"

const CoverPhotoSearch = ({ searchQuery, setSearchQuery }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const currentQuery = searchQuery !== undefined ? searchQuery : (searchParams.get("q") || "")
    const [inputVal, setInputVal] = useState(currentQuery)

    // Synchronize local input if query is cleared or updated externally
    useEffect(() => {
        setInputVal(currentQuery)
    }, [currentQuery])

    const handleSubmit = (e) => {
        e.preventDefault()
        const trimmed = inputVal.trim()
        if (setSearchQuery) {
            setSearchQuery(trimmed)
        }
        if (trimmed) {
            setSearchParams({ q: trimmed }, { replace: true })
        } else {
            setSearchParams({}, { replace: true })
        }
    }

    const handleClear = () => {
        setInputVal("")
        if (setSearchQuery) {
            setSearchQuery("")
        }
        setSearchParams({}, { replace: true })
    }

    return (
        <div className="Cover-Photo-Image-Facade" loading="lazy">
            <form className="Search-Form-Wrapper" onSubmit={handleSubmit}>
                <div className="Search-Input-Wrapper">
                    <svg
                        className="Search-Icon"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0265A9"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        className="SearchBar"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        placeholder="Search articles, headlines, topics, or writers..."
                    />
                    {inputVal && (
                        <button
                            type="button"
                            className="Search-Clear-Button"
                            onClick={handleClear}
                            aria-label="Clear search query"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    )}
                    <button
                        type="submit"
                        className="Search-Submit-Button"
                        aria-label="Submit search"
                    >
                        Search
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CoverPhotoSearch