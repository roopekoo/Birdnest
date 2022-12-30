import ViolatorHandler from './ViolatorHandler.js';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ noServer: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

export default class WebHandler {
  violatorHandler = ViolatorHandler;
  clients = new Set();

  /**
   * Saves ViolatorHandler instance
   * @param {ViolatorHandler} instance 
   */
  setViolatorInstance (instance) {
    this.violatorHandler = instance;
  }
  /**
   * Open http server and webSocket
   */
  initServer () {
    const server = http.createServer((req, res) => {
      if (req.url === '/ws') {
        wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => { this.onSocketConnect(ws); });
      } else if (req.url === '/') {
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });
        res.write(fs.readFileSync(__dirname + '/../public/main.html'));
        res.end();
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    server.on('error', err => {
      console.error(err);
      server.close();
    });

    server.on('close', () => {
      console.log('Server closed.');
    });

    server.listen(PORT, () => {
      console.log(`Listening on port: ${PORT}`);
    });
  }
  /**
   * Save webSockets on a Set and give full list of violators on establishing the connection
   * @param {WebSocket} ws 
   */
  onSocketConnect (ws) {
    this.clients.add(ws);
    const violators = this.violatorHandler.violators_class.violatorList;
    this.sendSingleMessage(ws, { type: 'add', data: violators });

    ws.on('close', () => {
      this.clients.delete(ws);
    });
  }
  /**
   * Broadcast the same message to each client
   * @param {Object} datapacket Message package to be send
   */
  sendAll (datapacket) {
    this.clients.forEach(client => {
      this.sendSingleMessage(client, datapacket);
    });
  }
  /**
   * Send message to a single client
   * @param {WebSocket} target to whom to send the message
   * @param {Object} datapacket Message package to be send
   */
  sendSingleMessage (target, datapacket) {
    target.send(JSON.stringify(datapacket));
  }
  /**
   * Send ws message to every clients about new user need to be added to the list
   * @param {Object} userJSON Info about the violator
   */
  addUser (userJSON) {
    const datapacket = { type: 'add', data: [userJSON] };
    this.sendAll(datapacket);
  }
  /**
   * Send ws message to every client about need for removing the user from the list
   * @param {*} serialID Drone ID
   */
  deleteUser (serialID) {
    const datapacket = { type: 'remove', data: serialID };
    this.sendAll(datapacket);
  }
  /**
   * Send ws message to every client about a new closest distance
   * @param {Number} distance 
   */
  updateDist (distance) {
    const datapacket = { type: 'distance', data: distance };
    this.sendAll(datapacket);
  }
}
