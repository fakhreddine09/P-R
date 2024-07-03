const express = require("express");
const router = express.Router();
const clientController = require('../controllers/clientController');

// user routes
router.get('/getListContractByClient/:_id', clientController.getListContractByClient);
router.get('/getListClient', clientController.getAllClients);
router.get('/getListClientOledNotAffected/:companyName', clientController.getListClientOledNotAffected);
router.get('/getListClientDejaAffected/:_id', clientController.getListClientDejaAffected);
router.put('/changeStatCompClient', clientController.updateStatClient);
router.post('/affectOledCustemer', clientController.affectOledCustemer);
// 
// router.get('/:username', userController.getUserByUsername);
// router.put('/:id', userController.updateStatClient);
// router.delete('/:username', userController.deleteUser);

module.exports = router;