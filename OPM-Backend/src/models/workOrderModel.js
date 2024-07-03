const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema({
    creationDate:{
      type: Date,
      default: Date.now
    },
    finishDate:{
      type: Date
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    partName: {
      type: String
    },
    partNum: {
      type: String
    },
    serialNum: {
      type: String
    },
    status: {
      type: String,
      enum: ['In progress', 'Done','Valid' , 'Expired'],
      default: 'In progress'
    },
    read: {
      type: Boolean,
      default: false
    },
    signedBy: {
      type: String
    },
    isFollowUp: {
      type: Boolean,
      default: 'false'
    },
    clientId: { type: mongoose.Schema.Types.ObjectId, required: true, ref:'Client' },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref:'Employee' },
    listOfFiles: [{ type: mongoose.Schema.Types.ObjectId, ref:'File' }],
    ticketId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
    followUpList: [{ type: mongoose.Schema.Types.ObjectId, ref:'FollowUp', default:null }],
  });

const WorkOrder = mongoose.model("WorkOrder", workOrderSchema);

module.exports = WorkOrder;