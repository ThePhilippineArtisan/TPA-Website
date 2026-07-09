/**
 * Utility functions for string manipulation.
 */

/**
 * Replaces all underscores in a string with spaces.
 * @param {string} str 
 * @returns {string}
 */
export const replaceUnderscore = (str) => {
  if (!str) return "";
  return str.replaceAll("_", " ");
};

/**
 * Converts a string into a URL-friendly slug.
 * @param {string} str 
 * @returns {string}
 */
export const slugify = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};
