/**
 * Date and Time formatting util helper
 * 
 * @param {string | Date} dateInput
 * @returns {string}
 * 
 */

export const formatDateReadable = (dateInput) => {
    if(!dateInput) return "" // no date passed to util
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
    
    if(isNaN(date.getTime())) return "" // if date is not a number (NaN)

    const dateOptions = {
        month: "long",
        day: "numeric",
        year: "numeric",
    }

    const timeOptions = {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }

    const formattedDate = date.toLocaleDateString("en-US", dateOptions)
    const formattedTime = date.toLocaleTimeString("en-US", timeOptions)

    return `${formattedDate} at ${formattedTime}`
}

/**
 * Calculate date and time relatively
 * 
 * @param {string | Date} dateInput
 * @returns {string}
 */

export const formatRelativeTime = (dateInput) => {
    if(!dateInput) return ""
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput

    if(isNaN(date.getTime())) return ""

    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    // schedyled post
    if(diffMs < 0){
        const absDiffMs = Math.abs(diffMs)
        const absDiffMins = Math.floor(absDiffMs / (1000 * 60))
        const absDiffHours = Math.floor(absDiffMins / 60)
        const absDiffDays = Math.floor(absDiffHours / 24)

        if(absDiffMins < 60){
            return `in ${absDiffMins} minute${absDiffMins === 1 ? "" : "s"}`
        }
        if(absDiffHours < 24){
            return `in ${absDiffHours} hour${absDiffHours === 1 ? "" : "s"}`
        }
        return `in ${absDiffDays} day${absDiffDays === 1 ? "" : "s"}`;
    }

    if(diffSecs < 60){
        return "Just now"
    }
    if(diffMins < 60){
    return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
    }
    if (diffHours < 24) {
        return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    }
    if (diffDays === 1) {
        return "Yesterday";
    }
    if (diffDays < 7) {
        return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    }

    // return date format if older than a week
    
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}