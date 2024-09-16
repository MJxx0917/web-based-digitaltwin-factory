const mqtt = require('mqtt');
const axios = require('axios'); // Axios for making HTTP requests
const config = require('../config/mqttConfig');

class MqttHandler {
    constructor() {
        this.client = mqtt.connect(config.mqttUrl, {
            clientId: config.clientId
        });
    }

    connect() {
        this.client.on('connect', () => {
            console.log('Connected to MQTT broker');
            // Subscribe to necessary topics
            this.client.subscribe('slider/rotation');
            this.client.subscribe('slider/hinge');
            this.client.subscribe('slider/conveyor1');
            this.client.subscribe('slider/conveyor2');
            this.client.subscribe('slider/conveyor3');
        });

        // Handling messages
        this.client.on('message', (topic, message) => {
            console.log(`Received message on ${topic}: ${message.toString()}`);
            this.handleIncomingMessage(topic, message.toString());
        });
    }

    handleIncomingMessage(topic, message) {
        // Parse the topic to determine the type of speed being updated
        let apiEndpoint;
        switch (topic) {
            case 'slider/rotation':
                apiEndpoint = 'updateRotationSpeed';
                break;
            case 'slider/hinge':
                apiEndpoint = 'updateHingeSpeed';
                break;
            case 'slider/conveyor1':
                apiEndpoint = 'updateConveyorSpeed1';
                break;
            case 'slider/conveyor2':
                apiEndpoint = 'updateConveyorSpeed2';
                break;
            case 'slider/conveyor3':
                apiEndpoint = 'updateConveyorSpeed3';
                break;
        }

        // Use Axios to send a POST request to the respective API endpoint
        if (apiEndpoint) {
            axios.post(`http://localhost:3000/rotation/${apiEndpoint}`, {
                speed: message
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                console.log(`Updated via REST API: ${response.data}`);
            }).catch(error => {
                console.error('Error updating via REST API:', error);
            });
        }
    }
}

module.exports = MqttHandler;

