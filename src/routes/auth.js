import { Router } from 'express';
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import User from '../models/User.js'; 

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password , role } = req.body;

    const user = await User.findOne({ email });

    if(user.role != role)
    {
        return res.status(401).json({ error: 'user not authenticated'});
    }

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials'});
    }

    const token = sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

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
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
