# Birdnest
Project assignment for Reaktor Developer Trainee summer job.

This is a node.js web server application that fetches data from one website, computes the data, and pushes it to the hosted website. The client sees the page updating in real-time without needing to refresh the page manually.

This application is hosted by Render.com and can be seen online [here](https://birdnest-violator-list.onrender.com/).

## Assignment
The information about the assignment can be found [here](https://assignments.reaktor.com/birdnest/).

The application fetches the drone location data from _assignments.reaktor.com/birdnest/drones_ and computes the distance to the sensor at coordinates (250,250). The drones that are closer than 100 m from the sensor, will be saved in the Violators list for 10 minutes. The timer will reset if the drone re-enters the No-Drone-Zone.

A simple HTML page is served to the clients and a WebSocket is established between clients and the server. On each page reload, the client is given the current violators list. Each new violator is put on the website violator list and after the 10-minute timeout of no new violators for a given drone, it will be removed from the website list.

## Extra
The website will show the current closest distance with the color red if the closest drone is closer than 100 meters from the sensor and green if the closest drone is further than 100 meters away.

The violator list will show the number of violators in the list with an integer.

## Issues
The WebSocket connection will close itself with a code _1006_ "Connection lost" after some time. Probably due to client inactivity.

As Render.com is a free hosting service, the server will shut down after 15 minutes of inactivity. It will start up normally on opening the website but the violator list will be empty. Please wait about 10 minutes to see the first elements on the list to be removed.
