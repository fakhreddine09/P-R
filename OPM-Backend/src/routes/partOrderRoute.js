const express = require('express');
const router = express.Router();
const partOrderController = require('../controllers/partOrderController');
const upload = require('../middlewares/fileMiddleware');


router.post('/createPartOrder', partOrderController.createPartOrder);
router.get('/all', partOrderController.getAllPartOrders);
router.get('/getPartOrderById/:id', partOrderController.getPartOrderById);
router.get('/getPartOrderByClientId/:id', partOrderController.getPartOrderByClientId);
router.post('/addFile', upload.single('file'), partOrderController.addFile);
router.get('/removeFile', partOrderController.removeFile);
router.get('/getClientsHavingPartOrders', partOrderController.getClientsHavingPartOrders);
router.post('/updatePartOrder', partOrderController.updatePartOrder);
router.delete('/deletePartOrder/:id', partOrderController.deletePartOrder);
router.get('/getPartOrderByStatus/:id/:status', partOrderController.getPartOrderByStatus);


// 
module.exports = router;
