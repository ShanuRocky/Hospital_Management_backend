import express from 'express';
import DietChart from '../models/DietChart.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const dietChart = new DietChart(req.body);
    const data = await dietChart.save();
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const dietCharts = await DietChart.find()
    .populate('patient_id')       // Populate patient details
    .populate('assigned_pantry') ;// Populate pantry details
    res.json(dietCharts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const dietChart = await DietChart.findById(req.params.id).populate('patient_id').populate('created_by');
    if (!dietChart) {
      return res.status(404).json({ error: 'Diet Chart not found' });
    }
    res.json(dietChart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const dietChart = await DietChart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!dietChart) {
      return res.status(404).json({ error: 'Diet Chart not found' });
    }
    res.json(dietChart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const dietChart = await DietChart.findByIdAndDelete(req.params.id);
    if (!dietChart) {
      return res.status(404).json({ error: 'Diet Chart not found' });
    }
    res.json({ message: 'Diet Chart deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
