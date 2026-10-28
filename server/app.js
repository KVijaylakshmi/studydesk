import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import { User, Task } from './models.js';
import { taskInput } from './validation.js';

export const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }));
app.use(express.json({ limit: '20kb' }));
const authLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false, message: { message: 'Too many attempts. Please try again later.' } });

function session(user) {
  return { token: jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' }), user: { name: user.name, email: user.email } };
}
function requireLogin(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ');
    if (token?.[0] !== 'Bearer') throw new Error();
    req.userId = jwt.verify(token[1], process.env.JWT_SECRET).id;
    next();
  } catch { res.status(401).json({ message: 'Please log in again.' }); }
}
app.get('/api/health', (req, res) => res.json({ message: 'StudyDesk API is running' }));
app.post('/api/auth/register', authLimit, async (req, res) => {
  const { name, email, password } = req.body;
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 60 || typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password) > 72) return res.status(400).json({ message: 'Enter a name, valid email, and password (8–72 bytes).' });
  try {
    const user = await User.create({ name: name.trim(), email: email.trim().toLowerCase(), password: await bcrypt.hash(password, 10) });
    res.status(201).json(session(user));
  } catch (error) { if (error.code === 11000) return res.status(409).json({ message: 'This email is already registered.' }); throw error; }
});
app.post('/api/auth/login', authLimit, async (req, res) => {
  const { email, password } = req.body;
  if (typeof email !== 'string' || typeof password !== 'string') return res.status(400).json({ message: 'Enter your email and password.' });
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Incorrect email or password.' });
  res.json(session(user));
});
app.use('/api/tasks', requireLogin);
app.get('/api/tasks', async (req, res) => res.json(await Task.find({ user: req.userId }).sort({ createdAt: -1 })));
app.post('/api/tasks', async (req, res) => {
  let data;
  try { data = taskInput(req.body); } catch (error) { return res.status(400).json({ message: error.message }); }
  res.status(201).json(await Task.create({ ...data, user: req.userId }));
});
app.put('/api/tasks/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID.' });
  let data;
  try { data = taskInput(req.body); } catch (error) { return res.status(400).json({ message: error.message }); }
  const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.userId }, data, { new: true, runValidators: true });
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  res.json(task);
});
app.delete('/api/tasks/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID.' });
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  res.json({ message: 'Task deleted.' });
});
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use((error, req, res, next) => {
  console.error(error.message);
  res.status(error.status === 400 ? 400 : 500).json({ message: error.status === 400 ? 'Invalid request body.' : 'Something went wrong. Please try again.' });
});
