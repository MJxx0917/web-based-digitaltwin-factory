package com.example;

import org.eclipse.paho.client.mqttv3.IMqttClient;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;

public class mqttConnector {

    private IMqttClient client;

    // Constructor to connect to the MQTT broker
    public mqttConnector(String brokerUrl, String clientId) {
        try {
            // Create an MQTT client instance and connect to the broker
            client = new MqttClient(brokerUrl, clientId, new MemoryPersistence());
            client.connect();
            System.out.println("Connected to MQTT broker: " + brokerUrl);
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }

    // Publish a message to a specific topic
    public void publish(String topic, String message) {
        try {
            MqttMessage mqttMessage = new MqttMessage(message.getBytes());
            mqttMessage.setQos(2); // Set QoS level
            client.publish(topic, mqttMessage);
            System.out.println("Message published: " + message);
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }

    // Disconnect from the broker
    public void disconnect() {
        try {
            if (client != null) {
                client.disconnect();
                System.out.println("Disconnected from MQTT broker.");
            }
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }
}
