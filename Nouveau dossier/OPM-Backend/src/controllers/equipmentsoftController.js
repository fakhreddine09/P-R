const EquipmentSoft = require('../models/equipmentsoftModel');
const Equipmentsof = require('../models/equipmentsoftModel');
const Site = require('../models/siteModel');
const TypeSupport = require('../models/typeSupportModel');

//create contract
exports.createEquipmentSoft = async (req, res) => {
  try {
    const _id = req.body.siteId;
    const eqipemontSofy = Equipmentsof(req.body.eqipemontSofy);
    await eqipemontSofy.save();
    const eqipemontSoftId =eqipemontSofy._id.toString();

    const updateSite = await Site.findByIdAndUpdate(
      { _id },
      { $push: { listEquipmentSoft: eqipemontSoftId } },
      { new: true }
    );
    res.status(200).json({ err: false, message: "Successful operation !", rows: updateSite });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.updateEquipmentSoft= async (req, res) => {
  try {
    const { _id, equipmentName, version,constructure,TypeSupport,startDateSupport,endDateSupport} = req.body;
    const updateEquipmentSoft = await Equipmentsof.findByIdAndUpdate(
      { _id },
      {equipmentName, version,constructure,TypeSupport,startDateSupport,endDateSupport},
      { new: true }
    );
    if (!updateEquipmentSoft) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({err: false, message: "Successful operation !", rows: updateEquipmentSoft });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
// equipmentName version constructure
exports.deleteEquipmentSoft = async (req, res) => {
  try {
    const equipmentSoft = await Equipmentsof.findOneAndDelete({ _id: req.body._id });
    if (!equipmentSoft) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    const siteId =req.body.siteId ;

    await Site.findByIdAndUpdate(
      { _id: siteId }, // Assuming the contract document has a folderID field
      { $pull: { listEquipmentSoft: req.body._id} },
      { new: true }
    );
    res.status(200).json({ err: false, message: "Successful operation !", rows: equipmentSoft });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.createImportinEquipmentSoft = async (req, res) => {
  try {
    const _id = req.body._id;
    const listEquipe = req.body.equipmentsList
    let ListAddetEquipment = []
    for (let index = 0; index < listEquipe.length; index++) {
      let typeSupport = await TypeSupport.findOne({ supportName: listEquipe[index].TypeSupport });
      let val = true;
      if (listEquipe[index].valid == 'Active') {
        val = true
      } else {
        val = false
      }
      let equipmentData = EquipmentSoft({
        equipmentName: listEquipe[index].equipmentName,
        version: listEquipe[index].version,
        constructure: listEquipe[index].constructure,
        TypeSupport: typeSupport._id.toString(),
        startDateSupport: listEquipe[index].startDateSupport,
        endDateSupport: listEquipe[index].endDateSupport,
        valid: val
      })
      await equipmentData.save()
      ListAddetEquipment.push(equipmentData)
    }
    const updateSite = await Site.findByIdAndUpdate(
      { _id },
      { $push: { listEquipmentSoft: ListAddetEquipment } },
      { new: true }
    );
    res.status(200).json({ err: false, message: "Successful operation !", rows: updateSite });

  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.getListEquipmentByContractSoft = async (req, res) => {
  try {
    const equipmentList = await Site.findById(req.params._id).populate('listEquipmentSoft').select('listEquipmentSoft')
     res.status(200).json({ err: false, message: "Successful operation!", rows: equipmentList.listEquipmentSoft });
   } catch (error) {
     res.status(500).json({ err: true, message: error.message });
   }
};


