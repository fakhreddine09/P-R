const express = require("express");
const router = express.Router();
const technicianController = require('../controllers/technicianController');

// user routes
router.get('/getlisttechncian', technicianController.getAllEmployees);
router.get('/getAllEmployeesByValid/:valid', technicianController.getAllEmployeesByValid);
router.put('/updateStatTech', technicianController.updateStatTech);

// router.put('/changeStatCompClient', clientController.updateStatClient);

// router.get('/:username', userController.getUserByUsername);
// router.put('/:id', userController.updateStatClient);
// router.delete('/:username', userController.deleteUser);

module.exports = router;