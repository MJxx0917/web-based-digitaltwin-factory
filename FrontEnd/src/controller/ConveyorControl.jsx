import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';

const ConveyorControl = () => {
  const [message, setMessage] = useState('');
  const [client, setClient] = useState(null);

  useEffect(() => {
    // Establish MQTT connection
    const mqttClient = mqtt.connect('ws://localhost:1883');

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      mqttClient.subscribe('conveyor/control', (err) => {
        if (!err) {
          console.log('Subscribed to conveyor/control');
        }
      });
    });

    mqttClient.on('message', (topic, message) => {
      console.log(`Message received on topic ${topic}: ${message.toString()}`);
      setMessage(message.toString());
    });

    // Save the client instance
    setClient(mqttClient);

    // Cleanup on component unmount
    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []);

  const handleStart = () => {
    if (client) {
      client.publish('conveyor/control', 'Start Conveyor');
    }
  };

  const handleStop = () => {
    if (client) {
      client.publish('conveyor/control', 'Stop Conveyor');
    }
  };

  return (
    <div>
      <h1>Conveyor Control System</h1>
      <p>Message: {message}</p>
      <button onClick={handleStart}>Start Conveyor</button>
      <button onClick={handleStop}>Stop Conveyor</button>
    </div>
  );
};

export default ConveyorControl;

