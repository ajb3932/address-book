const mongoose = require('mongoose');

const householdSchema = new mongoose.Schema({
  householdName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  contacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
  }]
});

module.exports = mongoose.model('Household', householdSchema);