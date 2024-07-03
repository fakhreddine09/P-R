const Folder = require('../models/folderModel');
const File = require('../models/fileModel');
const Site = require('../models/siteModel');
const Inventaire = require('../models/inventaireModel');
const Vistepreventive = require('../models/vistepreventiveModel');
// const Contract =require('../models/contractModel');
const Contract = require('../models/contractModel');


exports.createFolder = async (req, res) => {
  try {
      // let a = "jjj"
    const name  = req.body.name.toLocaleLowerCase()
    const colorfoldr = req.body.colorfoldr
    const folder = Folder({ name: name ,colorfoldr:colorfoldr });

      const files = req.files[0]
    // const file =req.files ;
    const newFile =File({
      fileName: files.filename,
      path: 'http://localhost:3000/'+files.destination + '/' + files.filename,
      title:files.originalname.toString(),
    })
    newFile.save();
    folder.logo =newFile._id.toString()
    folder.save()
    res.status(200).json({ err: false, message: "Successful operation !", rows: folder });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Update a user still working on it username
exports.updateFolder = async (req, res) => {
  try {
      if(req.files){

      }

    const { _id,name,colorfoldr} = req.body;
    const updatedFolder = await Folder.findByIdAndUpdate(
      {_id},
      {name,colorfoldr },
      { new: true }
    );
    if (!updatedFolder) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: updatedFolder });
  } catch (err) {
    console.error(error);
    res.status(500).json({ err: true, message: error.message });
  }
};
// Delete a folder
exports.deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findByIdAndDelete(req.body._id);
    if (!folder) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }

    res.status(200).json({ err: false, message: "Successful operation !", rows: folder });
  } catch (err) {
    res.status(500).json({ err: true, message: error.message });
  }
};

exports.getFolderById = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params._id)
    .populate({
      path: 'logo',
      model: 'File',
    });
    if (!folder) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: folder });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};





// ----------------------------------------------------------------

