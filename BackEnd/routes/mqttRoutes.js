const express = require('express');
const router = express.Router();
const MqttHandler = require('../services/mqttService');

const mqttClient = new MqttHandler();
mqttClient.connect();

// Subscribe to a specific topic
router.get('/subscribe/:topic', (req, res) => {
    mqttClient.subscribeToTopic(req.params.topic);
    res.send(`Subscribed to ${req.params.topic}`);
});

// Publish a message
router.post('/publish', (req, res) => {
    const { topic, message } = req.body;
    mqttClient.publishMessage(topic, message);
    res.send(`Message published to ${topic}`);
});

// Optionally, disconnect MQTT client
router.get('/disconnect', (req, res) => {
    mqttClient.disconnect();
    res.send('MQTT client disconnected');
});

module.exports = router;

