const express = require("express");
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const upload = require('../middlewares/fileMiddlewareAny');

router.post('/createTicket',upload.array('files'),  ticketController.createTicket);
router.get('/getAllTicketByClientIdAndContract/:clientId/:contractId', ticketController.getAllTicketByClientIdAndContract);
router.put('/updateTicket',ticketController.updateTicket);


// ------------------------------------------------------------



// router.post('/test',  ticketController.testSLA);
router.post('/uploadFilesToticket',upload.array('files'),  ticketController.uploadFilesToticket);
router.post('/addRapportTicket',  ticketController.addRapportTicket);
router.post('/addTasksListRapportTicket',upload.array('files'),  ticketController.addTasksListRapportTicket);
router.patch('/AffecteTechnicienToTicket',ticketController.affecteTechnicienToTicket);
router.get('/getTicketByStatusAndClient/:_id/:status', ticketController.getTicketByStatus);
router.get('/getAllTicketByClientId/:_id', ticketController.getAllTicketByClientId);
module.exports = router;    