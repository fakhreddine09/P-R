const PartOrder = require('../models/partOrderModel');
const Contract = require('../models/contractModel');
const Client = require('../models/clientModel');
const Employee = require('../models/employeeModel');
const File = require('../models/fileModel');
const sendEmail = require('../middlewares/mailer');
const { findById } = require('../models/adminModel');

// Create a new part order
exports.createPartOrder = async (req, res) => {
  try {
    const client = await Client.findById(req.body.clientId);
    const contract = await Contract.findById(client.contractId);
    const partOrder = new PartOrder(req.body);
    partOrder.employeeId = contract.employeeId;
    await partOrder.save();
    //mailer uncomment and replace admin to use
    // const to1 = 'opm.mailers@gmail.com'; // admin email put here
    // const subject1 = 'PartOrder - '+partOrder._id;
    // const text1 = 'New PartOrder just came in, ready to be handled.';
    // await sendEmail(to1 ,subject1, text1);
    // const employee = await Employee.findById(partOrder.employeeId);
    // const to2 = employee.email; // tech email
    // const subject2 = 'PartOrder - '+partOrder._id;
    // const text2 = 'New PartOrder just came in, ready to be handled.';
    // await sendEmail(to2 ,subject2, text2);
    // const to3 = client.email; // client email
    // const subject3 = 'PartOrder - '+partOrder._id;
    // const text3 = 'PartOrder created successfully.';
    // await sendEmail(to3 ,subject3, text3);

    res.status(200).json({ err: false, message: "Successful operation!", rows: partOrder });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Get all part orders
exports.getAllPartOrders = async (req, res) => {
  try {
    const partOrders = await PartOrder.find();
    res.status(200).json({ err: false, message: "Successful operation!", rows: partOrders });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Get a single part order by ID
exports.getPartOrderById = async (req, res) => {
  try {
    const partOrder = await PartOrder.findById(req.params.id).populate('employeeId');;
    if (!partOrder) {
      res.status(404).json({ err: true, message: 'Part order not found' });
    } else {
      res.status(200).json({ err: false, message: "Successful operation!", rows: partOrder });
    }
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Get a single part order by clientID
exports.getPartOrderByClientId = async (req, res) => {
  clientId = req.params.id ;
  try {
    const partOrder = await PartOrder.find({ clientId}).populate(
      [
        {
          path: 'bon_commande',
          model: 'File',
        },
        {
          path: 'devise',
          model: 'File',
        },
        {
          path: 'employeeId',
          model: 'Employee'
        }
      ]);
    // const partOrder = await PartOrder.find({clientId: req.params.id});
    if (!partOrder) {
      res.status(404).json({ err: true, message: 'Part order not found' });
    } else {
      res.status(200).json({ err: false, message: "Successful operation!", rows: partOrder });
    }
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Add file 
exports.addFile = async (req, res) => {
  try {
    let partOrder ;
    let newFile ;
    if(req.body.type_file == 'devise'){
   const file = req.file;

      newFile = File({
       fileName: file.filename,
       path: file.destination + '/' + file.filename,
       title: req.body.title
     });
     await newFile.save();

    partOrder = await PartOrder.findOneAndUpdate(
     { _id: req.body.clientId },
     { $push: { devise: newFile},status:req.body.status},
     { new: true }
    );
}
if(req.body.type_file == 'bon_commande'){
  const file = req.file;
     newFile = File({
      fileName: file.filename,
      path: file.destination + '/' + file.filename,
      title: req.body.title
    });
    await newFile.save();

   partOrder = await PartOrder.findOneAndUpdate(
    { _id: req.body.clientId },
    { $push: { bon_commande: newFile},status:req.body.status},
    { new: true }
   );
}

    res.status(200).json({
       err: false, 
       message: "Successful operation !", 
       rows: [partOrder, newFile] });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
// remove file 
exports.removeFile = async (req, res) => {
  try {
   const file = await File.findByIdAndDelete(req.body.fileId);
   if (!file){
    return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
   }
   const partOrder = await PartOrder.findOneAndUpdate(
     { clientId: req.body.clientId },
     { $pull: { listOfFiles: req.body.fileId } },
     { new: true }
    );
    res.status(200).json({ err: false, message: "Successful operation !", rows: partOrder });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};


//getClientsHavingPartOrders
exports.getClientsHavingPartOrders = async (req, res) => {
  try {
    const clients = await Client.find();
    const clientIds = clients.map(client => client._id);

    const partOrders = await PartOrder.find({
      clientId: { $in: clientIds }
    });

    const clientPartOrders = partOrders.reduce((result, partOrder) => {
      const clientId = partOrder.clientId.toString();
      if (!result[clientId]) {
        result[clientId] = [];
      }
      result[clientId].push(partOrder);
      return result;
    }, {});

    const clientsHavingPartOrders = clients.filter(client => {
      const clientId = client._id.toString();
      return clientPartOrders[clientId] && clientPartOrders[clientId].length > 0;
    });

    res.status(200).json({
      err: false,
      message: "Successful operation!",
      rows: clientsHavingPartOrders
    });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Update a part order
exports.updatePartOrder = async (req, res) => {
  try {
    const partOrder = await PartOrder.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!partOrder) {
      res.status(404).json({ err: true, message: 'Part order not found' });
    } else {
      res.status(200).json({ err: false, message: "Successful operation!", rows: partOrder });
    }
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Delete a part order
exports.deletePartOrder = async (req, res) => {
  try {
    const partOrder = await PartOrder.findByIdAndDelete(req.params.id);
    if (!partOrder) {
      res.status(404).json({ err: true, message: 'Part order not found' });
    } else {
      res.status(200).json({ err: false, message: "Successful operation!", rows: partOrder });
    }
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
// get part order bay status 
exports.getPartOrderByStatus = async (req, res) => {
  const clientId = req.params.id;
  const status = req.params.status;
  try {
    if (!status) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    const partOrder = await PartOrder.find({ clientId, status });
    if (!partOrder) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: partOrder });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
