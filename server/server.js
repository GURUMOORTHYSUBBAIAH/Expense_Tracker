import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';

dotenv.config();

const app = express();
app.use(cors());  // ✅ Allow requests from frontend
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch((err) => console.error('MongoDB connection failed:', err));
