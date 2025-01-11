import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import User from './models/User.js';
import patientRoutes from './routes/patient.js';
import dietChartRoutes from './routes/dietChart.js';
import deliveryRoutes from './routes/deliveries.js';
import userRoutes from './routes/userRoutes.js'

config();

const app = express();
const httpServer = createServer(app);
const url = process.env.URL || "http://localhost:3000";
const io = new Server(httpServer, {
  cors: {
    origin: url,
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.set('io', io);

app.use(cors());
app.use(json());

await connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// await User.deleteMany();

const users = [
  {
    email: 'hospital_manager@xyz.com',
    password: 'Password@2025',
    role: 'manager',
    full_name: 'Hospital Manager',
    contact_number: '1234567890',
  },
  {
    email: 'hospital_pantry@xyz.com',
    password: 'Password@2025',
    role: 'pantry_staff',
    full_name: 'Pantry Staff',
    contact_number: '1234567891',
  },
  {
    email: 'hospital_delivery@xyz.com',
    password: 'Password@2025',
    role: 'delivery',
    full_name: 'Delivery Personnel',
    contact_number: '1234567892',
  },
];

// for (const user of users) {
//   const newUser = new User(user);
//   await newUser.save();
// }

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/diet-charts', dietChartRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});