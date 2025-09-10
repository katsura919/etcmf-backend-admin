import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB;
    
    if (!mongoUri) {
      throw new Error('MONGODB connection string is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
