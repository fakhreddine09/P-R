const Equipment = require('../models/equipmentModel');
const Site = require('../models/siteModel');
const TypeSupport = require('../models/typeSupportModel');

exports.createEquipment = async (req, res) => {
  try {
    const _id = req.body.siteId;
    const eqipemont = Equipment(req.body.eqipemont);
    await eqipemont.save();
    const eqipemontId = eqipemont._id.toString();
    const updateSite = await Site.findByIdAndUpdate(
      { _id },
      { $push: { listEquipment: eqipemontId } },
      { new: true }
    );
    res.status(200).json({ err: false, message: "Successful operation !", rows: updateSite });

  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.updateEquipment = async (req, res) => {
  try {
    const { _id, SN, nomPice, TypeSupport, startDateSupport, endDateSupport } = req.body;
    const updateEquipment = await Equipment.findByIdAndUpdate(
      { _id },
      { SN, nomPice, TypeSupport, startDateSupport, endDateSupport },
      { new: true }
    );
    if (!updateEquipment) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: updateEquipment });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.deleteEquipment = async (req, res) => {
  try {
    console.log(req.body._id);
    const equipment = await Equipment.findOneAndDelete({ _id: req.body._id });
    if (!equipment) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    const siteId = req.body.siteId;
    await Site.findByIdAndUpdate(
      { _id: siteId }, // Assuming the contract document has a folderID field
      { $pull: { listEquipment: req.body._id } },
      { new: true }
    );
    res.status(200).json({ err: false, message: "Successful operation !", rows: equipment });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.createImportinEquipmentHared = async (req, res) => {
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
      let equipmentData = Equipment({
        nomPice: listEquipe[index].nomPice,
        SN: listEquipe[index].SN,
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
      { $push: { listEquipment: ListAddetEquipment } },
      { new: true }
    );
    res.status(200).json({ err: false, message: "Successful operation !", rows: updateSite });

  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

exports.getListEquipmentByContractHared = async (req, res) => {
  try {
   const equipmentList = await Site.findById(req.params._id).populate('listEquipment').select('listEquipment')
    res.status(200).json({ err: false, message: "Successful operation!", rows: equipmentList.listEquipment });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};