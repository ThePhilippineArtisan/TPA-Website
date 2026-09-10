import { useEffect, useState, useRef } from "react"
import { supabase } from "../supabaseClient"
import HTMLFlipbook from "react-pageflip"
import { sanitizeUrl } from "../utils/stringUtils"
import "../CSS/ReleasesPage.css"

const ReleasesPage = () => {
  const [dbReleases, setDbReleases] = useState([])
  const [selectedRelease, setSelectedRelease] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pageOrientation, setPageOrientation] = useState("portrait")
  const [bookDimensions, setBookDimensions] = useState({ width: 500, height: 600 })
  const flipbookRef = useRef(null)

  useEffect(() => {
    const fetchPublicReleases = async () => {
      setLoading(true)
      try {
        let { data, error } = await supabase
          .from('releases')
          .select('*')
          .eq('is_visible', true)
          .order('order', { ascending: true, nullsFirst: false })
          .order('date_published', { ascending: false })

        if (error) {
          const fallback = await supabase
            .from('releases')
            .select('*')
            .eq('is_visible', true)
            .order('date_published', { ascending: false })
          data = fallback.data
        }

        if (data && data.length > 0) {
          setDbReleases(data)
          // Set featured or first release as selected
          const featured = data.find(r => r.is_featured) || data[0]
          setSelectedRelease(featured)
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

  const currentTitle = selectedRelease
    ? selectedRelease.title || selectedRelease.release_title
    : (loading ? "Loading..." : "No Releases Available")

  const currentSubtitle = selectedRelease
    ? selectedRelease.subtitle || selectedRelease.tagline || `The Official ${selectedRelease.release_type || 'Release'} of The Philippine Artisan`
    : "The Official Media Releases of The Philippine Artisan"

  const currentCaption = selectedRelease
    ? selectedRelease.description || selectedRelease.caption
    : "Explore the official publications, literary folios, broadsheets, and newsletters released by The Philippine Artisan."

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
    <div className = "Releases-Page-Container">
      <div className = "Releases-Page">
        {/* Top Options Bar */}
        <div className = "List-of-Releases-Covers">
          <div className = "Releases-Option">
            {dbReleases.map(rel => (
              <div
                key = {rel.id}
                className = "Releases-Option-Title"
                onClick = {() => setSelectedRelease(rel)}
                style = {{
                  cursor: 'pointer',
                  fontWeight: selectedRelease?.id === rel.id ? 'bold' : 'normal',
                  opacity: selectedRelease?.id === rel.id ? 1 : 0.85
                }}
              >
                <p>{rel.title || rel.release_title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Release Header & Details */}
        <div className = "Releases-Title">
          <div className = "Releases-Title-Type">
            <p>{currentSubtitle}</p>
            <span>{currentTitle}</span>
            {selectedRelease?.academic_year && (
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.95rem", fontWeight: "700", color: "#0265A9" }}>
                {selectedRelease.academic_year}
              </p>
            )}
            <hr style = {{ width: "80%", margin: "1rem 0rem" }}></hr>
            {currentSoftCopyUrl && (
              <div>
                <a
                  href = {sanitizeUrl(currentSoftCopyUrl)}
                  target = "_blank"
                  rel = "noopener noreferrer"
                  style = {{ color: 'var(--primary-blue)', fontWeight: 'bold', textDecoration: 'underline' }}
                >
                  Click here for the full soft copy of this release
                </a>
              </div>
            )}
          </div>
          <div className = "Releases-Caption">
            <p>{currentCaption}</p>
          </div>
        </div>

        {/* Flipbook Container */}
        <div className = "Releases-Book-Container">
          <div className = "Releases-Book-Button-Container">
            {currentPhotos.length > 0 ? (
              <>
                <HTMLFlipbook
                  key = {`${selectedRelease?.id}-${pageOrientation}-${bookDimensions.width}`}
                  ref = {flipbookRef}
                  className = "Releases-Book"
                  width = {bookDimensions.width}
                  height = {bookDimensions.height}
                  maxShadowOpacity = {0.5}
                  drawShadow = {true}
                  showCover = {true}
                  size = "fixed"
                >
                  {currentPhotos.map((photo, index) => (
                    <div className = "Demo-Page" key = {index}>
                      <img
                        src = {photo}
                        alt = {`Page ${index + 1}`}
                        loading = "lazy"
                        draggable = {false}
                        style = {{
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
                <div className = "Releases-Book-Button">
                  <button onClick = {() => flipbookRef.current?.pageFlip()?.flipPrev()}> Previous </button>
                  <div className = "Releases-Book-Button-Counter">
                    <p> 1 of {currentPhotos.length} </p>
                  </div>
                  <button onClick = {() => flipbookRef.current?.pageFlip()?.flipNext()}> Next </button>
                </div>
              </>
            ) : (
              <div style = {{
                width: '500px',
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc',
                border: '2px dashed #cbd5e1',
                borderRadius: '8px',
                color: '#64748b',
                textAlign: 'center',
                padding: '2rem'
              }}>
                <p>
                  {loading
                    ? "Loading publication preview..."
                    : "No flipbook pages uploaded for this release yet. Please check back soon!"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Releases Grid / Catalog */}
        <div className = "List-Of-Releases-Container">
          <div className = "List-Of-Releases">
            <div>
              <h1>RELEASES CATALOG</h1>
              <div className = "Releases-Book-And-Title-Container">
                {dbReleases.length > 0 ? (
                  dbReleases.map(rel => (
                    <div
                      key = {rel.id}
                      className = "Releases-Book-And-Title"
                      onClick = {() => setSelectedRelease(rel)}
                      style = {{ cursor: 'pointer' }}
                    >
                      <span className = "Releases-Option-Title">
                        <b>{rel.release_type || "Release"}</b> {rel.title || rel.release_title} {rel.academic_year ? `(${rel.academic_year})` : ""}
                      </span>
                      <div className = "Releases-Book-Image">
                        {rel.cover_url || rel.cover_image ? (
                          <img
                            src = {rel.cover_url || rel.cover_image}
                            alt = {rel.title}
                          />
                        ) : (
                          <div style = {{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            color: '#64748b'
                          }}>
                            {rel.title || "TPA Release"}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style = {{ padding: '2rem', color: '#64748b' }}>
                    {loading ? "Loading releases..." : "No media releases available."}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className = "Releases-Filter"></div>
        </div>
      </div>
    </div>
  )
}

export default ReleasesPage
