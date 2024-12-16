export default (url) => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === "www.youtube.com" || parsedUrl.hostname === "youtube.com") {
      return (
        (parsedUrl.pathname === "/playlist" && parsedUrl.searchParams.has("list")) || // Direct playlist URL
        (parsedUrl.pathname === "/watch" && parsedUrl.searchParams.has("list"))      // Watch URL with a playlist
      );
    }
    return false;
  } catch (error) {
    return false;
  }
};
