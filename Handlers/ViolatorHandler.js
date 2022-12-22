import fetchUrl from "../utils/dataFetch.js";
import Violators from "./Violators.js";

export default class ViolatorHandler {

    url = "https://assignments.reaktor.com/birdnest/pilots/";

    userJSON = {};

    //Add Violators class instance
    violators_class = new Violators;

    handleViolators(violatorInfo) {
        // save every violator to Violators class
        violatorInfo.violators.forEach(async violator => {
            // Fetch violator information
            const userData = await fetchUrl(this.url + violator.serial);
            this.userJSON = JSON.parse(userData);
            const serial = this.userJSON.pilotId;
            this.violators_class.addViolator(this.userJSON);
        });
    }
}