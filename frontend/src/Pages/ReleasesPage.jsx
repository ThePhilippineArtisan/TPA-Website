import { useEffect, useState, useRef, useMemo } from "react"
import { supabase } from "../supabaseClient"
import HTMLFlipbook from "react-pageflip"
import { sanitizeUrl } from "../utils/stringUtils"
import "../CSS/ReleasesPage.css"

const PUBLICATION_CATEGORIES = [
  { label: "All Publications", value: "ALL" },
  { label: "Kalyo", value: "Kalyo" },
  { label: "Newsletter", value: "Newsletter" },
  { label: "Broadsheet", value: "Broadsheet" },
  { label: "PhilArts", value: "PhilArts" },
  { label: "Tabula Rasa", value: "Tabula_Rasa" },
  { label: "Duh! Filipit Artihan", value: "Duh_Filipit_Artihan" }
]

const normalizeCategory = (cat) => {
  if (!cat) return ""
  return String(cat).replace(/[_\s!]/g, "").toLowerCase()
}

const matchesCategory = (releaseType, filterVal) => {
  if (!filterVal || filterVal === "ALL") return true
  return normalizeCategory(releaseType) === normalizeCategory(filterVal)
}

const getPublicationGenre = (releaseType) => {
  if (!releaseType) return "Publication"
  const clean = normalizeCategory(releaseType)
  if (clean === "kalyo") return "Literary Folio"
  if (clean === "broadsheet") return "Broadsheet"
  if (clean === "newsletter") return "Newsletter"
  if (clean.includes("duh") || clean.includes("filipit") || clean.includes("artihan")) return "Lampoon"
  if (clean.includes("philart")) return "Magazine"
  if (clean.includes("tabula") || clean.includes("rasa")) return "Graphics Folio"
  return String(releaseType).replace(/_/g, " ")
}

