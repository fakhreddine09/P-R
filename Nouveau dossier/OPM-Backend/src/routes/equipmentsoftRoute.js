const express = require("express");
const router = express.Router();
const equipmentControllersoft = require('../controllers/equipmentsoftController');


router.post('/createEquipmentSoft', equipmentControllersoft.createEquipmentSoft);
router.post('/createImportinEquipmentSoft', equipmentControllersoft.createImportinEquipmentSoft);
router.put('/updateEquipmentSoft', equipmentControllersoft.updateEquipmentSoft);
router.post('/deleteEquipmentSoft', equipmentControllersoft.deleteEquipmentSoft);
router.get('/getListEquipmentByContractSoft/:_id', equipmentControllersoft.getListEquipmentByContractSoft);
// updateContract

module.exports = router; 