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

/**
 * Sanitizes external URLs to prevent javascript: URI injection.
 * Only allows http, https, mailto, tel, or relative links.
 * @param {string} url 
 * @returns {string}
 */
export const sanitizeUrl = (url) => {
  if (!url || typeof url !== "string") return "#";
  const trimmed = url.trim();
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) return trimmed;
  try {
    const parsed = new URL(trimmed);
    if (["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol)) {
      return trimmed;
    }
  } catch {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
  }
  return "#";
};

