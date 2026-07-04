// db.js
// Yeh file database ko initialize karti hai aur connection ready karti hai
// lowdb ek file-based JSON database hai - koi installation ki zarurat nahi

const FileSync = require('lowdb/adapters/FileSync');
const low = require('lowdb');
const path = require('path');

// Database file ka location - backend/db/database.json me save hoga
const adapter = new FileSync(path.join(__dirname, 'database.json'));
const db = low(adapter);

// Default structure - agar database empty hai to yeh structure set ho jayega
db.defaults({
  users: [],
  matches: [],
  sessions: [],
  messages: []
}).write();

module.exports = db;
