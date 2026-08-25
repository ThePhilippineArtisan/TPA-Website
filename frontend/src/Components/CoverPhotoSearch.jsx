import { useSearchParams } from "react-router-dom"
import "../CSS/SecondFacade.css"

const CoverPhotoSearch = ({ searchQuery, setSearchQuery }) => {
    const [searchParams, setSearchParams] = useSearchParams()

    const queryValue = searchQuery !== undefined ? searchQuery : (searchParams.get("q") || "")

    const handleChange = (e) => {
        const val = e.target.value
        if (setSearchQuery) {
            setSearchQuery(val)
        }
        if (val) {
            setSearchParams({ q: val }, { replace: true })
        } else {
            setSearchParams({}, { replace: true })
        }
    }

    const handleClear = () => {
        if (setSearchQuery) {
            setSearchQuery("")
        }
        setSearchParams({}, { replace: true })
    }

    return (
        <div className = "Cover-Photo-Image-Facade" loading = "lazy">
            <div className = "Search-Input-Wrapper">
                <svg
                    className = "Search-Icon"
                    width = "20"
                    height = "20"
                    viewBox = "0 0 24 24"
                    fill = "none"
                    stroke = "#0265A9"
                    strokeWidth = "2.5"
                    strokeLinecap = "round"
                    strokeLinejoin = "round"
                >
                    <circle cx = "11" cy = "11" r = "8" />
                    <line x1 = "21" y1 = "21" x2 = "16.65" y2 = "16.65" />
                </svg>
                <input
                    type = "text"
                    className = "SearchBar"
                    value = {queryValue}
                    onChange = {handleChange}
                    placeholder = "Search articles, headlines, topics, or writers..."
                />
                {queryValue && (
                    <button
                        type = "button"
                        className = "Search-Clear-Button"
                        onClick = {handleClear}
                        aria-label = "Clear search query"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    )
}

export default CoverPhotoSearch