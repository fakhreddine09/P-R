const Visteprentive = require('../models/vistepreventiveModel');
const Rapport = require('../models/rapportModele');
const Technicien = require('../models/technicienModel');
const Site = require('../models/siteModel');

exports.getAllVisite = async (req, res) => {
  try {
    const listVisteprev = await Visteprentive.find()
      .populate('technicien')
      .populate('siteID')
      .populate('rapportId')
      .populate('contractID');
      // console.log(listVisteprev);
    let listEvent = listVisteprev.map(element => ({
      id: element._id.toString(),
      title: element.title+' '+element.siteID.nomSite+' '+element.siteID.adress,
      start: element.startDate,
      end: element.endDate,
      status:element.status,
      technician: `${element.technicien.firstName} ${element.technicien.lastName}`,
      siteName: element.siteID.nomSite,
      address: element.siteID.adress, // Assuming 'adress' was meant to be 'address'
      rapportId: element.rapportId || '', // Using default value if rapportId is undefined or null
      contractNature:element.contractID.nature,
      contractType:element.contractID.type,
      contractStartDate:element.contractID.startDate,
      contractEndDate:element.contractID.endDate,
      contractSLA:element.contractID.sla,
    }));

    res.status(200).json({ err: false, message: "Successful operation!", rows: listEvent });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};


exports.getOneVis = async (req, res) => {
  try {
    const Visteprev = await Visteprentive.findById(req.params._id)
      .populate('technicien')
      .populate('siteID')
      .populate('rapportId')
      .populate({
        path: 'contractID',
        populate: [
          {
            path: 'responsableEquipeTechnique.responsable',
            model: 'Technicien'
          },
          {
            path: 'equipeTechnique.tech',
            model: 'Technicien'
          }]
      });
      // const userId=Visteprev.technicien._id
      // let newobj = {}
      // Visteprev.contractID.equipeTechnique.forEach(element => {
      //   if(element.tech._id.toString() == Visteprev.technicien._id.toString()){
      //     newobj =element
      //   }
      // });
      // Visteprev.niveauEscalade =newobj.niveauEscalade
      
    res.status(200).json({ err: false, message: "Successful operation!", rows: Visteprev });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};