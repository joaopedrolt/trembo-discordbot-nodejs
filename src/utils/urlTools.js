export function isValidUrl(url) {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl) return true;
  } catch (error) {
    return false;
  }
}

export function isYoutubePlaylist(url) {
  const parsedUrl = new URL(url);
  return parsedUrl.hostname === "www.youtube.com" &&
    parsedUrl.pathname === "/playlist"
    ? true
    : false;
}
