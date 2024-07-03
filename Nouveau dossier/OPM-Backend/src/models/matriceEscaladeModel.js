const mongoose = require('mongoose');

const matriceEscaladeSchema = new mongoose.Schema({
    level1: {
      type: Date
    },
    level2: {
        type: Date
      },
      level: {
        type: Date
      },
    technique: { type: mongoose.Schema.Types.ObjectId, ref:'Technicien' },
    listOfTasks: [{ type: mongoose.Schema.Types.ObjectId, ref:'Tasks' }],
    listOfFiles: [{ type: mongoose.Schema.Types.ObjectId, ref:'File' }]
  });

const MatriceEscalade = mongoose.model("Rapport", matriceEscaladeSchema);

module.exports = MatriceEscalade;