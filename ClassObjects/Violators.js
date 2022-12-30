export default class Violators {
  violatorList = [];
  /**
   * Check if the violator is on the list
   * @param {String} serialNumber
   * @returns {Number} index where the user is in the list, -1 if does not exist
   */
  findViolator (serialNumber) {
    return this.violatorList.findIndex(e => e.pilotId === serialNumber);
  }
  /**
   * Check if the violator is closer to the nest than before and change minDist value if necessary
   * @param {Object} violatorInfo contains drone serial and current distance to the nest
   * @returns true if the drone is closer to the nest than before; false otherwise
   */
  checkMinDist(serial,minDist)
  {
    const id = this.findViolator(serial);
    if (id !== -1) {
      let violator=this.violatorList[id];
      if(minDist <violator.minDist)
      {
        violator.minDist=minDist;
        return true;
      }
    }
    return false;
  }

  /**
   * Add violator to the list
   * @param {Object} userJSON userData
   */
  addViolator (userJSON) {
    const id = this.findViolator(userJSON.pilotId);
    if (id === -1) {
      this.violatorList.push(userJSON);
    }
  }

  /**
   * Remove the violator from the list
   * @param {Object} userJSON userData
   */
  removeViolator (serial) {
    const id = this.findViolator(serial);
    if (id !== -1) {
      this.violatorList.splice(id, 1);
    }
  }
}
