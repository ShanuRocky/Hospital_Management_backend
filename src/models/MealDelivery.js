import { Schema, model } from 'mongoose';

const mealDeliverySchema = new Schema({
  diet_chart_id: {
    type: Schema.Types.ObjectId,
    ref: 'DietChart',
    required: true,
  },
  assigned_to_pantry: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assigned_to_delivery: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  preparation_status: {
    type: String,
    enum: ['pending', 'preparing', 'ready'],
    default: 'pending',
  },
  delivery_status: {
    type: String,
    enum: ['pending', 'in_progress', 'delivered'],
    default: 'pending',
  },
  delivered_at: Date,
  delivery_notes: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
}, { strict: true });

export default model('MealDelivery', mealDeliverySchema);