exports.getAllFoldres = async (req, res) => {
  try {
    const folders = await Folder.find()
      .populate('listSite')
      .populate('contractId')
      .populate({
        path: 'logo',
        model: 'File',
      })
    // console.log(folders[0]);

    const modifiedFolders = folders.map(folder => {
      const contractCount = folder.contractId ? folder.contractId.length : 0;
      return {
        ...folder.toObject(),
        nbrContrat: contractCount
      };
    });
    res.status(200).json({ err: false, message: "Successful operation !", rows: modifiedFolders });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};


exports.addSiteForFolder = async (req, res) => {
  try {
    const site = Site(req.body.site);
    site.save();
    const IdSite = site._id.toString();
    const _id = req.body._id;
    const folder = await Folder.findByIdAndUpdate(
      { _id },
      { $push: { listSite: IdSite } },
      { new: true }
    );

    res.status(200).json({
      err: false,
      message: "Successful operation !",
      rows: folder
    });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
}

exports.updateSite = async (req, res) => {
  try {
    const { _id, nomSite, longitude, latitude, adress } = req.body;
    const updateSite = await Site.findByIdAndUpdate(
      { _id },
      { nomSite, longitude, latitude, adress },
      { new: true }
    );
    if (!updateSite) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: updateSite });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

exports.deleteSite = async (req, res) => {
  try {
    // Log the received _id for debugging purposes
    // Ensure _id is provided in the request body
    if (!req.body._id) {
      return res.status(400).json({ err: true, message: "No ID provided in the request!" });
    }

    // Find and delete the site using the provided _id
    const site = await Site.findOneAndDelete({ _id: req.body._id });

    // If no site is found, respond with a 404 status
    if (!site) {
      return res.status(404).json({ err: true, message: "No site found with the given ID!" });
    }
    const folderId = req.body.folderId;
    // Update the organization to remove the deleted site's ID from the siteIds array
    await Folder.findByIdAndUpdate(
      { _id: folderId }, // Assuming the site document has an organizationID field
      { $pull: { listSite: site._id.toString() } },
      { new: true }
    );

    // Respond with a success message and the deleted site details
    res.status(200).json({ err: false, message: "Operation successful!", rows: site });
  } catch (error) {
    // Catch and respond with any errors that occur
    res.status(500).json({ err: true, message: error.message });
  }
};


exports.getListSiteBayFolder = async (req, res) => {
  try {
    const folders = await Folder.findById(req.params._id).populate('listSite');
    const listSites = folders.listSite
   res.status(200).json({ err: false, message: "Successful operation !", rows: listSites });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

exports.getListSiteByFolder = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params._id).populate({
      path: 'listSite',
      populate: [
        {
          path: 'listEquipment',
          populate: { path: 'TypeSupport' } // Populate TypeSupport within listEquipment
        },
        {
          path: 'listEquipmentSoft',
          populate: { path: 'TypeSupport' } // Populate TypeSupport within listEquipmentSoft
        }
      ]
    });

    if (!folder) {
      return res.status(404).json({ err: true, message: "Folder not found" });
    }

    const data = folder.listSite.map(site => ({
      _id: site._id,
      nomSite: site.nomSite,
      longitude: site.longitude,
      latitude: site.latitude,
      adress: site.adress,
      listEquipment: site.listEquipment,
      listEquipmentSoft: site.listEquipmentSoft,
      // Add other site properties you need
    }));

    res.status(200).json({ err: false, message: "Successful operation!", rows: data });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

exports.getContractsByFolderId = async (req, res) => {
  try {
    // Trouver le dossier par son ID
    const folder = await Folder.findById(req.params._id).exec();
    // Si le dossier n'est pas trouvé, retourner une erreur
    if (!folder) {
      return res.status(404).json({ err: true, message: "Folder not found" });
    }
    // Obtenir les IDs des contrats associés au dossier
    const contractIds = folder.contractId;
    // Requête pour les contrats en utilisant les IDs des contrats
    const ListContract = [];
    // Utiliser Promise.all pour exécuter toutes les requêtes de recherche de contrat en parallèle
    await Promise.all(contractIds.map(async contractId => {
      const contract = await Contract.findById(contractId)
        .populate({
          path: 'responsableEquipeTechnique.responsable',
          model: 'Technicien',
        })
        .populate({
          path: 'equipeTechnique.tech',
          model: 'Technicien',
        })
        .populate({
          path: 'visAvis',
          model: 'Client',
        })
        .populate({
          path: 'Vistepreventive',
          populate: [
            { path: 'siteID', model: 'Site' },
            { path: 'technicien', model: 'Technicien' }
          ]
        })
        
        .populate({
          path: 'listOfFiles',
          model: 'File',
        })
        .populate({
          path: 'associatedCustomerList',
          model: 'Client',
        });

      if (contract) {
        ListContract.push(contract);
      }
    }));

    if (ListContract.length === 0) {
      return res.status(200).json({ err: false, message: "No contracts found for this folder", rows: ListContract });
    }

    res.status(200).json({ err: false, message: "Contracts found for the folder", rows: ListContract });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// exports.getContractsByFolderId = async (req, res) => {
//   try {
//     // Find the folder by its ID
//     const folder = await Folder.findById(req.params._id).exec();
//     // If folder not found, return an error
//     if (!folder) {
//       return res.status(404).json({ err: true, message: "Folder not found" });
//     }
//     // Get the contract IDs associated with the folder
//     const contractIds = folder.contractId;
//     // Query for contracts using the contract IDs
//     const ListContract = [];
//     // Utiliser Promise.all pour exécuter toutes les requêtes de recherche de contrat en parallèle
//     await Promise.all(contractIds.map(async contractId => {
//       const contract = await Contract.findById(contractId)
//         .populate({
//           path: 'responsableEquipeTechnique.responsable',
//           model: 'Technicien',
//         })
//         .populate({
//           path: 'equipeTechnique.tech',
//           model: 'Technicien',
//         })
//         .populate({
//           path: 'visAvis',
//           model: 'Client',
//         })//planificationVistePreventive
//         .populate({
//           path: 'planificationVistePreventive',
//           model: 'Visteprentive',
//         })
        
//         .populate({
//           path: 'listOfFiles',
//           model: 'File',
//         })
//         .populate({
//           path: 'associatedCustomerList',
//           model: 'Client',
//         });

//       if (contract) {
//         ListContract.push(contract);
//       }
//     }));


//     if (ListContract.length === 0) {
//       // return res.status(404).json({ err: true, message: "No contracts found for this folder",rows: [] });
//     res.status(200).json({ err: false, message: "No contracts found for this folder", rows: ListContract });

//     }
//     if (ListContract.length != 0) {
//       // ListContract.push({FolderId:req.params._id});

//     }

//     res.status(200).json({ err: false, message: "Contracts found for the folder", rows: ListContract });
//   } catch (error) {
//     res.status(500).json({ err: true, message: error.message });
//   }
// };


// exports.getOneFoldreByID = async (req, res) => {
//   const _id=req.body._id
//   try {
//       const folder = await Folder.findById(_id)
//           .populate({
//               path: 'listSite', // Populate the listSite field
//               populate: {
//                   path: 'listInventaire', // Populate the listInventaire field inside each site
//                   model: 'Inventaire'
//               }
//           })
//           .populate({
//               path: 'contractId', // Populate the contractId field
//               populate: {
//                   path: 'responsableEquipeTechnique.responsable', // Populate the responsable field inside responsableEquipeTechnique
//                   model: 'Technicien'
//               }
//           })
//           .populate({
//               path: 'contractId', // Populate the contractId field
//               populate: {
//                   path: 'equipeTechnique.tech', // Populate the tech field inside equipeTechnique
//                   model: 'Technicien'
//               }
//           })
//           .populate('contractId.visAvis') // Populate the visAvis field inside contractId
//           .populate('contractId.planificationVistePreventive') // Populate the planificationVistePreventive field inside contractId
//           .populate('contractId.listOfFiles') // Populate the listOfFiles field inside contractId
//           .populate('contractId.associatedCustomerList') // Populate the associatedCustomerList field inside contractId
//           .exec();
//           res.status(200).json({ err: false, message: "Successful operation !", rows: folder });
//       // return ;
//   } catch (error) {
//     res.status(500).json({ err: true, message: error.message });
//       // console.error('Error fetching folder:', error);
//       throw error; // Propagate the error
//   }
// }



// exports.getOneFoldreByID = async (req, res) => {
//   try {
//     const folderId = req.params._id;
//     const folder = await Folder.findById(folderId)
//       .populate({
//         path: 'listSite',
//         populate: [
//           { path: 'listInventaire', model: 'Inventaire' }
//         ]
//       })
//       .populate({
//         path: 'contractId',
//         populate: [
//           { path: 'responsableEquipeTechnique.responsable', model: 'Technicien' },
//           { path: 'equipeTechnique.tech', model: 'Technicien' },
//           { path: 'visAvis', model: 'Client' },
//           { path: 'planificationVistePreventive', model: 'Vistepreventive' },
//           { path: 'listOfFiles', model: 'File' },
//           { path: 'associatedCustomerList', model: 'Client' }
//         ]
//       });

//     res.status(200).json({ err: false, message: "Successful operation !", rows: folder });
//   } catch (error) {
//     res.status(500).json({ err: true, message: error.message });
//   }
// };


// exports.createFolder = async (req, res) => {
//   try {
//     const folder = Folder(req.body);
//     await folder.save();
//     res.status(200).json({err: false, message: "Successful operation !", rows: folder});
//   } catch (error) {
//     res.status(500).json({ err: true, message: error.message });
//   }
// };

// Add file to the folder
exports.addFile = async (req, res) => {
  try {
    const files = req.files; // Get the array of uploaded files
    const uploadedFiles = [];

    for (const file of files) {
      const newFile = File({
        fileName: file.filename,
        path: file.destination + '/' + file.filename,
        title: file.originalname.toString(),
      });
      await newFile.save();
      uploadedFiles.push(newFile);
    }
    const folder = await Folder.findOneAndUpdate(
      { clientId: req.body.clientId },
      { $push: { listOfFiles: uploadedFiles } },
      { new: true }
    );
    res.status(200).json({
      err: false,
      message: "Successful operation !",
      rows: [folder, files.map(file => file.originalname)]
    });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// remove file to the folder
exports.removeFile = async (req, res) => {
  try {
    const file = await File.findByIdAndDelete(req.body.fileId);
    if (!file) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    const folder = await Folder.findOneAndUpdate(
      { clientId: req.body.clientId },
      { $pull: { listOfFiles: req.body.fileId } },
      { new: true }
    );
    res.status(200).json({ err: false, message: "Successful operation !", rows: folder });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Get all folders
exports.getAllFolders = async (req, res) => {
  try {
    var folder = await Folder.find().populate('clientId', 'name');
    res.status(200).json({ err: false, message: "Successful operation !", rows: folder });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Get a single folder
// exports.getFolderById = async (req, res) => {
//   try {
//     const folder = await Folder.findById(req.params.id).populate('listOfFiles');
//     if (!folder) {
//       return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
//     }
//     res.status(200).json({ err: false, message: "Successful operation !", rows: folder });
//   } catch (error) {
//     res.status(500).json({ err: true, message: error.message });
//   }
// };

// Get a just files
exports.getFilesByclientId = async (req, res) => {
  const clientId = req.params.id;
  try {
    const folder = await Folder.findOne({ clientId }).populate('listOfFiles');
    if (!folder) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: folder.listOfFiles });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

exports.countFilesByClientId = async (req, res) => {
  const clientId = req.params.id;

  try {
    const folder = await Folder.findOne({ clientId });
    const count = folder.listOfFiles.length;
    res.status(200).json({ err: false, message: "Successful operation !", rows: { count, clientId } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: true, message: error.message });
  }
};

