import fetchUrl from './utils/dataFetch.js';
import extractInfo from './utils/xmlParser.js';
import ViolatorHandler from './Handlers/ViolatorHandler.js';
import WebHandler from './Handlers/WebHandler.js';

const INTERVAL = 2 * 1000;

// Drone location data fetch URL
const url = 'https://assignments.reaktor.com/birdnest/drones';

const violatorHandler = new ViolatorHandler();
const webHandler = new WebHandler();
// Give handler instances
violatorHandler.setWebInstance(webHandler);
webHandler.setViolatorInstance(violatorHandler);

// Create server
webHandler.initServer();

// Get data every 2 seconds
setInterval(fetchLoop, INTERVAL);

/**
 * Fetch data from URL, extract info and send the data to ViolatorHandler
 */
async function fetchLoop() {
  // Fetch data
  const xml = await fetchUrl(url);
  if (xml !== '') {
    // Extract timestamp, smallest distance, and list of violators
    const violatorInfo = extractInfo(xml);
    // Send info to violatorHandler
    violatorHandler.handleViolators(violatorInfo);
  }

}
