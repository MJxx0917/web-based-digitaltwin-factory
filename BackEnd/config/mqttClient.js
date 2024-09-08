const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com'); // Use your MQTT broker URL here

client.on('connect', () => {
    console.log('MQTT Client Connected');
    client.subscribe('unity/control/rotationSpeed', (err) => {
        if (err) console.log('Subscription error:', err);
        else console.log('Subscribed to unity/control/rotationSpeed');
    });
});

client.on('message', (topic, message) => {
    console.log(`Received message from ${topic}: ${message.toString()}`);
    // Here, you can also call functions to handle messages
});

// Export the client to use in other parts of your application
module.exports = client;

