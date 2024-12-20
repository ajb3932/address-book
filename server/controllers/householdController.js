const Household = require('../models/Household');
const Contact = require('../models/Contact');

// Get all households
exports.getHouseholds = async (req, res) => {
    try {
      const households = await Household.find()
        .populate({
          path: 'contacts',
          select: 'firstName surname birthday phoneNumber'
        });
      res.json(households);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching households', error: error.message });
    }
  };

// Get single household
exports.getHousehold = async (req, res) => {
    try {
      const household = await Household.findById(req.params.id)
        .populate({
          path: 'contacts',
          select: 'firstName surname birthday phoneNumber'
        });
      
      if (!household) {
        return res.status(404).json({ message: 'Household not found' });
      }
      res.json(household);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching household', error: error.message });
    }
  };

// Create household
exports.createHousehold = async (req, res) => {
    try {
      const household = new Household(req.body);
      await household.save();
      const populatedHousehold = await Household.findById(household._id)
        .populate({
          path: 'contacts',
          select: 'firstName surname birthday phoneNumber'
        });
      res.status(201).json(populatedHousehold);
    } catch (error) {
      res.status(500).json({ message: 'Error creating household', error: error.message });
    }
  };

// Update household
exports.updateHousehold = async (req, res) => {
    try {
      const household = await Household.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate({
        path: 'contacts',
        select: 'firstName surname birthday phoneNumber'
      });
      
      if (!household) {
        return res.status(404).json({ message: 'Household not found' });
      }
      res.json(household);
    } catch (error) {
      res.status(500).json({ message: 'Error updating household', error: error.message });
    }
  };

// Delete household
exports.deleteHousehold = async (req, res) => {
  try {
    const household = await Household.findById(req.params.id);
    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    // Update all contacts that belong to this household
    await Contact.updateMany(
      { household: req.params.id },
      { $unset: { household: 1 } }
    );

    // Delete the household
    await household.deleteOne();

    res.json({ message: 'Household deleted successfully' });
  } catch (error) {
    console.error('Error deleting household:', error);
    res.status(500).json({ message: 'Error deleting household', error: error.message });
  }
};