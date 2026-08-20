// config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export async function initDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected successfully (MongoDB)');
  } catch (error) {
    console.error('Error initializing DB:', error);
    process.exit(1); // Exit with failure
  }
}

export default mongoose;