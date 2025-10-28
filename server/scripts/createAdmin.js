import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update first user to admin (or create one)
    const user = await User.findOne();
    
    if (user) {
      user.role = 'admin';
      await user.save();
      console.log(`✅ User ${user.email} is now an admin`);
    } else {
      console.log('❌ No users found. Please register first.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();