const mongoose = require('mongoose');
const User = require('./userModel')

const clientSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  tel: {
    type: String,
    required: true
  },
  
  // adress
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },

});
const Client = User.discriminator('Client', clientSchema);
module.exports = Client;