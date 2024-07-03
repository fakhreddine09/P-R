const express = require("express");
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');


router.post('/createEquipment', equipmentController.createEquipment);
router.post('/createImportinEquipmentHared', equipmentController.createImportinEquipmentHared);
router.put('/updateEquipment', equipmentController.updateEquipment);
router.post('/deleteEquipment', equipmentController.deleteEquipment);
router.get('/getListEquipmentByContractHared/:_id', equipmentController.getListEquipmentByContractHared);
// 

module.exports = router; 