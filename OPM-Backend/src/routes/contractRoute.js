const express = require("express");
const router = express.Router();
const contractController = require('../controllers/contractController');

// contract routes
router.post('/createContract', contractController.createContract);
router.get('/all', contractController.getAllContracts);
router.get('/getOneContractBayId/:id', contractController.getContractById);
router.post('/test', contractController.updateContract);
router.post('/', contractController.test);
router.delete('/', contractController.deleteContract);

module.exports = router;
