const express = require('express');
const router = express.Router();

// Global variables for speeds
global.rotationSpeed = 10;  // Default rotation speed
global.hingeSpeed = 10;     // Default hinge speed
global.conveyorSpeed1 = 0.7;

// Endpoint to update base rotation speed
router.post('/updateRotationSpeed', (req, res) => {
    const { speed } = req.body;
    global.rotationSpeed = parseFloat(speed);  // Convert to float to ensure proper type
    res.send({ success: true, speed: global.rotationSpeed });
});

// Endpoint to get base rotation speed
router.get('/getRotationSpeed', (req, res) => {
    res.send({ success: true, speed: global.rotationSpeed });
});

// Endpoint to update hinge speed
router.post('/updateHingeSpeed', (req, res) => {
    const { speed } = req.body;
    global.hingeSpeed = parseFloat(speed);  // Convert to float to ensure proper type
    res.send({ success: true, speed: global.hingeSpeed });
});

// Endpoint to get hinge speed
router.get('/getHingeSpeed', (req, res) => {
    res.send({ success: true, speed: global.hingeSpeed });
});

// Endpoint to update conveyor speed
router.post('/updateConveyorSpeed1', (req, res) => {
    const { speed } = req.body;
    global.conveyorSpeed1 = parseFloat(speed);  // Convert to float to ensure proper type
    res.send({ success: true, speed: global.conveyorSpeed1 });
});

// Endpoint to get conveyor speed
router.get('/getConveyorSpeed1', (req, res) => {
    res.send({ success: true, speed: global.conveyorSpeed1 });
});

router.post('/updateConveyorSpeed2', (req, res) => {
    const { speed } = req.body;
    global.conveyorSpeed2 = parseFloat(speed);  // Convert to float to ensure proper type
    res.send({ success: true, speed: global.conveyorSpeed2 });
});

// Endpoint to get conveyor speed
router.get('/getConveyorSpeed2', (req, res) => {
    res.send({ success: true, speed: global.conveyorSpeed2 });
});

router.post('/updateConveyorSpeed3', (req, res) => {
    const { speed } = req.body;
    global.conveyorSpeed3 = parseFloat(speed);  // Convert to float to ensure proper type
    res.send({ success: true, speed: global.conveyorSpeed3 });
});

// Endpoint to get conveyor speed
router.get('/getConveyorSpeed3', (req, res) => {
    res.send({ success: true, speed: global.conveyorSpeed3 });
});

module.exports = router;
