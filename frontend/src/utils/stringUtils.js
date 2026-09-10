/**
 * Utility functions for string manipulation.
 */

/**
 * Replaces all underscores in a string with spaces.
 * @param {string} str 
 * @returns {string}
 */
export const replaceUnderscore = (str) => {
    if (!str) {
        return ""
    }
    return str.replaceAll("_", " ")
}

/**
 * Converts a string into a URL-friendly slug.
 * @param {string} str 
 * @returns {string}
 */
export const slugify = (str) => {
    if (!str) {
        return ""
    }
    return str
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .trim()
        .replace(/\s+/g, "-")
}

/**
 * Sanitizes external URLs to prevent javascript: URI injection.
 * Only allows http, https, mailto, tel, or relative links.
 * @param {string} url 
 * @returns {string}
 */
export const sanitizeUrl = (url) => {
    if (!url || typeof url !== "string") {
        return "#"
    }

    const trimmed = url.trim()

    if (trimmed.startsWith("/") || trimmed.startsWith("#")) {
        return trimmed
    }

    try {
        const parsed = new URL(trimmed)
        if (["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol)) {
            return trimmed
        }
    } catch (e) {
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
            return trimmed
        }
    }

    return "#"
}

/**
 * Extracts a YouTube video ID from standard, short, or embed YouTube URLs.
 * @param {string} url 
 * @returns {string|null}
 */
export const getYoutubeId = (url) => {
    if (!url || typeof url !== "string") return null
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
}

/**
 * Generates the official YouTube thumbnail URL for a given YouTube URL.
 * @param {string} url 
 * @param {"default"|"hqdefault"|"mqdefault"|"sddefault"|"maxresdefault"} [quality="hqdefault"]
 * @returns {string|null}
 */
export const getYoutubeThumbnail = (url, quality = "hqdefault") => {
    const id = getYoutubeId(url)
    return id ? `https://img.youtube.com/vi/${id}/${quality}.jpg` : null
}
