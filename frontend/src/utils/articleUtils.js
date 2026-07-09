export const isMediaSegment = (type) => {
    if (!type) return false
    const segments = [
        "MAKATA_MONDAYS",
        "TEK_TUESDAY",
        "WANKJOB_WEDNESDAY",
        "TALA_THURSDAY",
        "FEATURES_FRIDAY",
        "STREAMING_SATURDAY",
        "SPORTS_SUNDAY"
    ]
    return segments.includes(type.toUpperCase())
}

export const getMediaSegmentLabel = (type) => {
    if(!type)
        return ""
    const mapping = {
        "MAKATA_MONDAYS" : "Makata Mondays",
        "TEK_TUESDAY" : "Tek Tuesday",
        "WANKJOB_WEDNESDAY" : "Wankjob Wednesday",
        "TALA_THURSDAY" : "Tala Thursday",
        "FEATURES_FRIDAY" : "Features Friday",
        "STREAMING_SATURDAY" : "Streaming Saturday",
        "SPORTS_SUNDAY" : "Sports Sunday"
    }
    return mapping[type.toUpperCase()] || type
}