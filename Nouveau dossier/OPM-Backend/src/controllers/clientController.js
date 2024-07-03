const Client = require('../models/clientModel');
const Contract = require('../models/contractModel');
// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const client = await Client.find({ authority: 'client' })
      .populate({
        path: 'folderId',
        populate: {
          path: 'contractId',
          model: 'Contract'
        }
      });
    // console.log(client);
    const userListFinnal = []
    let obj = {};
    client.forEach(element => {
      obj = {
        _id: element._id.toString(),
        company: element.company,
        tel: element.tel,
        adress: element.adress,
        email: element.email,
        folderName: element.folderId.name,
        folderId: element.folderId._id,
        nbrContract: element.folderId.contractId.length,
        valid: element.valid
      }
      userListFinnal.push(obj)
    });


    res.status(200).json({ err: false, message: "Successful operation !", rows: userListFinnal });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

exports.getListContractByClient = async (req, res) => {
  try {
    const id = req.params._id;
    const contracts = await Contract.find({
      $or: [
        { visAvis: id },
        { associatedCustomerList: id }
      ]
    })
      .populate([
        {
          path: 'responsableEquipeTechnique.responsable',
          model: 'Technicien',
          populate: { path: 'image', model: 'File' },
          select: 'image'
        },
        {
          path: 'equipeTechnique.tech',
          model: 'Technicien',
          populate: { path: 'image', model: 'File' },
          select: 'image'

        }
      ]);

    res.status(200).json({ err: false, message: "Successful operation !", rows: contracts });
  } catch (err) {
    res.status(500).json({ err: true, message: err.message });
  }
};


exports.affectOledCustemer = async (req, res) => {
  try {
    const _id = req.body._id;
    const customerId = req.body.customerId;
    const visAvis = req.body.visaVi;
    let  contract
    if(visAvis!=null){
       contract = await Contract.findByIdAndUpdate(
        _id,
        { visAvis},
        { new: true }
      );
    }
    if(customerId != null){
      contract = await Contract.findByIdAndUpdate(
        { _id },
        { $push: { associatedCustomerList: customerId } },
        { new: true }
      );
    }
    res.status(200).json({
      err: false,
      message: "Successful operation !",
      rows: contract
    });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message});
  }
}
// 
exports.getListClientOledNotAffected = async (req, res) => {
  try {
    const companyName =req.params.companyName.toLocaleLowerCase()
    const client = await Client.find({ company: companyName });
    res.status(200).json({ err: false, message: "Successful operation !", rows: client });
  } catch (err) {
    res.status(500).json({ err: true, message: err.message });
  }
};

exports.getListClientDejaAffected = async (req, res) => {
  try {
    const id = req.params._id;
    const client = await Contract.find({_id:id })
      .populate([
        {
          path: 'associatedCustomerList',
          model: 'Client',
        },
        {
          path: 'visAvis',
          model: 'Client',
        }
      ])
      let listId =[]
        listId.push(client[0].visAvis._id.toString())
        let ListCustomer = client[0].associatedCustomerList
        ListCustomer.forEach(element => {
          listId.push(element._id)
        });

    res.status(200).json({ err: false, message: "Successful operation !", rows: listId});
  } catch (err) {
    res.status(500).json({ err: true, message: err.message });
  }
};

exports.getAllClientsByValid = async (req, res) => {
  const { valid } = req.params;

  try {
    if (!valid) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    const client = await Client.find({ valid });
    res.status(200).json({ err: false, message: "Successful operation !", rows: client });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.updateStatClient = async (req, res) => {
  try {
    const { _id, valid } = req.body;
    const updatedClient = await Client.findOneAndUpdate(
      { _id },
      { valid },
      { new: true }
    );
    if (!updatedClient) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Account status changes successfully", rows: updatedClient });
  } catch (err) {
    console.error(error);
    res.status(500).json({ err: true, message: error.message });
  }
};






// Update a user client
exports.updateClient = async (req, res) => {
  try {
    const { email, password, company, image, valid, newEmail } = req.body;
    const updatedClient = await Client.findOneAndUpdate(
      { email },
      { email: newEmail, password, company, image, valid },
      { new: true }
    );
    if (!updatedClient) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: updatedClient });
  } catch (err) {
    console.error(error);
    res.status(500).json({ err: true, message: error.message });
  }
};
// Delete a client
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findOneAndUpdate(
      { email: req.body.email },
      { valid: false },
      { new: true }
    );
    if (!client) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }

    res.status(200).json({ err: false, message: "Successful operation !", rows: client });
  } catch (err) {
    res.status(500).json({ err: true, message: error.message });
  }
};
