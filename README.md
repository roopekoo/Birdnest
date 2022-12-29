# Birdnest
Project assignment for Reaktor Developer Trainee summer job.

This is a node.js web server application that fetches data from one website, computes the data and pushes it to the hosted website. The client sees the page updating in real time without needing to refresh the page manually.

## Assignment
The information about the assignment can be fount [here](https://assignments.reaktor.com/birdnest/).

The application fetches the drone location data from _assignments.reaktor.com/birdnest/drones_, computes the distance to the sensor at coordinates (250,250). The drones that are closer than 100 m from the sensor, will be saved in the Violators list for 10 minutes. The timer will reset if the drone re-enters the No-Drone-Zone.

A simple html page is served to the clients and a webSocket is established between clients and the server. On each page reload, the client is given the current violators list. Each new violator is put to the website violator list and after the 10 minute timeout of no new violators for given drone, it will be removed from the website list.

## Extra
The website will show the current closest distance with a color red, if closest drone is closer than 100 meters from the sensor and green, if the closest drone is further thatn 100 meters away.

The violators list will show the amount of violators in the list with an integer.

## Issues
The webSocket connection will close itself with a code _1006_ "Conenction lost" after some time. Probably due to client inactivity.
