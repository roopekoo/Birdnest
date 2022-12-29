import ViolatorHandler from "./ViolatorHandler.js";
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

export default class WebHandler {
    violatorHandler = ViolatorHandler;

    setViolatorInstance(instance) {
        this.violatorHandler = instance;
    }

    initServer() {
        const server = http.createServer((req, res) => {
            if (req.url === "/") {
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

}