const mongoose = require('mongoose');

const inventaireSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site' },
  eqipemont: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' },

});
  
  const Inventaire = mongoose.model('Inventaire', inventaireSchema);
  module.exports = Inventaire;
  