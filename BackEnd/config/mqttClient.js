const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.emqx.io'); // Use your MQTT broker URL here

client.on('connect', () => {
    console.log('MQTT Client Connected');

    // Subscribe to the base rotation speed topic
    client.subscribe('unity/control/rotationSpeed', (err) => {
        if (err) console.log('Subscription error for rotation speed:', err);
        else console.log('Subscribed to unity/control/rotationSpeed');
    });

    // Subscribe to the hinge rotation speed topic
    client.subscribe('unity/control/hingeSpeed', (err) => {
        if (err) console.log('Subscription error for hinge speed:', err);
        else console.log('Subscribed to unity/control/hingeSpeed');
    });
});

client.on('message', (topic, message) => {
    console.log(`Received message from ${topic}: ${message.toString()}`);
    // Here, you can add conditional logic to handle messages based on the topic
    if (topic === 'unity/control/rotationSpeed') {
        console.log(`Handle base rotation speed: ${message.toString()}`);
        // Additional logic to handle base rotation speed update
    } else if (topic === 'unity/control/hingeSpeed') {
        console.log(`Handle hinge rotation speed: ${message.toString()}`);
        // Additional logic to handle hinge speed update
    }
});

// Export the client to use in other parts of your application
module.exports = client;

