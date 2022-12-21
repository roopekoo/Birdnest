import fetchUrl from "../utils/dataFetch.js";

const url = "https://assignments.reaktor.com/birdnest/pilots/";

/**
 * 
 * @param {Violators} violators 
 * @param {Object} violatorInfo 
 */
export default function violatorHandler(violators_class, violatorInfo) {
    // Send signal to change minimum distance on the website
    // TODO

    // save every violator to Violators
    violatorInfo.violators.forEach(async violator => {
        // Fetch violator information
        const userData = await fetchUrl(url + violator.serial);
        const userJSON = JSON.parse(userData);
        violators_class.addViolator(userJSON);
    });
}