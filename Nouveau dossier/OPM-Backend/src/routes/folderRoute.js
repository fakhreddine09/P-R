const express = require("express");
const router = express.Router();
const folderController = require('../controllers/folderController');
const upload = require('../middlewares/fileMiddleware');

// const upload = require('../middlewares/fileMiddleware');

router.get('/getAllFoldres', folderController.getAllFoldres);


;
router.get('/getListSiteBayFolder/:_id', folderController.getListSiteBayFolder);
router.get('/getListSiteByFolder/:_id', folderController.getListSiteByFolder);
router.get('/getContractsByFolderId/:_id', folderController.getContractsByFolderId);
router.get('/getFoldetByID/:_id', folderController.getFolderById);
router.put('/updateSite', folderController.updateSite);
router.post('/addSiteClient', folderController.addSiteForFolder);
router.post('/deleteSite', folderController.deleteSite);

router.post('/createFolder',upload.array('files'), folderController.createFolder);
router.put('/updateFolder', folderController.updateFolder);
router.post('/deleteFolder', folderController.deleteFolder);

// router.post('/addFile', upload.array('files'), folderController.addFile);
// router.post('/removeFile', folderController.removeFile);
// router.get('/all', folderController.getAllFolders);
// router.get('/countFilesByClientId/:id', folderController.countFilesByClientId);
// router.get('/getFilesByclientId/:id', folderController.getFilesByclientId);
// router.put('/', folderController.updateFolder);
// router.delete('/', folderController.deleteFolder);

module.exports = router; 