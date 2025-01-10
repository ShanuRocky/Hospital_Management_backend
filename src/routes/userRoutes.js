import { Router } from 'express';
import User from '../models/User.js'; // Import the User model correctly

const router = Router();

router.get('/', async (req, res) => {
    try {
      const role = req.query.role; // Get the role from the query parameters
      
      // If a role is provided, filter users by role; otherwise, return all users
      const filter = role ? { role } : {};
  
      const users = await User.find(filter); // Fetch users with the specified role
  
      // Respond with the filtered users
      res.json(
        users,
      );
    } catch (error) {
      // Handle server errors
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  
  export default router;