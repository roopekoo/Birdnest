import DomParser from 'dom-parser';

// Nest/sensor location
const NEST_X = 250000;
const NEST_Y = 250000;
const RADIUS = 100000;

/**
 * Parse information from xml, such timestamp, smallest distance and list of violators
 * @param {String} xml
 * @returns {Object} objecvt containing timestamp, showtest distance to the nest and list of violators
 */
export default function extractInfo (xml) {
  let minDist = null;
  const violators = [];

  const parser = new DomParser();
  const xmlDoc = parser.parseFromString(xml, 'text/xml');
  const timeStamp = xmlDoc.getElementsByTagName('capture')[0].attributes[0].value;

  const drones = xmlDoc.getElementsByTagName('drone');

  drones.forEach(drone => {
    const X = parseFloat(drone.getElementsByTagName('positionX')[0].innerHTML);
    const Y = parseFloat(drone.getElementsByTagName('positionY')[0].innerHTML);

    const dist = getDistance(X, Y);
    if (minDist == null || dist < minDist) {
      minDist = dist;
    }
    if (dist < RADIUS) {
      const serial = drone.getElementsByTagName('serialNumber')[0].innerHTML;
      violators.push({ serial, distance: dist });
    }
  });

  return { timeStamp, minDist, violators };
}

/**
 * Computes Euclidean distance between the drone and the nest
 * @param {Number} X x-coordinate
 * @param {Number} Y y-coordinate
 * @returns {Number} Euclidean distance from the NEST
 */
function getDistance (X, Y) {
  return Math.sqrt((X - NEST_X) ** 2 + (Y - NEST_Y) ** 2);
}
