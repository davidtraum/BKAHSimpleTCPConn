const net = require('net');
const readline = require("readline");

const args = process.argv[2].split(':')
const ip = args[0];
const port = parseInt(args[1]);

console.log("Connection info", ip, port);


class Client {
    constructor(ip, port) {
        this.ip = ip;
        this.port = port;
        this.client = new net.Socket();
        this.client.on('data', (data) => {
            try {
                console.log("JSON", JSON.parse(data.toString()));
            } catch(ex) {
                console.log("PLAIN", data.toString());
            }
        });
        this.client.on('close', () => {
            console.log("Connection closed.");
        });
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.rl.on('line', (line) => {
            this.client.write(line);
        });
    }
    connect() {
        console.log("Connecting...");
        this.client.connect(this.port, this.ip, () => {
            console.log("Connected!");
        });
    }
}

const client = new Client(ip, port);
client.connect();