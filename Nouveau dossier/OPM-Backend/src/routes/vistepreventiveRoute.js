const express = require("express");
const router = express.Router();
const vistepreventiveController = require('../controllers/vistepreventiveController');


router.get('/getlistvisiteprevForAdmin', vistepreventiveController.getAllVisite);
router.get('/getOneVisitePrevBayId/:_id', vistepreventiveController.getOneVis);

module.exports = router;