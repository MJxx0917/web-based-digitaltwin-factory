const express = require('express');
const http = require('http');
const app = express();
const port = 3000;
const server = http.createServer(app);

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const digitaltwins = require('./routes/digitaltwin');
const mqttPublish = require('./routes/mqttPublish');

// Use routes
app.use('/digitaltwin', digitaltwins);
app.use('/mqtt', mqttPublish);  // This includes your new endpoint

// Import the database configuration
const db = require('./config/db');

// Check the database info on startup
db.info().then((info) => {
  console.log('Database connected:', info);
});

// Import the MQTT client configuration
const mqttClient = require('./config/mqttClient');

// MQTT client connection and event handling
mqttClient.on('connect', () => {
    console.log('MQTT Client Connected');
    mqttClient.subscribe('unity/control/rotationSpeed', (err) => {
        if (err) {
            console.log('Subscription error:', err);
        } else {
            console.log('Subscribed to topic: unity/control/rotationSpeed');
        }
    });
});

mqttClient.on('message', (topic, message) => {
    console.log(`Received message from ${topic}: ${message.toString()}`);
});

// Start the server
server.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

