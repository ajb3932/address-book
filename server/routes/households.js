const express = require('express');
const router = express.Router();
const householdController = require('../controllers/householdController');
const auth = require('../middleware/auth');

// Protect all routes
router.use(auth);

// Get all households (with populated contacts)
router.get('/', householdController.getHouseholds);

// Get single household
router.get('/:id', householdController.getHousehold);

// Create household
router.post('/', householdController.createHousehold);

// Update household
router.put('/:id', householdController.updateHousehold);

// Delete household
router.delete('/:id', householdController.deleteHousehold);

module.exports = router;