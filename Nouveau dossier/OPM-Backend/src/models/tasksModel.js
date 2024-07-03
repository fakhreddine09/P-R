const mongoose = require('mongoose');

const tasksSchema = new mongoose.Schema({
  description: {
      type: String,
      required: true
    },
    listOfFiles: [{ type: mongoose.Schema.Types.ObjectId, ref:'File' }]
  });
  
  const Tasks = mongoose.model('Tasks', tasksSchema);
  module.exports = Tasks;