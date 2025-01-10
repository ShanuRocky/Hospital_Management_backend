import { Schema, model } from 'mongoose';

const dietChartSchema = new Schema({
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  meal_type: {
    type: String,
    enum: ['morning', 'evening', 'night'],
    required: true,
  },
  ingredients: [String],
  instructions: String,

  assigned_pantry:{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default model('DietChart', dietChartSchema);