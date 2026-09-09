/**
 * Utility functions for staff positions and badges.
 */

/**
 * Maps a staff position string to its standardized acronym badge.
 * Examples:
 *  - "Junior_Staff_Broadcaster" -> "JSB"
 *  - "Junior_Staff_Photojournalist" -> "JSP"
 *  - "Junior_Staff_Writer" -> "JSW"
 *  - "Junior_Staff_Designer" -> "JSD"
 *  - "Junior_Staff_Illustrator" -> "JSI"
 *  - "Junior_Staff_Video_Editor" -> "JSV"
 *  - "Senior_Staff_Broadcaster" -> "SSB"
 *  - "Senior_Staff_Photojournalist" -> "SSP"
 *  - "Senior_Staff_Writer" -> "SSW"
 *  - "Senior_Staff_Designer" -> "SSD"
 *  - "Senior_Staff_Illustrator" -> "SSI"
 *  - "Senior_Staff_Video_Editor" -> "SSV"
 *
 * @param {string} position
 * @param {boolean} [isJunior=false]
 * @returns {string}
 */
export const getStaffBadge = (position, isJunior = false) => {
    if (!position) return isJunior ? "JR" : "SR"

    const clean = position.toLowerCase().replace(/_/g, " ").trim()

    const badgeMap = {
        // Junior Staff Roles
        "junior staff broadcaster": "JSB",
        "junior staff photojournalist": "JSP",
        "junior staff writer": "JSW",
        "junior staff designer": "JSD",
        "junior staff illustrator": "JSI",
        "junior staff video editor": "JSV",
        "junior broadcaster": "JSB",
        "junior photojournalist": "JSP",
        "junior writer": "JSW",
        "junior designer": "JSD",
        "junior illustrator": "JSI",
        "junior video editor": "JSV",
        "junior staff": "JR",
        "junior staffer": "JR",

        // Senior Staff Roles
        "senior staff broadcaster": "SSB",
        "senior staff photojournalist": "SSP",
        "senior staff writer": "SSW",
        "senior staff designer": "SSD",
        "senior staff illustrator": "SSI",
        "senior staff video editor": "SSV",
        "senior broadcaster": "SSB",
        "senior photojournalist": "SSP",
        "senior writer": "SSW",
        "senior designer": "SSD",
        "senior illustrator": "SSI",
        "senior video editor": "SSV",
        "senior staff": "SR",
        "senior staffer": "SR"
    }

    if (badgeMap[clean]) {
        return badgeMap[clean]
    }

    // Dynamic fallback for any variations
    if (clean.startsWith("junior staff")) {
        const remaining = clean.replace("junior staff", "").trim().split(/\s+/)
        const code = remaining.map(w => w[0]?.toUpperCase()).join("")
        return `JS${code || ""}` || "JR"
    }

    if (clean.startsWith("senior staff")) {
        const remaining = clean.replace("senior staff", "").trim().split(/\s+/)
        const code = remaining.map(w => w[0]?.toUpperCase()).join("")
        return `SS${code || ""}` || "SR"
    }

    return isJunior ? "JR" : "SR"
}
