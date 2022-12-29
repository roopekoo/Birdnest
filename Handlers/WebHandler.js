import ViolatorHandler from "./ViolatorHandler.js";
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

    setViolatorInstance(instance) {
        this.violatorHandler = instance;
    }

    initServer() {
        const server = http.createServer((req, res) => {
            if (req.url == '/ws') {
                wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => { this.onSocketConnect(ws) });
            } else if (req.url === "/") {
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

    onSocketConnect(ws) {
        this.clients.add(ws);
        const violators = this.violatorHandler.violators_class.violatorList;
        this.sendSingleMessage(ws, { type: "add", data: violators });

        ws.on('close', () => {
            this.clients.delete(ws);
        });
    }

    sendAll(datapacket) {
        this.clients.forEach(client => {
            this.sendSingleMessage(client, datapacket)
        });
    }

    sendSingleMessage(target, datapacket) {
        target.send(JSON.stringify(datapacket));
    }

    addUser(userJSON) {
        const datapacket = { type: "add", data: [userJSON] };
        this.sendAll(datapacket);
    }

    deleteUser(serialID) {
        const datapacket = { type: "remove", data: serialID };
        this.sendAll(datapacket);
    }

    updateDist(distance) {
        const datapacket = { type: "distance", data: distance };
        this.sendAll(datapacket);
    }
}