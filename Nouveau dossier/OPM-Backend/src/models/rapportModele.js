const mongoose = require('mongoose');

const rapportSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
    startDate: {
      type: Date
    },
    endDate: {
        type: Date
      },
      technicienId: { type: mongoose.Schema.Types.ObjectId, ref:'Technicien' },
    listOfTasks: [{ type: mongoose.Schema.Types.ObjectId, ref:'Tasks' }],
  });

const Rapport = mongoose.model("Rapport", rapportSchema);

module.exports = Rapport;