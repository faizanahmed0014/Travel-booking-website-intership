const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const authorizeAdmin = require('../middleware/admin');
const { createEntity, updateEntity, deleteEntity, getEntitiesForAdmin } = require('../controllers/adminController');

router.use(authenticate, authorizeAdmin);
router.get('/entities', getEntitiesForAdmin);
router.post('/entities', createEntity);
router.put('/entities/:type/:id', updateEntity);
router.delete('/entities/:type/:id', deleteEntity);

module.exports = router;
