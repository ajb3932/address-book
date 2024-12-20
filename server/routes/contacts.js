const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const contactController = require('../controllers/contactController');

// Protect all routes
router.use(auth);

// Get all contacts
router.get('/', contactController.getContacts);

// Search contacts (must come before /:id)
router.get('/search', contactController.searchContacts);

// Get contacts by household
router.get('/household/:householdId', contactController.getContactsByHousehold);

// Get single contact
router.get('/:id', contactController.getContact);

// Create contact
router.post('/', contactController.createContact);

// Update contact
router.put('/:id', contactController.updateContact);

// Delete contact
router.delete('/:id', contactController.deleteContact);

module.exports = router;