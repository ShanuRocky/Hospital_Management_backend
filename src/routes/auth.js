import { Router } from 'express';
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import User from '../models/User.js'; // Import the User model correctly

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password , role } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if(user.role != role)
    {
        return res.status(401).json({ error: 'user not authenticated'});
    }

    // Check if user exists and the password matches
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials'});
    }

    // Generate a JWT token
    const token = sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Respond with the token and user details
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
      },
    });
  } catch (error) {
    // Handle server errors
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
