import fetchUrl from './utils/dataFetch.js'
import extractInfo from './utils/xmlParser.js'
import violatorHandler from './Handlers/violatorHandler.js'
import Violators from './Handlers/Violators.js';

const INTERVAL = 2 * 1000;

// Drone location data fetch url
const url = "https://assignments.reaktor.com/birdnest/drones";

//Add Violators class instance
var violators = new Violators

// Get data every 2 seconds
const fetchInterval = setInterval(fetchLoop, INTERVAL);

async function fetchLoop() {
  //Fetch data
  const xml = await fetchUrl(url);
  //Extract timestamp, smallest distance and list of violators
  const violatorInfo = extractInfo(xml);
  //Send info to violatorHandler
  violatorHandler(violators, violatorInfo);
}

//TODO: add createServer
