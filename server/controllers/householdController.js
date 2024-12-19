const Household = require('../models/Household');
const Contact = require('../models/Contact');

// Get all households
exports.getHouseholds = async (req, res) => {
  try {
    const households = await Household.find()
      .populate('contacts')
      .sort({ householdName: 1 });
    res.json(households);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get single household
exports.getHousehold = async (req, res) => {
  try {
    const household = await Household.findById(req.params.id).populate('contacts');
    if (!household) {
      return res.status(404).json({ msg: 'Household not found' });
    }
    res.json(household);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Household not found' });
    }
    res.status(500).send('Server error');
  }
};

// Create household
exports.createHousehold = async (req, res) => {
  try {
    const { householdName, address } = req.body;

    const household = new Household({
      householdName,
      address
    });

    await household.save();
    res.json(household);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update household
exports.updateHousehold = async (req, res) => {
  try {
    const { householdName, address } = req.body;
    const household = await Household.findById(req.params.id);

    if (!household) {
      return res.status(404).json({ msg: 'Household not found' });
    }

    household.householdName = householdName;
    household.address = address;

    await household.save();
    res.json(household);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Household not found' });
    }
    res.status(500).send('Server error');
  }
};

// Delete household
exports.deleteHousehold = async (req, res) => {
  try {
    const household = await Household.findById(req.params.id);

    if (!household) {
      return res.status(404).json({ msg: 'Household not found' });
    }

    // Delete all contacts associated with this household
    await Contact.deleteMany({ household: req.params.id });

    // Delete the household
    await household.remove();

    res.json({ msg: 'Household deleted' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Household not found' });
    }
    res.status(500).send('Server error');
  }
};