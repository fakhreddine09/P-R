const mongoose = require('mongoose');

const typesupportSchema = new mongoose.Schema({

    supportName: {
        type: String,
        required: true,
    },

    creationDate: {
        type: Date,
        default: Date.now
    }
});

const TypeSupport = mongoose.model('TypeSupport', typesupportSchema);
module.exports = TypeSupport;
// equipmentName version constructure