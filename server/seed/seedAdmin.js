import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => rl.question(question, (ans) => resolve(ans.trim())));

const seedAdmin = async () => {
  try {
    await connectDB();

    const existing = await User.findOne({ role: 'admin' });
    if (existing) {
      console.log('⚠️ Admin already exists.');
      process.exit(0);
    }

    const name = await ask('👤 Enter Admin Name: ');
    const email = await ask('📧 Enter Admin Email: ');
    const phone = await ask('📱 Enter Admin Mobile: ');
    const password = await ask('🔒 Enter Admin Password: ');

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('\n✅ Admin account created securely!');
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed admin:', error);
    rl.close();
    process.exit(1);
  }
};

seedAdmin();
