import fetchUrl from '../utils/dataFetch.js';
import Violators from '../ClassObjects/Violators.js';
import WebHandler from './WebHandler.js';

export default class ViolatorHandler {
  // 10-minute timeout for keeping the violator on the list
  LIFETIME = 10 * 60 * 1000;

  url = 'https://assignments.reaktor.com/birdnest/pilots/';
  timers = [];

  userJSON = {};

  // Add Violators class instance
  violators_class = new Violators();
  webHandlerInstance = WebHandler;

  /**
	 * Set WebHandler class instance
	 * @param {WebHandler} webInstance
	 */
  setWebInstance(webInstance) {
    this.webHandlerInstance = webInstance;
  }

  /**
	 * Get the violator's info and save it to the Violator class
	 * @param {Object} violatorInfo
	 */
  handleViolators(violatorInfo) {
    // save every violator to the Violators class
    violatorInfo.violators.forEach(async violator => {
      // Fetch violator information
      const userData = await fetchUrl(this.url + violator.serial);
      this.userJSON = JSON.parse(userData);
      const serial = this.userJSON.pilotId;
      if (this.violators_class.findViolator(serial) !== -1) {
        this.resetTimer(serial);
      } else {
        this.addTimer(serial);
        this.webHandlerInstance.addUser(this.userJSON);
      }
    });
    this.webHandlerInstance.updateDist(violatorInfo.minDist);
  }

  /**
	 * Find timer index from timers array
	 * @param {String} serial Search term
	 * @returns {Number} Timer index from the timers array; -1 if not found
	 */
  findTimer(serial) {
    return this.timers.findIndex(e => e.serial === serial);
  }

  /**
	 * Set timeout with LIFETIME delay; remove timer after timeout
	 * @param {String} serial id
	 * @returns timerID of the Timeout
	 */
  setTimer(serial) {
    const timerID = setTimeout((serial) => {
      this.removeTimer(serial);
    }, this.LIFETIME, serial);
    return timerID;
  }

  /**
	 * Reset timer from timers array
	 * @param {String} serial id
	 */
  resetTimer(serial) {
    const timerInd = this.findTimer(serial);
    if (timerInd === -1) {
      const timerID = this.setTimer(serial);
      this.timers[timerInd].timerID = timerID;
    }
  }

  /**
	 * Set a new timeout, save timer to timers array, and add new violator in Violator class
	 * @param {String} serial id
	 */
  addTimer(serial) {
    if (this.findTimer(serial) === -1) {
      const timerID = this.setTimer(serial);
      this.timers.push({ serial, timerID });
      this.violators_class.addViolator(this.userJSON);
    }
  }

  /**
	 * Remove timer object from timers array and remove violator from Violator class
	 * @param {String} serial id
	*/
  removeTimer(serial) {
    const timerInd = this.findTimer(serial);
    if (timerInd !== -1) {
      this.timers.splice(timerInd, 1);
      this.violators_class.removeViolator(serial);
      this.webHandlerInstance.deleteUser(serial);
    }
  }
}
