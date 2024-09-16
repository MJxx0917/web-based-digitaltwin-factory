package com.example;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JSlider;

public class userInterface {
    private JPanel panel = new JPanel();
    private JFrame frame;
    private JButton button;
    private JSlider rotationSlider;
    private JSlider hingeSlider;
    private JSlider conveyoSlider1;
    private JSlider conveyoSlider2;
    private JSlider conveyoSlider3;

    private mqttConnector mqttClient;

    public userInterface() {
        initializeComponents();
        setupFrame();

        // Initialize MQTT connection
        mqttClient = new mqttConnector("tcp://broker.emqx.io:1883", "JavaClient");

        // Add action listener to button to send MQTT messages
        button.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                sendSliderValuesToMQTT();
            }
        });
    }

    private void initializeComponents() {
        // Initialize the JFrame and JButton components
        panel = new JPanel();
        frame = new JFrame("MQTT Controller");
        button = new JButton("OK");

        // Initialize sliders
        rotationSlider = new JSlider(JSlider.HORIZONTAL, 0, 100, 0);
        rotationSlider.setMajorTickSpacing(20);
        rotationSlider.setMinorTickSpacing(5);
        rotationSlider.setPaintTicks(true);
        rotationSlider.setPaintLabels(true);

        hingeSlider = new JSlider(JSlider.HORIZONTAL, 0, 100, 0);
        hingeSlider.setMajorTickSpacing(20);
        hingeSlider.setMinorTickSpacing(5);
        hingeSlider.setPaintTicks(true);
        hingeSlider.setPaintLabels(true);

        conveyoSlider1 = new JSlider(JSlider.HORIZONTAL, 0, 50, 25);
        conveyoSlider1.setMajorTickSpacing(20);
        conveyoSlider1.setMinorTickSpacing(5);
        conveyoSlider1.setPaintTicks(true);
        conveyoSlider1.setPaintLabels(true);

        conveyoSlider2 = new JSlider(JSlider.HORIZONTAL, 0, 50, 25);
        conveyoSlider2.setMajorTickSpacing(20);
        conveyoSlider2.setMinorTickSpacing(5);
        conveyoSlider2.setPaintTicks(true);
        conveyoSlider2.setPaintLabels(true);

        conveyoSlider3 = new JSlider(JSlider.HORIZONTAL, 0, 50, 25);
        conveyoSlider3.setMajorTickSpacing(20);
        conveyoSlider3.setMinorTickSpacing(5);
        conveyoSlider3.setPaintTicks(true);
        conveyoSlider3.setPaintLabels(true);

        // Labels for sliders
        JLabel labelRotation = new JLabel("Rotation Speed");
        JLabel labelHinge = new JLabel("Hinge Speed");
        JLabel labelConveyor1 = new JLabel("Conveyor 1 Speed");
        JLabel labelConveyor2 = new JLabel("Conveyor 2 Speed");
        JLabel labelConveyor3 = new JLabel("Conveyor 3 Speed");

        // Setting bounds for sliders
        rotationSlider.setBounds(50, 65, 300, 50);
        hingeSlider.setBounds(50, 130, 300, 50);
        conveyoSlider1.setBounds(50, 195, 300, 50);
        conveyoSlider2.setBounds(50, 260, 300, 50);
        conveyoSlider3.setBounds(50, 325, 300, 50);

        // Setting bounds for labels
        labelRotation.setBounds(50, 50, 150, 15);
        labelHinge.setBounds(50, 115, 150, 15);
        labelConveyor1.setBounds(50, 180, 150, 15);
        labelConveyor2.setBounds(50, 245, 150, 15);
        labelConveyor3.setBounds(50, 310, 150, 15);

        // Add components to panel
        panel.setLayout(null);
        panel.add(labelRotation);
        panel.add(rotationSlider);
        panel.add(labelHinge);
        panel.add(hingeSlider);
        panel.add(labelConveyor1);
        panel.add(conveyoSlider1);
        panel.add(labelConveyor2);
        panel.add(conveyoSlider2);
        panel.add(labelConveyor3);
        panel.add(conveyoSlider3);
        panel.add(button);

        // Button position
        button.setBounds(150, 400, 100, 40);
    }

    private void setupFrame() {
        // Set properties of the frame
        frame.add(panel);
        frame.setSize(400, 480); // Adjusted to fit all controls
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setResizable(false);
        frame.setVisible(true);
    }

    private void sendSliderValuesToMQTT() {
        String rotationValue = String.valueOf(rotationSlider.getValue());
        String hingeValue = String.valueOf(hingeSlider.getValue());
        String conveyoValue1 = String.valueOf(conveyoSlider1.getValue());
        String conveyoValue2 = String.valueOf(conveyoSlider2.getValue());
        String conveyoValue3 = String.valueOf(conveyoSlider3.getValue());

        // Publish each slider value to a specific topic
        mqttClient.publish("slider/rotation", rotationValue);
        mqttClient.publish("slider/hinge", hingeValue);
        mqttClient.publish("slider/conveyor1", conveyoValue1);
        mqttClient.publish("slider/conveyor2", conveyoValue2);
        mqttClient.publish("slider/conveyor3", conveyoValue3);
    }
}
