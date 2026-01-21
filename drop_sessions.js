require('dotenv').config();
const mongoose = require("mongoose");

const DB_URL = process.env.ATLASDB_URL;

async function dropSessions() {
    try {
        await mongoose.connect(DB_URL);
        console.log("Connected to DB");

        // Drop the sessions collection
        await mongoose.connection.db.dropCollection('sessions');
        console.log("Sessions collection dropped successfully");

        await mongoose.disconnect();
        console.log("Disconnected from DB");
    } catch (error) {
        console.error("Error dropping sessions:", error);
    }
}

dropSessions();
