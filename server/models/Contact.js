const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  birthday: {
    type: String,
    required: true
  },
  phoneNumber: String,
  household: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household'
  }
});

module.exports = mongoose.model('Contact', contactSchema);