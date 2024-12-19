const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getContacts,
  getContact,  // Add this import
  getContactsByHousehold,
  createContact,
  updateContact,
  deleteContact,
  searchContacts
} = require('../controllers/contactController');

// Protect all routes
router.use(auth);

// Get all contacts
router.get('/', getContacts);

// Get single contact (add this route before any other routes with parameters)
router.get('/:id', getContact);

// Search contacts
router.get('/search', searchContacts);

// Get contacts by household
router.get('/household/:householdId', getContactsByHousehold);

// Create contact
router.post('/', createContact);

// Update contact
router.put('/:id', updateContact);

// Delete contact
router.delete('/:id', deleteContact);

module.exports = router;