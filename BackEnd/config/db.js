const pouchDB = require("pouchdb");

// Create a new database instance
const db = new pouchDB("digitaltwin");

// Export the database instance
module.exports = db;
