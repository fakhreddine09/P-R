const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    creationDate:{
      type: Date,
      default: Date.now
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    status: {
        type: String,
        enum: ['In progress', 'Done', 'Expired'],
        default: 'In progress'
    },
    adminId: { type: mongoose.Schema.Types.ObjectId,  ref:'Admin' },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref:'Employee' },
    listOfFiles: [{ type: mongoose.Schema.Types.ObjectId, ref:'File' }]
  });

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;