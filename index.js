import fetchUrl from './utils/dataFetch.js'
import extractInfo from './utils/xmlParser.js'

// Drone location data fetch url
const url = "https://assignments.reaktor.com/birdnest/drones";

// Get data every 2 seconds
const fetchInterval = setInterval(fetchLoop, 2000);

async function fetchLoop() {
  //Fetch data
  const xml = await fetchUrl(url);
  //Extract timestamp, smallest distance and list of violators
  const violatorInfo = extractInfo(xml);
  console.log(violatorInfo) //Temporal check that the extractInfo works; Spams the console!!!
  //Send signal to broadcast nearest distance and list of violators
}

//TODO: add createServer
