import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../model/userModel.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'bookstore_default_secret';

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: '1h',
    }
  );
};

router.post('/register', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({ message: 'Send all required fields: name, email, password' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(409).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = createToken(user);
    return response.status(201).json({ message: 'User registered', token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: error.message });
  }
});

router.post('/login', async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ message: 'Send both email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return response.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response.status(401).json({ message: 'Invalid email or password' });
    }

    const token = createToken(user);
    return response.status(200).json({ message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: error.message });
  }
});

export default router;
