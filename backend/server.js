const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedAdmin = require('./config/adminSeed');
const authRoutes = require('./routes/auth');
const entityRoutes = require('./routes/entities');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '12mb' }));

connectDB().then(() => seedAdmin());

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', entityRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Travel Booking API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
