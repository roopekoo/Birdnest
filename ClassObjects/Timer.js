export default class Timer {
  constructor(violatorHandler) {
    this.violatorHandler = violatorHandler;
  }
  // 10-minute timeout for keeping the violator on the list
  LIFETIME = 10 * 60 * 1000;
  timers = [];

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
      this.violatorHandler.notifyOnDelete(serial);
    }
  }
}