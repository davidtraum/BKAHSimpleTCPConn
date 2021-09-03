const net = require('net');

const portInput = parseInt(process.argv[2])

class ConnectedClient {
	constructor(socket, server) {
		this.socket = socket;
		this.server = server;
		this.socket.on('close', () => {
			this.server.disconnect(this);
		});
		this.socket.on('data', (data) => {
			this.server.broadcast(this, data);
		});
	}
	send(data) {
		this.socket.write(data);
	}
}

class Server {
	constructor(ip, port) {
		this.connections = [];
		this.server = net.createServer(socket => {
			console.log("Socket conn")
			const conn = new ConnectedClient(socket, this);
			this.connections.push(conn);
			conn.send('Connected');
		});
		this.server.listen(port, ip);
		console.log("Server ready on port", port);
	}
	disconnect(conn) {
		this.connections.splice(this.connections.indexOf(conn), 1);
	}
	broadcast(sender, data) {
		for(const client of this.connections) {
			if(client !== sender) {
				client.send(data.toString());
			}
		}
	}
}

new Server('', portInput);
