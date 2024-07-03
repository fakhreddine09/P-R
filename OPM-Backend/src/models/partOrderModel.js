const mongoose = require('mongoose');

const partOrderSchema = new mongoose.Schema({
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
    reasonReff: {
      type: String,
     
    },
    status: {
      type: String,
      enum: ['In progress', 'Valid', 'Accepted','Refused', 'Done', 'Expired'], 
      default: 'In progress'
    },
    // in progress douba tesna3  
    // valid confirmed from the employee(commercial) that the parts are availble 
    //accepted by the client
    
    //refused by the client
    // done means delivered or installed
    // expired momken nesta3mloha 
    signedBy: {
      type: String
    },
    clientId: { type: mongoose.Schema.Types.ObjectId, required: true, ref:'Client' },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref:'Employee' },
    devise: [{ type: mongoose.Schema.Types.ObjectId, ref:'File' }],
    bon_commande: [{ type: mongoose.Schema.Types.ObjectId, ref:'File' }],
  });

const PartOrder = mongoose.model("PartOrder", partOrderSchema);

module.exports = PartOrder;