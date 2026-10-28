import 'dotenv/config';
import mongoose from 'mongoose';
import { app } from './app.js';

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.startsWith('replace-')) {
  console.error('Set MONGODB_URI and a random JWT_SECRET (32+ characters) in server/.env. See README.md.');
  process.exit(1);
}
try {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  app.listen(process.env.PORT || 5000, () => console.log(`StudyDesk API: http://localhost:${process.env.PORT || 5000}`));
} catch {
  console.error('MongoDB connection failed. Check MONGODB_URI, database access, and your network.');
  process.exit(1);
}
