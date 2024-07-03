const mongoose = require('mongoose');
const Technicien =require('../models/technicienModel');
const File =require('../models/fileModel');

const VistePreventiveSchema = new mongoose.Schema({
  title: {
    type: String,
    // type: Date,
    required: true,
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending','In progress', 'Done'],
    // pending
    default: 'Pending'
  },
  technicien: { type: mongoose.Schema.Types.ObjectId, ref: 'Technicien' },
  siteID: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  rapportId: { type: mongoose.Schema.Types.ObjectId, ref:'Rapport' },
  contractID: { type: mongoose.Schema.Types.ObjectId, ref:'Contract' },
  // listOfFiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }]
});

const Vistepreventive = mongoose.model("Vistepreventive", VistePreventiveSchema);

module.exports = Vistepreventive;
