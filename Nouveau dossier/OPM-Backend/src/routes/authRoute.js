const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const upload = require('../middlewares/fileMiddleware');

router.post('/register',upload.array('files'), authController.register);
router.post('/updateEtatUsers', authController.updateEtatUsers);
router.post('/login', authController.login);
router.delete('/logout', authController.logout);
// router.post('/email', authController.sendEmail);

module.exports = router;
