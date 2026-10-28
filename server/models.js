import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }
}, { timestamps: true });

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  subject: { type: String, required: true, trim: true, maxlength: 60 },
  description: { type: String, default: '', maxlength: 1000 },
  dueDate: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['To do', 'In progress', 'Completed'], default: 'To do' }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Task = mongoose.model('Task', taskSchema);
