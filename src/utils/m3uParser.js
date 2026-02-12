/**
 * Parses an M3U playlist string into an array of channel objects.
 * @param {string} content - The M3U playlist content.
 * @returns {Array} - Array of channel objects with name, logo, and url.
 */
export const parseM3U = (content) => {
  const lines = content.split("\n");
  const playlist = [];
  let currentItem = {};

  lines.forEach((line) => {
    line = line.trim();
    if (!line) return;

    if (line.startsWith("#EXTINF:")) {
      // Extract metadata
      // Format: #EXTINF:-1 tvg-id="" tvg-name="" tvg-logo="",Channel Name
      const info = line.substring(8);

      const logoMatch = info.match(/tvg-logo="([^"]*)"/);
      const logo = logoMatch ? logoMatch[1] : "";

      // Get the title (everything after the last comma)
      const titleParts = info.split(",");
      const title = titleParts[titleParts.length - 1].trim();

      currentItem = { name: title, logo, url: "" };
    } else if (!line.startsWith("#")) {
      // It's a URL
      if (currentItem.name) {
        currentItem.url = line;
        // Generate a random ID for React keys if not present
        currentItem.id = Math.random().toString(36).substr(2, 9);
        playlist.push(currentItem);
        currentItem = {};
      }
    }
  });

  return playlist;
};
