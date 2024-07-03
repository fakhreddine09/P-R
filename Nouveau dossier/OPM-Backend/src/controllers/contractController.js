const Contract = require('../models/contractModel');
// const File = require('../models/fileModel');
const Visteprentive = require('../models/vistepreventiveModel');
const Site = require('../models/siteModel');
const { Types } = require('mongoose');
const File = require('../models/fileModel') 
const Folder = require('../models/folderModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const Client = require('../models/clientModel');
const mongoose = require('mongoose');
//create contract


exports.createContract = async (req, res) => {
  try {
    const _id = req.body.folderID;
    const contract = Contract(req.body);
    await contract.save();
    const contractId =contract._id.toString();
    const updatedFolder = await Folder.findByIdAndUpdate(
      { _id },
      { $push: { contractId: contractId } },
      { new: true }
    );
    res.status(200).json({ err: false, message: "Successful operation !", rows: updatedFolder });

  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

exports.updateContract = async (req, res) => {
  try {
    const { _id, type, nature, startDate,endDate,sla } = req.body;
    const updatedContract = await Contract.findByIdAndUpdate(
      { _id },
      {type, nature, startDate,endDate,sla},
      { new: true }
    );
    if (!updatedContract) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({err: false, message: "Successful operation !", rows: updatedContract });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

exports.getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params._id);
    res.status(200).json({ err: false, message: "Successful operation !", rows: contract });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.getListTemsAffected = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params._id)
      .populate('responsableEquipeTechnique.responsable') // Pour le responsable de l'équipe technique
      .populate('equipeTechnique.tech') // Pour les membres de l'équipe technique
      .exec();
      let ListId=[]

      if(contract.responsableEquipeTechnique.responsable){

        ListId.push(contract.responsableEquipeTechnique.responsable._id)
      }
      if(contract.equipeTechnique.length != 0)
{      let listEqipe = contract.equipeTechnique
      listEqipe.forEach(element => {
      ListId.push(element.tech._id)
      });}
      res.status(200).json({ err: false, message: "Successful operation !", rows: ListId });
    } catch (error) {
      res.status(500).json({ err: true, message: error.message, rows: []  });
};
}


exports.getListEquipmentByContractHaredSoft = async (req, res) => {
  try {
   const equipmentList = await Site.findById(req.params._id).populate('listEquipment').populate('listEquipmentSoft')
    res.status(200).json({ err: false, message: "Successful operation!", rows: equipmentList });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};



exports.getContrac00tById= async (req, res) => {
  try {
   const equipmentList = await Site.findById(req.params._id).populate('listEquipment').select('listEquipment')
    res.status(200).json({ err: false, message: "Successful operation!", rows: equipmentList.listEquipment });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

exports.deleteVisitePrev = async (req, res) => {
  try {
    const visitePrev = await Visteprentive.findByIdAndDelete(req.body._id);
    if (!visitePrev) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }

    res.status(200).json({err: false, message: "Successful operation !", rows: visitePrev});
  } catch (err) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.updateVisitePrev = async (req, res) => {
  try {
    const { _id,title,date,status,siteID,technicien } = req.body;
    const updateVisite = await Visteprentive.findByIdAndUpdate(
      { _id },
      { title,date,status,siteID,technicien},
      { new: true }
    );
    if (!updateVisite) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).json({err: false, message: "Successful operation !", rows: updateVisite });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
};
exports.getListEquipeContract = async (req, res) => {
  try {
    const contractId = req.params._id
    const contract = await Contract.findOne({ _id: contractId })
    .populate('equipeTechnique.tech')  // Populate pour récupérer les techniciens de l'équipe technique
    .populate('responsableEquipeTechnique.responsable');
    const equipeTechnique =contract.equipeTechnique
    const responsableEquipeTechnique = contract.responsableEquipeTechnique
    let newObj ={...equipeTechnique,...responsableEquipeTechnique}
    let listEquipe=[];
    // console.log(equipeTechnique[0]);
    if(equipeTechnique.length>0){
      let obj={}
      equipeTechnique.forEach(element => {
        obj=  {_id:element.tech._id.toString(),firstName:element.tech.firstName,lastName:element.tech.lastName,niveauEscalade:element.niveauEscalade}
        listEquipe.push(obj)
      });
    }else{
      const obj3={_id:equipeTechnique.tech._id.toString(),firstName:equipeTechnique.tech.firstName,lastName:equipeTechnique.tech.lastName,niveauEscalade:equipeTechnique.niveauEscalade}
      listEquipe.push(obj3)
    }
    const obj2 = {_id:responsableEquipeTechnique.responsable._id.toString(),firstName:responsableEquipeTechnique.responsable.firstName,lastName:responsableEquipeTechnique.responsable.lastName,niveauEscalade:responsableEquipeTechnique.niveauEscalade}
    listEquipe.push(obj2)
    if (!contract) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: listEquipe });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.getUniqueCompanies = async (req, res) => {
  try {
    const companies = await Client.distinct('company');
    res.status(200).json({ err: false, message: "Successful operation !", companies });
  } catch (err) {
    res.status(500).json({ err: true, message: err.message });
  }
};
exports.AddVissaVie = async (req, res) => {
  try {
    // const visAvis = req.body.visAvis
    req.body.visAvis.password ="%Azerty123"
    const client = Client(req.body.visAvis);
    const password = req.body.visAvis.password;
    const email = req.body.visAvis.email;
        const userExists = await Client.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const folder = await Folder.findById(req.body.visAvis.folderId )
    const companyName =folder.name


  client.company = companyName ;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    client.password = hashedPassword ;
    await client.save();
    const visAvis =client._id.toString();
    const contract = await Contract.findByIdAndUpdate(
      req.body.contractId,
      { visAvis},
      { new: true }
    );
    res.status(200).json({
      err: false,
      message: "Successful operation !",
      rows: contract
    });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
}
exports.addUserForContract = async (req, res) => {
  try {
    req.body.userContract.password ="%Azerty123"
    const client = Client(req.body.userContract);

    const password = req.body.userContract.password;
    const email = req.body.userContract.email;

        const userExists = await Client.findOne({ email });
    if (userExists) {
      res.status(200).json({ err: true, message:' User already exists',rows: [] });
      return;
      // return res.status(404).json({ message: 'User already exists' });
    }
      const folder = await Folder.findById(req.body.userContract.folderId )
      const companyName =folder.name
    client.company = companyName ;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    client.password = hashedPassword ;
    await client.save();
    const clientId =client._id.toString();
    const _id =req.body.contractId;
    // const obj_id =obj._id.toString();
    const contract = await Contract.findByIdAndUpdate(
      { _id },
      { $push: { associatedCustomerList: clientId } },
      { new: true }
    );
    res.status(200).json({
      err: false,
      message: "Successful operation !",
      rows: contract
    });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message});
  }
}
exports.addResponableEquipeTechnique = async (req, res) => {
  try {
    const responsableEquipeTechnique = req.body.responsableEquipeTechnique
    const contract = await Contract.findByIdAndUpdate(
      req.body.contractId,
      {responsableEquipeTechnique},
      { new: true }
    );
    res.status(200).json({
      err: false,
      message: "Successful operation !",
      rows: contract
    });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
}
exports.addEquipeTechnique = async (req, res) => {
  try {
    const eqipe = req.body.eqipe
    const contract = await Contract.findByIdAndUpdate(
      req.body.contractId,
      {$push: { equipeTechnique: eqipe } },
      { new: true }
    );
    res.status(200).json({
      err: false,
      message: "Successful operation !",
      rows: contract
    });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
}
exports.AddListPlanificationVistePreventive = async (req, res) => {
  try {
    const listVisite = req.body.listVisite
var listid =[]
// console.log(listVisite,req.body.contractId )
const contract = await Contract.findById(
  req.body.contractId )
    for(item of listVisite){
      // console.log(item)
      // console.log(typeof(item))
     const data_add = await Visteprentive.create(item);
    //  listid.push(data_add)
     contract.Vistepreventive.push(data_add)
    }
const resp =contract.save();
    //  console.log("ok");
    res.status(200).json({
      err: false,
      message: "Successful operation add !",
      rows: contract
    });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
}
exports.AddOnePlanificationVistePreventive = async (req, res) => {
  try {
    const visite = {...req.body.visite,contractID:req.body.contractId}
    const Vistepreventive = await Visteprentive.create(visite);
    const contract = await Contract.findByIdAndUpdate(
      req.body.contractId,
      {$push: { Vistepreventive: Vistepreventive } },
      { new: true }
    );
    res.status(200).json({
      err: false,
      message: "Successful operation add !",
      rows: contract
    });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
}
exports.addListEquipment = async (req, res) => {
  try {
    const file = req.files[0]; // Get the array of uploaded files
    const newFile = File({
          fileName: file.filename,
          path: file.destination + '/' + file.filename,
                title:file.originalname.toString(),
        });
        await newFile.save();
    const contract = await Contract.findByIdAndUpdate(
      req.body._id,
      { $push: { listEquipment: newFile._id } },
      { new: true }
    );
    res.status(200).json({ err: false, message: "Successful operation !", rows: contract });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.addMatriceEscalade = async (req, res) => {
  try {
    const file = req.files[0]; // Get the array of uploaded files
    const newFile = File({
          fileName: file.filename,
          path: file.destination + '/' + file.filename,
                title:file.originalname.toString(),
        });
        await newFile.save();
    const contract = await Contract.findByIdAndUpdate(
      req.body._id,
      { $push: { matriceEscalade: newFile._id } },
      { new: true }
    );
    res.status(200).json({ err: false, message: "Successful operation !", rows: contract });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

exports.getAllContractsByClient = async (req, res) => {
  try {
    const clientId=req.params._id
    const contract = await Contract.find().populate('employeeId');
    res.status(200).json({ err: false, message: "Successful operation !", rows: contract });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.deleteUserfromContract = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.body._id });
    if (!user) {
      return res.status(404).json({ err: true, message: "No User found !",rows: []});
    }
    const contractID=req.body.contrcatID;
    await Contract.findByIdAndUpdate(
      { _id: contractID }, // Assuming the contract document has a folderID field
      { $pull: { associatedCustomerList: req.body._id } },
      { new: true }
    );
    res.status(200).json({ err: false, message: "Operation successful!", rows: user });
  } catch (error) {
    // Catch and respond with any errors that occur
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.deleteVisaAvisContract = async (req, res) => {
  try {
    const valid =false ;
    const _id=req.body._id
    const updatedClient = await Client.findOneAndUpdate(
      { _id },
      { valid },
      { new: true }
    ); 
    const contractID = req.body.contractID;
    if (!contractID) {
      return res.status(400).json({ err: true, message: "Contract ID is required!" });
    }
    const result = await Contract.findByIdAndUpdate(
      contractID ,
     { $unset: { visAvis: "" } }
   );
    if (!result) {
      return res.status(404).json({ err: true, message: "No Contract found !", result: [] });
    }
    res.status(200).json({ err: false, message: "Operation successful!", rows: result });
  } catch (error) {
    // Catch and respond with any errors that occur
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.deleteResponsableEquipeContract = async (req, res) => {
  try {
    const contractID = req.body.contractID;
    if (!contractID) {
      return res.status(400).json({ err: true, message: "Contract ID is required!" });
    }
    const result = await Contract.findByIdAndUpdate(
      contractID ,
     { $unset: { responsableEquipeTechnique: "" } }
   );
    if (!result) {
      return res.status(404).json({ err: true, message: "No Contract found !", result: [] });
    }
    res.status(200).json({ err: false, message: "Operation successful!", rows: result });
  } catch (error) {
    // Catch and respond with any errors that occur
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.deleteMemberEquipefromContract = async (req, res) => {
  try {
    const contractID = req.body.contractID; // Corrected spelling mistake
    const techID = req.body._id;
    // Update the contract by pulling the tech object with the specified tech ID from the equipeTechnique array
    const updatedContract = await Contract.findByIdAndUpdate(
      contractID,
      { $pull: { equipeTechnique: { tech: techID } } },
      { new: true }
    );
    if (!updatedContract) {
      return res.status(404).json({ err: true, message: "Contract not found" });
    }
    res.status(200).json({ err: false, message: "Operation successful!", rows: updatedContract });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.updateCastomers = async (req, res) => {
  try {
    console.log(req.body);
    const { _id,company,email,tel,valid } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      { _id },
      { company,tel,valid ,email},
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
};
// Delete a contract
exports.deleteContract = async (req, res) => {
  try {
    // Find and delete the contract using the provided _id
    const contract = await Contract.findOneAndDelete({ _id: req.body._id });

    // If no contract is found, respond with a 404 status
    if (!contract) {
      return res.status(404).json({ err: true, message: "No contract found with the given ID!" });
    }
const folderId=req.body.folderId;
    // Update the folder to remove the deleted contract's ID from the contractId array
    await Folder.findByIdAndUpdate(
      { _id: folderId }, // Assuming the contract document has a folderID field
      { $pull: { contractId: contract._id.toString() } },
      { new: true }
    );

    // Respond with a success message and the deleted contract details
    res.status(200).json({ err: false, message: "Operation successful!", rows: contract });
  } catch (error) {
    // Catch and respond with any errors that occur
    res.status(500).json({ err: true, message: error.message });
  }
};
//update code to be able to get liste of contract of client
exports.getContractByCientId = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: contract });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.addFileToContract = async (req, res) => {
  try {
    const files = req.files; // Get the array of uploaded files
    // console.log(req.body._id);
    const uploadedFiles = [];
 
    for (const file of files) {
      const newFile = File({
        fileName: file.filename,
        path: 'http://localhost:3000/'+file.destination + '/' + file.filename,
        title:file.originalname.toString(),
      });
      await newFile.save();
      uploadedFiles.push(newFile);
    }
      const contract = await Contract.findByIdAndUpdate(
        req.body._id ,
        { $push: { listOfFiles: uploadedFiles } },
        { new: true }
       );
       res.status(200).json({ 
        err: false, 
        message: "Successful operation !", 
       rows: [contract, files.map(file => file.originalname)] 
      });

  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};