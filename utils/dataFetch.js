import fetch from 'node-fetch';
/**
 * Fetch data from URL and return in text format
 * @param {String} url to be fetched
 * @returns {String} Stringified response from the URL
 */
export default async function fetchUrl(url) {
  try {
    const res = await fetch(url);
    if (res.status !== 200) {
      return '';
    }
    return await res.text();
  } catch (err) {
    return '';
  }
}
