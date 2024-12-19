const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getHouseholds,
  getHousehold,
  createHousehold,
  updateHousehold,
  deleteHousehold
} = require('../controllers/householdController');

// Protect all routes
router.use(auth);

// Get all households
router.get('/', getHouseholds);

// Get single household
router.get('/:id', getHousehold);

// Create household
router.post('/', createHousehold);

// Update household
router.put('/:id', updateHousehold);

// Delete household
router.delete('/:id', deleteHousehold);

module.exports = router;