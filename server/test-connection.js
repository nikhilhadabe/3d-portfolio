// server/test-connection.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

console.log('Testing connection string:', uri.replace(/mongodb\+srv:\/\/[^:]+:[^@]+@/, 'mongodb+srv://USER:PASSWORD@'));

mongoose.connect(uri)
  .then(() => {
    console.log("✅ MongoDB Connection successful!");
    process.exit(0);
  })
  .catch(error => {
    console.log("❌ Connection failed:", error.message);
    process.exit(1);
  });