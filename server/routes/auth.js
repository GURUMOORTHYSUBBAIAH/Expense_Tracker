// server/routes/auth.js
import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });

    const token = jwt.sign(
        {
          id: user._id,
          name: user.name // ✅ Add this line to include the name
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );      
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Wrong password' });

    const token = jwt.sign(
        {
          id: user._id,
          name: user.name // ✅ Add this line to include the name
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );      
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
});

export default router;
