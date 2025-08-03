import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import productRoutes from './routes/productDetails.js';
import chatRoutes from './routes/chat.js';
import sellerRoutes from './routes/sellerRoutes.js'; // ✅ FIXED

dotenv.config();
const app = express();

const allowedOrigins = ['https://hairloom-project-client.onrender.com'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// ✅ Route registrations
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/sellers', sellerRoutes); // ✅ FIXED

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
console.log("MONGO_URI =>", process.env.MONGO_URI);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
