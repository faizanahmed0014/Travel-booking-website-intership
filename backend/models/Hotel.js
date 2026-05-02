const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  location: { type: String, required: true, trim: true },
  pricePerNight: { type: Number, required: true },
  totalRooms: { type: Number, required: true },
  availableRooms: { type: Number, required: true },
  status: { type: String, enum: ['Available', 'Booked'], default: 'Available' },
  imageURL: [{ type: String, required: true }],
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
