import express from 'express';
import MealDelivery from '../models/MealDelivery.js';

const router = express.Router();

router.get('/:role/:id', async (req, res) => {
  try {
    const role = req.params.role;
    const _id = req.params.id; 
    let query = {};

    if (role === 'pantry_staff') {
      query.assigned_to_pantry = _id;
    } else if (role === 'delivery') {
      query.assigned_to_delivery = _id;
    }

    const deliveries = await MealDelivery.find(query)
      .populate({
        path: 'diet_chart_id',
        populate: {
          path: 'patient_id',
          select: 'name room_number bed_number'
        }
      })
      .populate('assigned_to_pantry', 'full_name')
      .populate('assigned_to_delivery', 'full_name')
      .sort({ created_at: -1 });

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { diet_chart_id, assigned_to_pantry } = req.body;
    
    const delivery = new MealDelivery({
      diet_chart_id,
      assigned_to_pantry
    });

    await delivery.save();

    const io = req.app.get('io');
    io.to(assigned_to_pantry.toString()).emit('new_preparation_task', {
      delivery: await delivery.populate([
        {
          path: 'diet_chart_id',
          populate: {
            path: 'patient_id',
            select: 'name room_number bed_number'
          }
        },
        { path: 'assigned_to_pantry', select: 'full_name'}
      ])
    });

    res.status(201).json(delivery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id/preparation_status', async (req, res) => {
  try {
    const { preparation_status } = req.body;
    const delivery = await MealDelivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    if (delivery.preparation_status === 'ready') {
      return res.status(400).json({ error: 'Cannot modify status once ready' });
    }

    delivery.preparation_status = preparation_status;
    delivery.updated_at = new Date();
    await delivery.save();

    const io = req.app.get('io');
    io.emit('preparation_status_updated', {
      delivery_id: delivery._id,
      status: preparation_status
    });

    res.json(delivery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id/assign_delivery', async (req, res) => {
  try {
    const { assigned_to_delivery } = req.body;
    const delivery = await MealDelivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    if (delivery.preparation_status !== 'ready') {
      return res.status(400).json({ error: 'Cannot assign delivery staff until preparation is ready' });
    }

    delivery.assigned_to_delivery = assigned_to_delivery;
    delivery.updated_at = new Date();
    await delivery.save();

    const io = req.app.get('io');
    io.to(assigned_to_delivery.toString()).emit('new_delivery_task', {
      delivery: await delivery.populate([
        {
          path: 'diet_chart_id',
          populate: {
            path: 'patient_id',
            select: 'name room_number bed_number'
          }
        },
        { path: 'assigned_to_delivery', select: 'full_name' }
      ])
    });

    res.json(delivery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id/delivery_status', async (req, res) => {
  try {
    const { delivery_status } = req.body;
    const delivery = await MealDelivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    delivery.delivery_status = delivery_status;
    if (delivery_status === 'delivered') {
      delivery.delivered_at = new Date();
    }
    delivery.updated_at = new Date();
    await delivery.save();

    const io = req.app.get('io');
    io.emit('delivery_status_updated', {
      delivery_id: delivery._id,
      status: delivery_status
    });

    res.json(delivery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;