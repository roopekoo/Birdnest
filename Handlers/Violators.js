// 10 minute timeout for keeping the violator in the list
const LIFETIME = 10 * 60 * 1000;

export default class Violators {
    violatorList = []
    /**
     * Check if the violator is in the list
     * @param {String} serialNumber 
     * @returns {Number} index where the user is in the list, -1 if does not exist
     */
    findViolator(serialNumber) {
        return this.violatorList.findIndex(e => e.pilotId === serialNumber);
    }
    /**
     * Add or modify violator in the list
     * @param {Object} userJSON userData
     */
    addViolator(userJSON) {
        const id = userJSON.pilotId;
        const ind = this.findViolator(id);
        if (ind !== -1) {
            var timerID = this.violatorList[ind].timerID;
            clearTimeout(timerID);
            timerID = this.setTimer(id);
            this.violatorList[ind].timerID = timerID;
            console.log("Reset timer for: " + id)
        }
        else {
            const timerID = this.setTimer(id);
            userJSON.timerID = timerID;
            this.violatorList.push(userJSON);
            console.log("Added " + id)
        }
    }
    /**
     * Set violator lifetime on the violator list. Signal on removal
     * @param {String} serial serial of the drone
     * @returns timeout ID
     */
    setTimer(serial) {
        const timerID = setTimeout((serial) => {
            const ind = this.findViolator(serial);
            this.violatorList.splice(ind, 1);
            console.log("Removed " + serial)
        }, LIFETIME, serial);
        return timerID;
    }
}
