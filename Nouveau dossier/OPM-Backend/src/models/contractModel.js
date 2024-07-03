const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['SUPPORT AND MAINTENANCE SOFT', 'SUPPORT AND MAINTENANCE HARD','INFOGERANCE','SUPPORT AND MAINTENANCE SOFT AND HARD'],
    required: true
  },
  nature: {
    type: String,
    enum: ['DEVELOPMENT', 'SYSTEME', 'RESEAUX', 'CYBER-SECURITY'],
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  sla: {
    type: String,
    required: true
  },
  nbrJourChesClient: {
    type: String,
  },
  jourInfogerance: {
    type: String,
  },
  valid: {
    type: Boolean,
    default: true
  },
  responsableEquipeTechnique: {
    responsable: { type: mongoose.Schema.Types.ObjectId, ref: 'Technicien' },
    niveauEscalade: { type: String , default: 'l3'  }
  },
  equipeTechnique: [
    {
      tech: { type: mongoose.Schema.Types.ObjectId, ref: 'Technicien' },
      niveauEscalade: { type: String }
    }
  ],
  visAvis: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }, // Correction ici
  Vistepreventive: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vistepreventive' }], // Correction ici
  listOfFiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
  associatedCustomerList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }]
});
const Contract = mongoose.model("Contract", contractSchema);
module.exports = Contract;
