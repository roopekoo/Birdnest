import fetchUrl from '../utils/dataFetch.js';
import Violators from '../ClassObjects/Violators.js';
import WebHandler from './WebHandler.js';
import Timer from '../ClassObjects/Timer.js';

export default class ViolatorHandler {
  url = 'https://assignments.reaktor.com/birdnest/pilots/';

  // Add Violators class instance
  violators_class = new Violators();
  webHandlerInstance = WebHandler;
  // Add Timer class instance
  timer = new Timer(this);

  /**
   * Set WebHandler class instance
   * @param {WebHandler} webInstance
   */
  setWebInstance(webInstance) {
    this.webHandlerInstance = webInstance;
  }

  /**
   * Get the violator's info and save it to the Violator's class
   * @param {Object} violatorInfo
   */
  handleViolators(violatorInfo) {
    // save every violator to the Violators class
    violatorInfo.violators.forEach(async violator => {
      const violatorInd = this.violators_class.findByDroneID(violator.serial);
      if (violatorInd !== -1) {
        const pilotId = this.violators_class.violatorList[violatorInd].pilotId;
        this.timer.resetTimer(pilotId);
        if (this.violators_class.checkMinDist(pilotId, violator.distance)) {
          this.webHandlerInstance.updateDist({ serial: pilotId, distance: violator.distance });
        }
      } else {
        // Fetch new violator information
        const userData = await fetchUrl(this.url + violator.serial);
        if (userData !== '') {
          const userJSON = JSON.parse(userData);
          userJSON.droneId = violator.serial;
          userJSON.minDist = violator.distance;
          const pilotId = userJSON.pilotId;

          this.timer.addTimer(pilotId);
          this.notifyOnAdd(userJSON);
        }
      }
    });
    this.webHandlerInstance.updateDist({ serial: '', distance: violatorInfo.minDist });
  }
  /**
   * Add violator to Violators class and send message to webHandler to add an entry
   */
  notifyOnAdd(userJSON) {
    this.violators_class.addViolator(userJSON);
    this.webHandlerInstance.addUser(userJSON);
  }
  /**
   * Delete violator from Violators class and send message to webHandler to remove an entry
   */
  notifyOnDelete(serial) {
    this.violators_class.removeViolator(serial);
    this.webHandlerInstance.deleteUser(serial);
  }
}
