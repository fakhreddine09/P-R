const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    terms: {
        type: String,
        required: true
      },
    type: {
      type: String,
    enum: ['INFO-GERANCE', 'SUPPORT AND MAINTENANCE'],
    required: true
    },
    startDate:{
      type: Date,
      default: Date.now
    },
    endDate:{
        type: Date,
        required: true
      },
    sla: {
      type: String,
      required: true
    },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref:'Employee' },
  });

const Contract = mongoose.model("Contract", contractSchema);

module.exports = Contract;