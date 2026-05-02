const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { createBooking, getUserBookings, cancelBooking } = require('../controllers/bookingController');

router.post('/', authenticate, createBooking);
router.get('/user', authenticate, getUserBookings);
router.delete('/:id', authenticate, cancelBooking);

module.exports = router;
