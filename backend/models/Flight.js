const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  airline: { type: String, required: true, trim: true },
  origin: { type: String, required: true, trim: true },
  destination: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  departureTime: { type: Date, required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  status: { type: String, enum: ['Scheduled', 'Delayed', 'Cancelled'], default: 'Scheduled' },
  imageURL: [{ type: String, required: true }],
}, { timestamps: true });

module.exports = mongoose.model('Flight', flightSchema);
