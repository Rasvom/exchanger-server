import mongoose from 'mongoose';
import { hash } from 'bcrypt';
import dotenv from 'dotenv';
import Manager from '@models/Manager.model';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in environment');
  process.exit(1);
}

const createInitialManager = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if there are any existing managers
    const existingManagers = await Manager.countDocuments();
    
    if (existingManagers > 0) {
      console.log('Managers already exist. Skipping initial manager creation.');
      await mongoose.disconnect();
      return;
    }

    // Create default manager
    const defaultManager = {
      fullName: 'Administrator',
      login: 'admin',
      password: await hash('admin123', 10)
    };

    const newManager = new Manager(defaultManager);
    await newManager.save();

    console.log('Initial manager created successfully!');
    console.log('Login: admin');
    console.log('Password: admin123');
    console.log('Please change this password after first login for security.');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating initial manager:', error);
    process.exit(1);
  }
};

createInitialManager(); 