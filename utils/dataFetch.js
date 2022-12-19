/**
 * Fetch data from url and return in text format
 * @param {String} url  Url to be fetched
 * @returns {String}    Stringified response of the url
 */
export default async function fetchUrl(url) {
    const res = await fetch(url);
    return await res.text();
}