const express = require('express');
const router = express.Router();
const { getHotels, getFlights, getEntityById, getFeatured } = require('../controllers/entityController');

router.get('/', (req, res) => res.status(400).json({ message: 'Please use /hotels or /flights or /hotel/:id or /flight/:id' }));
router.get('/featured', getFeatured);
router.get('/hotels', getHotels);
router.get('/flights', getFlights);
router.get('/:type/:id', getEntityById);

module.exports = router;
