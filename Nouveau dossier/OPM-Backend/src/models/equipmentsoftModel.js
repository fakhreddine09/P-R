const mongoose = require('mongoose');

const equipmentsoftSchema = new mongoose.Schema({
    equipmentName: {
        type: String,
        required: true,
    },
    version: {
        type: String,
        required: true
    },
    constructure: {
        type: String,
        required: true
    },
    startDateSupport: {
        type: String,
        required: true,
    },
    endDateSupport: {
        type: String,
        required: true,
    },
    valid: {
        type: Boolean,
        default: true
    },
    TypeSupport: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeSupport' },
});
const EquipmentSoft = mongoose.model('EquipmentSoft', equipmentsoftSchema);
module.exports = EquipmentSoft;
// equipmentName version constructure