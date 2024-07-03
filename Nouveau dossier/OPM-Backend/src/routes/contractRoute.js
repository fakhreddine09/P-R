const express = require("express");
const router = express.Router();
const contractController = require('../controllers/contractController');
const upload = require('../middlewares/fileMiddleware');
// // contract routes 

router.post('/createContract', contractController.createContract);
router.post('/addResponableEquipeTechnique', contractController.addResponableEquipeTechnique);
router.post('/addEquipeTechnique', contractController.addEquipeTechnique);
router.post('/AddVissaVie', contractController.AddVissaVie);
router.post('/addUserForContract', contractController.addUserForContract);

router.post('/addListPlanificationVistePreventive', contractController.AddListPlanificationVistePreventive);
router.post('/addOnePlanificationVistePreventive', contractController.AddOnePlanificationVistePreventive);
router.post('/deleteVisitePrev', contractController.deleteVisitePrev);
router.post('/updateVisitePrev', contractController.updateVisitePrev);
router.get('/getListTemsAffected/:_id', contractController.getListTemsAffected);

// affectOledCustemer
router.post('/addlistFileContract', upload.array('files'), contractController.addFileToContract);
router.put('/updateContract', contractController.updateContract);
router.post('/deleteContract', contractController.deleteContract);
router.post('/deleteUserfromContract', contractController.deleteUserfromContract);
router.post('/deleteVisaAvisContract', contractController.deleteVisaAvisContract);
router.get('/getUniqueCompanies', contractController.getUniqueCompanies);
router.put('/updateCastomers', contractController.updateCastomers);
router.post('/deleteResponsableEquipeContract', contractController.deleteResponsableEquipeContract);
router.post('/deleteMemberEquipefromContract', contractController.deleteMemberEquipefromContract);
router.get('/getListEquipeContract/:_id', contractController.getListEquipeContract);
router.get('/getContractById/:_id', contractController.getContractById);
router.get('/getListEquipmentByContractHaredSoft/:_id', contractController.getListEquipmentByContractHaredSoft);

// 
// router.post('/addlistEquipment',upload.array('files'),  contractController.addListEquipment);
// router.post('/addMatriceEscalade',upload.array('files'),  contractController.addMatriceEscalade);
// router.post('/addlistFileContract',upload.array('files'),  contractController.addFileToContract);
// AddVissaVie
// router.post('/addInfoContract', upload.fields([{ name: 'matriceEscalade' }, { name: 'listEquipment' }]), contractController.addInfoContract);
// updateContract












































// router.post('/addinfo', contractController.addPlanification);
// router.get('/all', contractController.getAllContracts);
// router.get('/getOneContractBayId/:id', contractController.getContractById);
// router.post('/test', contractController.updateContract);
// router.post('/', contractController.test);
// router.delete('/', contractController.deleteContract);

module.exports = router;
