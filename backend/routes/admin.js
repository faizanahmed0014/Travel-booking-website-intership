const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const authorizeAdmin = require('../middleware/admin');
const { createEntity, updateEntity, deleteEntity, getEntitiesForAdmin } = require('../controllers/adminController');
const { getBookingsForAdmin } = require('../controllers/bookingController');

router.use(authenticate, authorizeAdmin);
router.get('/entities', getEntitiesForAdmin);
router.get('/bookings', getBookingsForAdmin);
router.post('/entities', createEntity);
router.put('/entities/:type/:id', updateEntity);
router.delete('/entities/:type/:id', deleteEntity);

module.exports = router;
