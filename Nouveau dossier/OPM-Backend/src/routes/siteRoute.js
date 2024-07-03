const express = require("express");
const router = express.Router();
const siteController = require('../controllers/siteController');


router.get('/getListSiteByContract/:_id', siteController.getListSiteByContract);
// 

module.exports = router; 