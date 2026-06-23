/**
 * Slugify strings for functions calling slugifyStrings
 * 
 *  @param {string} str
 *  @returns  {string}
 * 
 */

export const replaceUnderscore = (str) => {
    if(!str)
        return ""
    return str.replaceAll("_", " ")
}

/** When hovering, helper for expected input and output
 * 
 * @param {string} str
 * @returns {string}
 *
*/

export const slugify = (str) => {s
    if(!str)
        return ""
    return str
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .trim()
        .replace(/\s+/g, "-")
}