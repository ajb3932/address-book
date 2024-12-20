const Contact = require('../models/Contact');
const Household = require('../models/Household');

// Get all contacts
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate('household', 'householdName')
      .sort({ firstName: 1, surname: 1 });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get contacts by household
exports.getContactsByHousehold = async (req, res) => {
  try {
    const contacts = await Contact.find({ household: req.params.householdId })
      .sort({ firstName: 1, surname: 1 });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create new contact
exports.createContact = async (req, res) => {
  try {
    const { firstName, surname, birthday, phoneNumber, household } = req.body;

    // Create new contact
    const contact = new Contact({
      firstName,
      surname,
      birthday,
      phoneNumber,
      household
    });

    await contact.save();

    // Add contact to household
    if (household) {
      await Household.findByIdAndUpdate(
        household,
        { $push: { contacts: contact._id } }
      );
    }

    // Return populated contact
    const populatedContact = await Contact.findById(contact._id)
      .populate('household', 'householdName');
    
    res.json(populatedContact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update contact
exports.updateContact = async (req, res) => {
  try {
    const { firstName, surname, birthday, phoneNumber, household } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ msg: 'Contact not found' });
    }

    // If household changed, update household references
    if (household && household !== contact.household?.toString()) {
      // Remove contact from old household's contacts array
      if (contact.household) {
        await Household.findByIdAndUpdate(
          contact.household,
          { $pull: { contacts: contact._id } }
        );
      }

      // Add contact to new household's contacts array
      await Household.findByIdAndUpdate(
        household,
        { $push: { contacts: contact._id } }
      );
    }

    // Update contact
    contact.firstName = firstName;
    contact.surname = surname;
    contact.birthday = birthday;
    contact.phoneNumber = phoneNumber;
    contact.household = household;

    await contact.save();

    const updatedContact = await Contact.findById(contact._id)
      .populate('household', 'householdName');
    
    res.json(updatedContact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Search contacts
exports.searchContacts = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    if (!searchTerm) {
      return res.status(400).json({ msg: 'Search term is required' });
    }

    const contacts = await Contact.find({
      $or: [
        { firstName: { $regex: searchTerm, $options: 'i' } },
        { surname: { $regex: searchTerm, $options: 'i' } },
        { phoneNumber: { $regex: searchTerm, $options: 'i' } }
      ]
    }).populate('household', 'householdName');

    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get single contact
exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('household', 'householdName');
    
    if (!contact) {
      return res.status(404).json({ msg: 'Contact not found' });
    }

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Contact not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await contact.deleteOne();
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Error deleting contact', error: error.message });
  }
};