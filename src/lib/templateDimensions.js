/**
 * Returns the native pixel dimensions for a given template + shot count.
 * Used by both the edit and download pages for accurate scaling/export.
 *
 * @param {string} template  - e.g. "Frame1", "Frame15"
 * @param {number} shotCount - number of photos taken (3 or 4)
 * @returns {{ width: number, height: number }}
 */
export function getTemplateDimensions(template, shotCount) {
  if (shotCount === 4) return { width: 1200, height: 3600 };
  if (template === "Frame15") return { width: 1080, height: 1920 };
  return { width: 1200, height: 2800 };
}
