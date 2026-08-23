export const isMediaSegment = (type) => {
    if (!type) {
        return false
    }
    const segments = [
        "MAKATA_MONDAYS",
        "TEK_TUESDAY",
        "WANKJOB_WEDNESDAY",
        "TALA_THURSDAY",
        "FEATURES_FRIDAY",
        "STREAMING_SATURDAY",
        "SPORTS_SUNDAY",
        "OPINION",
        "EDITORIAL"
    ]
    return segments.includes(type.toUpperCase())
}

export const getMediaSegmentLabel = (type) => {
    if (!type) {
        return ""
    }
    const mapping = {
        "MAKATA_MONDAYS" : "Makata Mondays",
        "TEK_TUESDAY" : "Tek Tuesday",
        "WANKJOB_WEDNESDAY" : "Wankjob Wednesday",
        "TALA_THURSDAY" : "Tala Thursday",
        "FEATURES_FRIDAY" : "Features Friday",
        "STREAMING_SATURDAY" : "Streaming Saturday",
        "SPORTS_SUNDAY" : "Sports Sunday",
        "OPINION" : "Opinion",
        "EDITORIAL" : "Editorial"
    }
    return mapping[type.toUpperCase()] || type
}

export const slugify = (text) => {
    if (!text) {
        return ""
    }
    return text
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
}

export const getArticleUrl = (article) => {
    if (!article) {
        return "/"
    }
    const id = article.article_id || article.id
    let slug = article.slug_headline || article.slug

    if (!slug && (article.article_headline || article.title || article.headline)) {
        slug = slugify(article.article_headline || article.title || article.headline)
    }

    const isSegment = isMediaSegment(article.article_type)
    const prefix = isSegment ? "/media-segment" : "/article"

    if (id && slug) {
        return `${prefix}/${id}/${slug}`
    } else if (id) {
        return `${prefix}/${id}`
    }
    return prefix
}