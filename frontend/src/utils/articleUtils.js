export const isMediaSegment = (type) => {
    const segments = [
        "MAKATA_MONDAYS",
        "TEK_TUESDAYS",
        "WANKJOB_WEDNESDAYS",
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
        "MAKATA_MONDAYS" : "Makata Monday",
        "TEK_TUESDAYS" : "Tek Tuesday",
        "WANKJOB_WEDNESDAYS" : "Wankjob Wednesday",
        "TALA_THURSDAY" : "Tala Thursday",
        "FEATURES_FRIDAY" : "Features Friday",
        "STREAMING_SATURDAY" : "Streaming Saturday",
        "SPORTS_SUNDAY" : "Sports Sunday"
    }
    return mapping[type.toUpperCase()] || type
}