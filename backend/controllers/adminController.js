const Hotel = require('../models/Hotel');
const Flight = require('../models/Flight');

exports.createEntity = async (req, res) => {
  try {
    const { type, payload } = req.body;
    if (type === 'hotel') {
      const availableRooms = payload.availableRooms || payload.totalRooms;
      const hotel = await Hotel.create({
        title: payload.title,
        description: payload.description,
        location: payload.location,
        pricePerNight: payload.pricePerNight,
        totalRooms: payload.totalRooms,
        availableRooms,
        status: availableRooms < 1 ? 'Booked' : 'Available',
        imageURL: payload.imageURL,
      });
      return res.status(201).json(hotel);
    }
    if (type === 'flight') {
      const availableSeats = payload.availableSeats || payload.totalSeats;
      const flight = await Flight.create({
        airline: payload.airline,
        origin: payload.origin,
        destination: payload.destination,
        price: payload.price,
        departureTime: payload.departureTime,
        totalSeats: payload.totalSeats,
        availableSeats,
        status: payload.status || 'Scheduled',
        imageURL: payload.imageURL,
      });
      return res.status(201).json(flight);
    }
    res.status(400).json({ message: 'Invalid entity type' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not create entity' });
  }
};

exports.updateEntity = async (req, res) => {
  try {
    const { type, id } = req.params;
    const payload = req.body;
    if (type === 'hotel') {
      const hotel = await Hotel.findById(id);
      if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
      hotel.title = payload.title || hotel.title;
      hotel.description = payload.description || hotel.description;
      hotel.location = payload.location || hotel.location;
      hotel.pricePerNight = payload.pricePerNight ?? hotel.pricePerNight;
      hotel.totalRooms = payload.totalRooms ?? hotel.totalRooms;
      hotel.availableRooms = payload.availableRooms ?? hotel.availableRooms;
      hotel.availableRooms = Math.min(hotel.availableRooms, hotel.totalRooms);
      hotel.status = hotel.availableRooms < 1 ? 'Booked' : 'Available';
      hotel.imageURL = payload.imageURL?.length ? payload.imageURL : hotel.imageURL;
      await hotel.save();
      return res.json(hotel);
    }
    if (type === 'flight') {
      const flight = await Flight.findById(id);
      if (!flight) return res.status(404).json({ message: 'Flight not found' });
      flight.airline = payload.airline || flight.airline;
      flight.origin = payload.origin || flight.origin;
      flight.destination = payload.destination || flight.destination;
      flight.price = payload.price ?? flight.price;
      flight.departureTime = payload.departureTime ? new Date(payload.departureTime) : flight.departureTime;
      flight.totalSeats = payload.totalSeats ?? flight.totalSeats;
      flight.availableSeats = payload.availableSeats ?? flight.availableSeats;
      flight.availableSeats = Math.min(flight.availableSeats, flight.totalSeats);
      flight.status = payload.status || flight.status;
      flight.imageURL = payload.imageURL?.length ? payload.imageURL : flight.imageURL;
      await flight.save();
      return res.json(flight);
    }
    res.status(400).json({ message: 'Invalid entity type' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not update entity' });
  }
};

exports.deleteEntity = async (req, res) => {
  try {
    const { type, id } = req.params;
    if (type === 'hotel') {
      const hotel = await Hotel.findById(id);
      if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
      await hotel.deleteOne();
      return res.json({ message: 'Hotel deleted successfully' });
    }
    if (type === 'flight') {
      const flight = await Flight.findById(id);
      if (!flight) return res.status(404).json({ message: 'Flight not found' });
      await flight.deleteOne();
      return res.json({ message: 'Flight deleted successfully' });
    }
    res.status(400).json({ message: 'Invalid entity type' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not delete entity' });
  }
};

exports.getEntitiesForAdmin = async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    const flights = await Flight.find().sort({ departureTime: 1 });
    res.json({ hotels, flights });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not fetch admin content' });
  }
};
