import fetchUrl from './utils/dataFetch.js'

// Drone location data fetch url
const url = "https://assignments.reaktor.com/birdnest/drones";

// Get data every 2 seconds
const fetchInterval = setInterval(fetchLoop, 2000);

async function fetchLoop() {
  //Fetch data
  const xml = await fetchUrl(url);
  console.log(xml) //Temporal check that the fetching works; Spams the console!!!
  //Extract timestamp, smallest distance and list of violators
  //Send signal to broadcast nearest distance and list of violators
}

//TODO: add createServer
