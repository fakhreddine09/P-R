const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true

    },
    fileName: {
      type: String,
      required: true
    },
    uploadDate:{
      type: Date,
      default: Date.now
    },
    path: {
      type: String,
      required: true
    }
  });

  
const File = mongoose.model("File", fileSchema);

module.exports = File;