const ReleasesPage = () => {
  const [dbReleases, setDbReleases] = useState([])
  const [selectedRelease, setSelectedRelease] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [selectedYear, setSelectedYear] = useState("ALL")
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [pageOrientation, setPageOrientation] = useState("portrait")
  const [bookDimensions, setBookDimensions] = useState({ width: 500, height: 600 })

  const flipbookRef = useRef(null)
  const readerTopRef = useRef(null)

  useEffect(() => {
    const fetchPublicReleases = async () => {
      setLoading(true)
      try {
        let { data, error } = await supabase
          .from('releases')
          .select('*, releases_pages(*)')
          .eq('is_visible', true)
          .order('order', { ascending: true, nullsFirst: false })
          .order('release_date', { ascending: false })

        if (error) {
          console.warn("Falling back fetch without order:", error)
          const fallback = await supabase
            .from('releases')
            .select('*, releases_pages(*)')
            .eq('is_visible', true)
          data = fallback.data
        }

        if (data && data.length > 0) {
          const normalized = data.map(rel => {
            const pages = (rel.releases_pages || [])
              .sort((a, b) => a.page_number - b.page_number)
              .map(p => p.image_url)
            return {
              ...rel,
              title: rel.release_title || rel.title || "TPA Release",
              description: rel.releases_description || rel.description || "",
              photos: pages,
              cover_url: pages[0] || rel.cover_url || ""
            }
          })
          setDbReleases(normalized)
          setSelectedRelease(normalized[0])
        } else {
          setDbReleases([])
        }
      } catch (err) {
        console.warn("Could not fetch releases for public page:", err)
        setDbReleases([])
      } finally {
        setLoading(false)
      }
    }

    fetchPublicReleases()
  }, [])

  // Extract distinct academic years from releases
  const availableYears = useMemo(() => {
    const years = new Set()
    dbReleases.forEach(rel => {
      if (rel.academic_year && rel.academic_year.trim()) {
        years.add(rel.academic_year.trim())
      }
    })
    return Array.from(years).sort().reverse()
  }, [dbReleases])

  // Filter releases according to category and academic year
  const filteredReleases = useMemo(() => {
    return dbReleases.filter(rel => {
      const matchCat = matchesCategory(rel.release_type, selectedCategory)
      const matchYr = selectedYear === "ALL" || (rel.academic_year && rel.academic_year.trim() === selectedYear)
      return matchCat && matchYr
    })
  }, [dbReleases, selectedCategory, selectedYear])

  // Count releases per category for badges
  const getCategoryCount = (catValue) => {
    return dbReleases.filter(rel => {
      const matchCat = matchesCategory(rel.release_type, catValue)
      const matchYr = selectedYear === "ALL" || (rel.academic_year && rel.academic_year.trim() === selectedYear)
      return matchCat && matchYr
    }).length
  }

  // Synchronize selectedRelease with active filters
  useEffect(() => {
    if (filteredReleases.length > 0) {
      const currentStillInFilter = filteredReleases.some(r => r.id === selectedRelease?.id)
      if (!currentStillInFilter) {
        setSelectedRelease(filteredReleases[0])
        setCurrentPage(0)
      }
    } else {
      setSelectedRelease(null)
      setCurrentPage(0)
    }
  }, [filteredReleases])

  const handleSelectRelease = (rel) => {
    setSelectedRelease(rel)
    setCurrentPage(0)
    if (readerTopRef.current) {
      readerTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const currentTitle = selectedRelease
    ? selectedRelease.title || selectedRelease.release_title
    : (loading ? "Loading..." : "No Releases Found in this Category")

  const currentGenre = getPublicationGenre(selectedRelease?.release_type)
  const defaultSubtitle = `The Official ${currentGenre} of The Philippine Artisan`

  const currentSubtitle = selectedRelease
    ? (selectedRelease.subtitle && !selectedRelease.subtitle.startsWith("The Official ")
      ? selectedRelease.subtitle
      : (selectedRelease.tagline && !selectedRelease.tagline.startsWith("The Official ")
        ? selectedRelease.tagline
        : defaultSubtitle))
    : "The Official Publications of The Philippine Artisan"

  const currentCaption = selectedRelease
    ? selectedRelease.description || selectedRelease.caption
    : (filteredReleases.length === 0
      ? "No publication matches the chosen category or academic year filter. Try choosing another category above."
      : "Explore the official publications, literary folios, broadsheets, and newsletters released by The Philippine Artisan.")

  const currentSoftCopyUrl = selectedRelease
    ? selectedRelease.soft_copy_url || selectedRelease.pdf_url || selectedRelease.link
    : null

  const currentPhotos = selectedRelease && Array.isArray(selectedRelease.photos) && selectedRelease.photos.length > 0
    ? selectedRelease.photos
    : (selectedRelease && selectedRelease.cover_url ? [selectedRelease.cover_url] : [])

  // Auto-detect whether the release pages are portrait or landscape
  useEffect(() => {
    const firstImage = currentPhotos[0]
    if (!firstImage) {
      setPageOrientation("portrait")
      setBookDimensions({ width: 500, height: 600 })
      return
    }

    const img = new Image()
    img.onload = () => {
      const isLandscape = img.naturalWidth > img.naturalHeight
      if (isLandscape) {
        setPageOrientation("landscape")
        const ratio = img.naturalWidth / img.naturalHeight
        const height = 450
        const width = Math.min(Math.round(height * ratio), 650)
        setBookDimensions({ width, height })
      } else {
        setPageOrientation("portrait")
        setBookDimensions({ width: 500, height: 600 })
      }
    }
    img.onerror = () => {
      setPageOrientation("portrait")
      setBookDimensions({ width: 500, height: 600 })
    }
    img.src = firstImage
  }, [selectedRelease?.id, currentPhotos[0]])

  return (
    <div className="Releases-Page-Container">
      <div className="Releases-Page">

        {/* Option A: Category Filter Tabs & Academic Year Selector */}
        <nav className="Releases-Filter-Nav" aria-label="Publications category filter">
          <div className="Releases-Category-Pills">
            {PUBLICATION_CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat.value
              const count = getCategoryCount(cat.value)
              return (
                <button
                  key={cat.value}
                  type="button"
                  className={`Releases-Filter-Pill ${isActive ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat.value)}
                  aria-pressed={isActive}
                >
                  <span className="Pill-Label">{cat.label}</span>
                  {count > 0 && <span className="Pill-Count">{count}</span>}
                </button>
              )
            })}
          </div>

          {availableYears.length > 0 && (
            <div className="Releases-Year-Filter-Container">
              <label htmlFor="academic-year-filter" className="Releases-Year-Filter-Label">
                Academic Year:
              </label>
              <select
                id="academic-year-filter"
                className="Releases-Year-Select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="ALL">All Academic Years</option>
                {availableYears.map(yr => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>
          )}
        </nav>

        {/* Anchor for smooth scroll when selecting from catalog */}
        <div ref={readerTopRef} style={{ scrollMarginTop: "2rem" }} />

        {/* Selected Release Header & Details */}
        <div className="Releases-Title">
          <div className="Releases-Title-Type">
            {selectedRelease?.academic_year && (
              <div className="Releases-Meta-Badges">
                <span className="Releases-Year-Badge">
                  {selectedRelease.academic_year}
                </span>
              </div>
            )}

            <p className="Releases-Subtitle-Text">{currentSubtitle}</p>
            <span className="Releases-Main-Title">{currentTitle}</span>
            <hr className="Releases-Divider" />

            {currentSoftCopyUrl && (
              <div className="Releases-Download-Container">
                <a
                  href={sanitizeUrl(currentSoftCopyUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="Releases-Download-Button"
                >

                  <span>Download Full Soft Copy</span>
                </a>
              </div>
            )}
          </div>

          <div className="Releases-Caption">
            <p>{currentCaption}</p>
          </div>
        </div>

        {/* Flipbook Container */}
        <div className="Releases-Book-Container">
          <div className="Releases-Book-Button-Container">
            {currentPhotos.length > 0 ? (
              <>
                <HTMLFlipbook
                  key={`${selectedRelease?.id}-${pageOrientation}-${bookDimensions.width}`}
                  ref={flipbookRef}
                  className="Releases-Book"
                  width={bookDimensions.width}
                  height={bookDimensions.height}
                  maxShadowOpacity={0.5}
                  drawShadow={true}
                  showCover={true}
                  size="fixed"
                  onFlip={(e) => setCurrentPage(e.data)}
                >
                  {currentPhotos.map((photo, index) => (
                    <div className="Demo-Page" key={index}>
                      <img
                        src={photo}
                        alt={`Page ${index + 1}`}
                        loading="lazy"
                        draggable={false}
                        style={{
                          width: "100%",
                          height: "100%",
                          cursor: "grab",
                          objectFit: pageOrientation === "landscape" ? "contain" : "cover",
                          backgroundColor: "#fdfdf3"
                        }}
                      />
                    </div>
                  ))}
                </HTMLFlipbook>

                <div className="Releases-Book-Button">
                  <button
                    type="button"
                    onClick={() => flipbookRef.current?.pageFlip()?.flipPrev()}
                    title="Previous page"
                  >
                    Previous
                  </button>
                  <div className="Releases-Book-Button-Counter">
                    <p>{currentPage + 1} of {currentPhotos.length}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => flipbookRef.current?.pageFlip()?.flipNext()}
                    title="Next page"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <div className="Releases-Empty-Preview">
                <p>
                  {loading
                    ? "Loading publication preview..."
                    : "No flipbook pages uploaded for this release yet."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Releases Grid / Catalog Section */}
        <div className="List-Of-Releases-Container">
          <div className="List-Of-Releases">
            <div className="Catalog-Header-Bar">
              <div>
                <h2 className="Catalog-Section-Title">Releases Catalog</h2>
              </div>

              {filteredReleases.length > 1 && (
                <span className="Catalog-Hint-Text">
                  Click any issue to open as a flipbook
                </span>
              )}
            </div>

            <div className="Releases-Book-And-Title-Container">
              {filteredReleases.length > 0 ? (
                filteredReleases.map(rel => {
                  const isSelected = selectedRelease?.id === rel.id

                  return (
                    <div
                      key={rel.id}
                      className={`Releases-Book-And-Title ${isSelected ? "is-selected" : ""}`}
                      onClick={() => handleSelectRelease(rel)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          handleSelectRelease(rel)
                        }
                      }}
                      title={`Open ${rel.title || rel.release_title}`}
                    >
                      <div className="Releases-Book-Image-Wrapper">
                        {rel.cover_url || rel.cover_image ? (
                          <img
                            src={rel.cover_url || rel.cover_image}
                            alt={rel.title}
                            className="Releases-Card-Cover-Img"
                          />
                        ) : (
                          <div className="Releases-No-Cover-Placeholder">
                            {rel.title || "TPA Release"}
                          </div>
                        )}

                        {rel.academic_year && (
                          <div className="Card-Overlay-Badges">
                            <span className="Card-Year-Badge">{rel.academic_year}</span>
                          </div>
                        )}
                      </div>

                      <div className="Releases-Card-Meta">
                        <p className="Releases-Card-Title">{rel.title || rel.release_title}</p>
                        {rel.release_date && (
                          <span className="Releases-Card-Date">
                            {new Date(rel.release_date).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short'
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="Releases-Catalog-Empty">
                  <p>
                    {loading
                      ? "Loading releases..."
                      : `No publications found for the selected filter (${selectedCategory.replace(/_/g, " ")}${selectedYear !== 'ALL' ? ` / ${selectedYear}` : ''}).`}
                  </p>
                  {(selectedCategory !== "ALL" || selectedYear !== "ALL") && (
                    <button
                      type="button"
                      className="Btn-Reset-Filters"
                      onClick={() => {
                        setSelectedCategory("ALL")
                        setSelectedYear("ALL")
                      }}
                    >
                      View All Releases
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ReleasesPage
