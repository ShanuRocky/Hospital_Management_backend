import { Schema, model } from 'mongoose';
import bcryptjs from 'bcryptjs';

const { hash, compare } = bcryptjs; // Destructure the required methods

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['manager', 'pantry_staff', 'delivery'],
    required: true,
  },
  full_name: {
    type: String,
    required: true,
  },
  contact_number: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return compare(candidatePassword, this.password);
};

export default model('User', userSchema);