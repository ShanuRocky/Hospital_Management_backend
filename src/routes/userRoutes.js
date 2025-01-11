import { Router } from 'express';
import User from '../models/User.js'; 

const router = Router();

router.get('/', async (req, res) => {
    try {
      const role = req.query.role; 
      
      const filter = role ? { role } : {};
  
      const users = await User.find(filter);
  
      res.json(
        users,
      );
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  
  export default router;