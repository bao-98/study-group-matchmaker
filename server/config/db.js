// server/config/db.js
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function connectToDb() {
  try {
    await client.connect();
    db = client.db(); // Automatically uses the DB name from URI
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

function getDb() {
  return db;
}

module.exports = { connectToDb, getDb };
