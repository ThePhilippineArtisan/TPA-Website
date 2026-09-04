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
        "LOOK": "Look",
        "ICYMI": "ICYMI",
        "ANNOUNCEMENT": "Announcement",
        "ADVISORY": "Advisory",
        "ALERT": "Alert",
        "JUST_IN": "Just In",
        "WALANG_PASOK": "Walang Pasok",
        "HAPPENING_NOW": "Happening Now",
        "LOCAL_NEWS": "Local News",
        "UNIVERSITY_NEWS": "University News",
        "NATIONAL_NEWS": "National News",
        "INTERNATIONAL_NEWS": "International News",
        "DEVELOPING_STORY": "Developing Story",
        "SPORTS_NEWS": "Sports News",
        "ERRATUM": "Erratum",
        "OPINION": "Opinion",
        "EDITORIAL": "Editorial",
        "MAKATA_MONDAYS": "Makata Mondays",
        "TEK_TUESDAY": "Tek Tuesday",
        "WANKJOB_WEDNESDAY": "Wankjob Wednesday",
        "TALA_THURSDAY": "Tala Thursday",
        "FEATURES_FRIDAY": "Features Friday",
        "STREAMING_SATURDAY": "Streaming Saturday",
        "SPORTS_SUNDAY": "Sports Sunday"
    }
    return mapping[type.toUpperCase()] || type
}

export const isFastNewsCardType = (type) => {
    if (!type) {
        return false
    }
    const cardTypes = [
        "JUST_IN",
        "WALANG_PASOK",
        "LOOK",
        "ANNOUNCEMENT",
        "ADVISORY",
        "ALERT",
        "ICYMI",
        "HAPPENING_NOW",
        "DEVELOPING_STORY",
        "ERRATUM"
    ]
    return cardTypes.includes(type.toUpperCase())
}

export const getCategoryFallbackImage = (type) => {
    if (!type) {
        return null
    }
    const normalized = type.toUpperCase()
    const R2_PREFIX = "https://pub-3f5d40cb1c9d4e07ad651d5c303f5384.r2.dev/sample-photos"

    const fallbacks = {
        "JUST_IN": `${R2_PREFIX}/JUST-IN.jpg`,
        "LOOK": `${R2_PREFIX}/1.jpg`,
        "ICYMI": `${R2_PREFIX}/1.jpg`,
        "ANNOUNCEMENT": `${R2_PREFIX}/OPINION.jpg`,
        "WALANG_PASOK": `${R2_PREFIX}/JUST-IN.jpg`,
        "ADVISORY": `${R2_PREFIX}/JUST-IN.jpg`,
        "ALERT": `${R2_PREFIX}/JUST-IN.jpg`,
        "HAPPENING_NOW": `${R2_PREFIX}/JUST-IN.jpg`,
        "DEVELOPING_STORY": `${R2_PREFIX}/JUST-IN.jpg`,
        "ERRATUM": `${R2_PREFIX}/JUST-IN.jpg`
    }

    return fallbacks[normalized] || null
}

export const isSetPhotoOnlyArticle = (article) => {
    if (!article) {
        return false
    }
    const tags = [article.article_tag1, article.article_tag2, article.article_tag3].filter(Boolean)
    if (tags.some(t => t.toUpperCase() === "SET_PHOTO_ONLY" || t.toUpperCase() === "CARD_ONLY")) {
        return true
    }
    return isFastNewsCardType(article.article_type)
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