export default (url) => {
  try {
    const urlObj = new URL(url);

    if (!urlObj.hostname.includes('youtube.com')) return null;

    const params = urlObj.searchParams;

    if (params.has('v')) {
      params.delete('list');
      params.delete('start_radio');
      params.delete('index');

      urlObj.search = params.toString();

      return urlObj.toString();
    }

    return null;
  } catch (e) {
    console.error("Invalid URL:", e);
    return null;
  }
};