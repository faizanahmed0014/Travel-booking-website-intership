const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const Flight = require('../models/Flight');

exports.createBooking = async (req, res) => {
  try {
    const { entityId, entityType, bookedDate, guestsCount, roomsCount } = req.body;
    const guests = Number(guestsCount);
    const rooms = Number(roomsCount);
    if (!entityId || !entityType || !bookedDate || !guests || (entityType === 'Hotel' && (!rooms || rooms < 1))) {
      return res.status(400).json({ message: 'All booking details are required' });
    }

    const bookingDate = new Date(bookedDate);
    if (bookingDate < new Date()) {
      return res.status(400).json({ message: 'Booked date must be in the future' });
    }

    let entity;
    let totalPrice;
    if (entityType === 'Hotel') {
      entity = await Hotel.findById(entityId);
      if (!entity) return res.status(404).json({ message: 'Hotel not found' });
      if (entity.availableRooms < rooms) return res.status(400).json({ message: 'Not enough rooms available' });
      totalPrice = entity.pricePerNight * rooms;
      entity.availableRooms = Math.max(0, entity.availableRooms - rooms);
      entity.status = entity.availableRooms < 1 ? 'Booked' : 'Available';
      await entity.save();
    } else if (entityType === 'Flight') {
      entity = await Flight.findById(entityId);
      if (!entity) return res.status(404).json({ message: 'Flight not found' });
      if (entity.status === 'Cancelled') return res.status(400).json({ message: 'Cannot book cancelled flight' });
      if (new Date(entity.departureTime) <= new Date()) return res.status(400).json({ message: 'Cannot book a flight that has already departed' });
      if (entity.availableSeats < guests) return res.status(400).json({ message: 'Not enough seats available' });
      totalPrice = entity.price * guests;
      entity.availableSeats = Math.max(0, entity.availableSeats - guests);
      await entity.save();
    } else {
      return res.status(400).json({ message: 'Invalid entity type' });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      entityId,
      entityType,
      bookedDate: bookingDate,
      guestsCount: guests,
      roomsCount: entityType === 'Hotel' ? rooms : 1,
      totalPrice,
      status: 'confirmed',
    });

    res.status(201).json({ booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not create booking' });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const enriched = await Promise.all(bookings.map(async (item) => {
      const normalizedType = item.entityType?.toLowerCase();
      const entity = normalizedType === 'hotel'
        ? await Hotel.findById(item.entityId)
        : normalizedType === 'flight'
          ? await Flight.findById(item.entityId)
          : null;
      return { ...item.toObject(), entity };
    }));
    res.json(enriched);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not fetch bookings' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({ _id: id, userId: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'cancelled') return res.status(400).json({ message: 'Booking already cancelled' });

    if (booking.entityType === 'Hotel') {
      const hotel = await Hotel.findById(booking.entityId);
      if (hotel) {
        hotel.availableRooms = Math.min(hotel.totalRooms, hotel.availableRooms + booking.roomsCount);
        hotel.status = hotel.availableRooms < 1 ? 'Booked' : 'Available';
        await hotel.save();
      }
    }

    if (booking.entityType === 'Flight') {
      const flight = await Flight.findById(booking.entityId);
      if (flight) {
        flight.availableSeats = Math.min(flight.totalSeats, flight.availableSeats + booking.guestsCount);
        await flight.save();
      }
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not cancel booking' });
  }
};
