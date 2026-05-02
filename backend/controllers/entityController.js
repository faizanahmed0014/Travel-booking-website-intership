const Hotel = require('../models/Hotel');
const Flight = require('../models/Flight');

exports.getHotels = async (req, res) => {
  try {
    const { search, location, minPrice, maxPrice } = req.query;
    const query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (minPrice) query.pricePerNight = { ...query.pricePerNight, $gte: Number(minPrice) };
    if (maxPrice) query.pricePerNight = { ...query.pricePerNight, $lte: Number(maxPrice) };

    const hotels = await Hotel.find(query).sort({ createdAt: -1 });
    res.json(hotels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not fetch hotels' });
  }
};

exports.getFlights = async (req, res) => {
  try {
    const { origin, destination, minPrice, maxPrice, search } = req.query;
    const query = {};
    if (origin) query.origin = { $regex: origin, $options: 'i' };
    if (destination) query.destination = { $regex: destination, $options: 'i' };
    if (search) query.airline = { $regex: search, $options: 'i' };
    if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
    const flights = await Flight.find(query).sort({ departureTime: 1 });
    res.json(flights);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not fetch flights' });
  }
};

exports.getEntityById = async (req, res) => {
  try {
    const { type, id } = req.params;
    const normalizedType = type.toLowerCase();
    if (normalizedType === 'hotel' || normalizedType === 'hotels') {
      const hotel = await Hotel.findById(id);
      if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
      return res.json(hotel);
    }
    if (normalizedType === 'flight' || normalizedType === 'flights') {
      const flight = await Flight.findById(id);
      if (!flight) return res.status(404).json({ message: 'Flight not found' });
      return res.json(flight);
    }
    res.status(400).json({ message: 'Invalid entity type' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not fetch entity' });
  }
};

exports.getFeatured = async (req, res) => {
  try {
    const hotels = await Hotel.find({ availableRooms: { $gt: 0 } }).limit(4).sort({ createdAt: -1 });
    const flights = await Flight.find({ status: 'Scheduled' }).limit(4).sort({ departureTime: 1 });
    res.json({ hotels, flights });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not fetch featured content' });
  }
};
