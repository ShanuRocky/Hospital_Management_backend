import { Schema, model } from 'mongoose';

const patientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  diseases: [String],
  allergies: [String],
  room_number: {
    type: String,
    required: true,
  },
  bed_number: {
    type: String,
    required: true,
  },
  floor_number: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  contact_number: String,
  emergency_contact: String,
  emergency_contact_number: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export default model('Patient', patientSchema);