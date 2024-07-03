const mongoose = require('mongoose');
const User = require('./userModel')
const technicienSchema = new mongoose.Schema({
    firstName: { 
      type: String,
      required: true 
    },    
    lastName: { 
      type: String, 
      required: true 
    },
    permisConduire: { 
      type: Boolean, 
      required: true ,
      default :false
    },
    passeport: { 
      type: Boolean, 
      required: true ,
      default :false
    },
    ExpiredAt: { 
      // type: Date, 
      type: String, 
      // required: true ,
    },
     
  });
  const Technicien = User.discriminator('Technicien', technicienSchema);
  module.exports = Technicien;
