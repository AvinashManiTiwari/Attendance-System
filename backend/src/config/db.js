// src/config/db.js
const mongoose = require("mongoose");
const dns = require("dns");

// Node.js ko Google aur Cloudflare public DNS use karne ke liye batayein
// Yeh local router ke querySrv ECONNREFUSED issue ko fix karta hai
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Failure par server band kar dega
  }
};

module.exports = connectDB;