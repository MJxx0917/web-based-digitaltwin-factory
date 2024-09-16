const express = require('express');
const http = require('http');
const app = express();
const port = 3000;
const server = http.createServer(app);
const cors = require('cors');

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173' // This should match your React app's URL
}));

// Import routes
const digitaltwins = require('./routes/digitaltwin');
const rotationRoutes = require('./routes/rotation');
const MqttHandler = require('./services/mqttService');
const mqttHandler = new MqttHandler();
mqttHandler.connect();

// Use routes
app.use('/digitaltwin', digitaltwins);
app.use('/rotation', rotationRoutes);

// Import the database configuration
const db = require('./config/db');

// Check the database info on startup
db.info().then((info) => {
  console.log('Database connected:', info);
});


// Start the server
server.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

