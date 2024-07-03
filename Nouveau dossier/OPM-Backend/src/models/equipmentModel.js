const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  SN: {
    type: String,
    required: true,
  },
  nomPice: {
    type: String,
    required: true
  },
  startDateSupport: {
    type: String, 
    required: true,
  },
  endDateSupport: {
    type: String,
    required: true,
  },
  valid: {
    type: Boolean,
    default: true
},
  TypeSupport: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeSupport' },

});

const Equipment = mongoose.model('Equipment', equipmentSchema);
module.exports = Equipment;
