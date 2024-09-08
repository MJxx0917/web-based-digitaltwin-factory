// mqttPublish.js
const express = require('express');
const router = express.Router();
const mqttClient = require('../config/mqttClient'); // Adjust the path as needed

// Existing general publish endpoint
router.post('/publish', (req, res) => {
    const { topic, message } = req.body;
    mqttClient.publish(topic, message, (err) => {
        if (err) {
            res.status(500).send("Failed to publish message");
        } else {
            res.send("Message published successfully");
        }
    });
});

// New specific endpoint for setting rotation speed
router.post('/setRotationSpeed', (req, res) => {
    const { speed } = req.body; // Expecting a numeric speed value in the request body
    const topic = 'unity/control/rotationSpeed'; // Fixed MQTT topic for rotation speed
    const message = speed.toString(); // Convert speed to string for MQTT message
    console.log(`Attempting to publish speed: ${speed}`);
    mqttClient.publish(topic, message, (err) => {
        if (err) {
            console.error("Failed to publish message", err);
            res.status(500).send("Failed to publish rotation speed");
        } else {
            console.log("Message published successfully");
            res.send("Rotation speed updated successfully");
        }
    });
});

// Existing response for GET request - explaining correct usage
router.get('/publish', (req, res) => {
    res.status(405).send("This endpoint requires a POST request.");
});

module.exports = router;

