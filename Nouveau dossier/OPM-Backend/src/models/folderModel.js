const mongoose = require('mongoose');
const Contract = require('./contractModel');
const Site = require('./siteModel');

const folderSchema = new mongoose.Schema({
    creationDate:{
      type: Date,
      default: Date.now
    },
    name: {
      type: String,
      required: true,
      unique: true

    },
    colorfoldr: {
      type: String,
      required: true
    },
    logo: {
      type: String,
    },
    listSite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Site' }],
    contractId: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Contract' }],
  });

const Folder = mongoose.model("Folder", folderSchema);

module.exports = Folder; 