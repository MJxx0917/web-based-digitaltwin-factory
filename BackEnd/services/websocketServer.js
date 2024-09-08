const WebSocket = require('ws');
const server = new WebSocket.Server({ noServer: true });
const mqttClient = require('../config/mqttClient')

server.on('connection', function connection(ws) {
    console.log('A client connected');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.on('close', function () {
        console.log('A client disconnected');
    });
});

mqttClient.on('message', (topic, message) => {
    console.log(`Received message from ${topic}: ${message.toString()}`);
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message.toString());
        }
    });
});

module.exports = server;

