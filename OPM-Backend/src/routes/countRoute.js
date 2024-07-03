const express = require("express");
const router = express.Router();
const countController = require('../controllers/countController');

router.get('/countUnhandledWorkOrderByClientId/:clientId/:status?', countController.countUnhandledWorkOrderByClientId);
router.get('/countWorkOrdersBayClintIdStatus/:clientId/:status', countController.countWorkOrdersBayClintIdStatus);



router.get('/countUsersByAuthority/:authority', countController.countUsersByAuthority);//done
router.get('/countContracts/', countController.countContracts);//done
router.get('/countEmployees/', countController.countEmployees);
router.get('/countWorkOrderByEmployeeId/:employeeId/:status?', countController.countWorkOrderByEmployeeId);
router.get('/countTicketsByEmployeeId/:employeeId?', countController.countTicketsByEmployeeId);
router.get('/countUnhandledWorkOrder', countController.countUnhandledWorkOrder);
router.get('/countAllTiket', countController.countAllTiket);
router.get('/countWorkOrders', countController.countWorkOrders);
router.get('/countWorkOrderByStatus/:status', countController.countWorkOrderByStatus);
router.get('/countUnhandledWorkOrderBayClient/:ClientId', countController.countUnhandledWorkOrderBayClient);
router.get('/countAllWorekOrderBayClient/:id', countController.countAllWorekOrderBayClient);
// 
 
router.get('/countPartOrderByStatus/:status', countController.countPartOrderByStatus);
router.get('/countAllPartOrder', countController.countAllPartOrder);
router.get('/countPartOrdersByEmployeeCommercialeId/:employeeId', countController.countPartOrdersByEmployeeCommercialeId);
router.get('/countPartrdersBayClintId/:clientId/:status', countController.countPartrdersBayClintIdStatus);


module.exports = router;