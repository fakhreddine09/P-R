const express = require("express");
const router = express.Router();
const typesupportControllersoft = require('../controllers/typesupportController');


router.get('/getAllTypeSupport', typesupportControllersoft.getAllTypeSupport);
router.post('/createTypeSupport', typesupportControllersoft.createTypeSupport);
router.put('/updateTypeSupport', typesupportControllersoft.updateTypeSupport);
router.post('/deleteTypeSupport', typesupportControllersoft.deleteTypeSupport);
// getAllTypeSupport

module.exports = router; 