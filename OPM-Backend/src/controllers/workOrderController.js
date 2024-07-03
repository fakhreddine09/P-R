const WorkOrder = require('../models/workOrderModel');
const Ticket = require('../models/ticketModel');
const File = require('../models/fileModel');
const checkSLA = require('../middlewares/SLAcheck');
const cron = require('node-cron');
const Contract = require('../models/contractModel');
const Client = require('../models/clientModel');
const Employee = require('../models/employeeModel');
const Folder = require('../models/folderModel');
const moment = require('moment');
const FollowUp = require('../models/followUpModel');
const sendEmail = require('../middlewares/mailer');
require('moment-timezone');

exports.createWorkOrder = async (req, res) => {
  const { clientId } = req.body;
  try {
    const client = await Client.findById(clientId);
    const contract = await Contract.findById(client.contractId);
    const folder = await Folder.findOne({ contractId: contract._id });
    var workOrder = WorkOrder(req.body);
    if (req.files) {
      const files = req.files; // Get the array of uploaded files
      const uploadedFiles = [];

      for (const file of files) {
        const newFile = File({
          fileName: file.filename,
          path: file.destination + '/' + file.filename,
          title: file.orignalname
        });
        await newFile.save();
        uploadedFiles.push(newFile);
      }
      workOrder.listOfFiles = uploadedFiles;
    } 
    const futureTime = moment().add(contract.sla, 'hours');                                                          // add sla to current time
    const cronPattern = moment(futureTime).format('m H D M d');                                                               //format the futureTime to something understandable by node.cron
    const task = cron.schedule(cronPattern, () => checkSLA(workOrder._id), { scheduled: true });                                            // schedule a task in futureTime tetsajel fl emplois du temps mta3 el mechina(futureTime formuller, function(), confirmation bch tetsajel)
    await workOrder.save();

     //mailer uncomment and replace admin to use
    //  const to1 = 'opm.mailers@gmail.com'; // admin email put here
    //  const subject1 = 'WorkOrder - '+workOrder._id;
    //  const text1 = 'New WorkOrder just came in, ready to be handled.';
    //  await sendEmail(to1 ,subject1, text1);
    //  const to2 = client.email; // client email
    //  const subject2 = 'WorkOrder - '+workOrder._id;
    //  const text2 = 'WorkOrder created successfully.';
    //  await sendEmail(to2 ,subject2, text2);

    res.status(200).json({ err: false, message: "Successful operation !", rows: workOrder });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Add ticket to the workorder
exports.addTicket = async (req, res) => {
  const { title, clientId, description, employeeId, workOrderId } = req.body;
  try {

    const files = req.files; // Get the array of uploaded files
    const uploadedFiles = [];

    for (const file of files) {
      const newFile = File({
        fileName: file.filename,
        path: file.destination + '/' + file.filename,
        title: file.originalname
      });
      await newFile.save();
      uploadedFiles.push(newFile);
    }
    const ticket = Ticket({ title, description, employeeId, listOfFiles: uploadedFiles });
    await ticket.save();
    const workOrder = await WorkOrder.findOneAndUpdate(
      { _id: workOrderId },
      { ticketId: ticket._id },
      { new: true }
    );
    res.status(200).json({ err: false, message: "Successful operation !", rows: workOrder });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// remove ticket to the workorder
exports.removeTicket = async (req, res) => {
  const { ticketId, clientId } = req.body;
  try {
    const ticket = await Ticket.findByIdAndDelete(ticketId);
    if (!ticket) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    const workOrder = await WorkOrder.findOneAndUpdate(
      { clientId: clientId },
      { ticketId: null },
      { new: true }
    );
    res.status(200).json({ err: false, message: "Successful operation !", rows: workOrder });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
//
exports.getWorkOrderByStatus = async (req, res) => {
  const clientId = req.params.id;
  const status = req.params.status;

  try {
    if (!status) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    const workOrder = await WorkOrder.find({ clientId, status });
    if (!workOrder) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: workOrder });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Get all workOrders
exports.getAllWorkOrders = async (req, res) => {
  try {
    const workOrder = await WorkOrder.find();
    res.status(200).json({ err: false, message: "Successful operation !", rows: workOrder });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Get a single workOrder
exports.getWorkOrderById = async (req, res) => {
  const id = req.params.id;
  try {
    
    if (req.params.authority && req.params.authority == "client") {
      const workOrder = await WorkOrder.findById(id).populate(
        [
          {
            path: 'listOfFiles',
            model: 'File',
          },
          {
            path: 'clientId',
            model: 'Client',
            select: 'company',
          },
          {
            path: 'employeeId',
            model: 'Employee',
            select: 'firstName lastName'
          },
          {
            path: 'followUpList',
            model: 'FollowUp'
          },
        ]).select('-listOfTickets');
      if (!workOrder) {
        return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
      }
      res.status(200).json({ err: false, message: "Successful operation !", rows: workOrder });
    } else {
      const workOrder = await WorkOrder.findById(id).populate(
        [
          {
            path: 'listOfFiles',
            model: 'File',
          },
          {
            path: 'clientId',
            model: 'Client',
            select: 'company',
            
          },
          {
            path: 'employeeId',
            model: 'Employee',
            select: 'firstName lastName'
          },
          {
            path: 'ticketId',
            model: 'Ticket',
            select: 'title status creationDate description',
            populate: {
              path: 'listOfFiles',
              model: 'File'
            }
          },
          {
            path: 'followUpList',
            model: 'FollowUp'
          },
        ]);
      if (!workOrder) {
        return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
      }
      res.status(200).json({ err: false, message: "Successful operation !", rows: workOrder });
    }
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Get a workOrders affected to a technician
exports.getWorkOrderByEmployeeId = async (req, res) => {
  const id = req.params.id;
  try {
    const workOrder = await WorkOrder.find({ employeeId: id }).populate(
      [
        {
          path: 'listOfFiles',
          model: 'File',
        },
        {
          path: 'clientId',
          model: 'Client',
          select: 'company',
        },
        {
          path: 'employeeId',
          model: 'Employee',
          select: 'firstName lastName'
        },
        {
          path: 'ticketId',
          model: 'Ticket',
          select: 'title status creationDate description',
          populate: {
            path: 'listOfFiles',
            model: 'File'
          }
        },
        {
          path: 'followUpList',
          model: 'FollowUp'
        },
      ]);
    if (!workOrder) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: workOrder });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Get a workOrder by status for a certain client
exports.getWorkOrderByClientIdByStatus = async (req, res) => {
  const clientId = req.params.id;
  const status = req.params.status;
  try {
    if (!status) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    const workOrder = await WorkOrder.find({ clientId, status });
    if (!workOrder) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: workOrder });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Get a workOrder by status for a certain employee
exports.getWorkOrderByEmployeeIdByStatus = async (req, res) => {
  const employeeId = req.params.id;
  const status = req.params.status;

  try {
    if (!status) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    const workOrder = await WorkOrder.find({ employeeId, status });
    if (!workOrder) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: workOrder });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};


// Get a work order by client id
exports.getWorkOrderByClientId = async (req, res) => {
  const clientId = req.params.id;
  try {
    if (req.body.authority && req.body.authority == "client") {
      const workOrder = await WorkOrder.findById({ clientId }).populate(
        [
          {
            path: 'listOfFiles',
            model: 'File'
          },
          {
            path: 'clientId',
            model: 'Client',
            select: 'company',
          },
          {
            path: 'employeeId',
            model: 'Employee',
            select: 'firstName lastName'
          },
        ]).select('-listOfTickets -followUpList');
      if (!workOrder) {
        return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
      }

      res.status(200).json({ err: false, message: "Successful operation !", rows: workOrder});
    } else {
      const workOrder = await WorkOrder.find({ clientId }).populate(
        [
          {
            path: 'listOfFiles',
            model: 'File'
          },
          {
            path: 'clientId',
            model: 'Client',
            select: 'company',
          },
          {
            path: 'employeeId',
            model: 'Employee',
            select: 'firstName lastName'
          },
          {
            path: 'ticketId',
            model: 'Ticket',
            select: 'title status creationDate',
            populate: {
              path: 'listOfFiles',
              model: 'File'
            }
          },
          {
            path: 'followUpList',
            model: 'FollowUp'
          },
        ]);
      if (!workOrder) {
        return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
      }

      res.status(200).json({ err: false, message: "Successful operation !", rows: workOrder});
    }
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

exports.countWorkOrderByClientId = async (req, res) => {
  const clientId = req.params.id;
  try {
    const count = await WorkOrder.countDocuments({ clientId });
    res.status(200).json({ err: false, message: "Successful operation !", rows: { count, clientId } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: true, message: error.message });
  }
};

//getUnhandledClients
exports.getUnhandledClients = async (req, res) => {
  try {
    const clients = await Client.find();
    const clientIds = clients.map(client => client._id);

    const workOrders = await WorkOrder.find({
      clientId: { $in: clientIds },
      employeeId: { $exists: false }
    });

    const clientWorkOrders = workOrders.reduce((result, workOrder) => {
      const clientId = workOrder.clientId.toString();
      if (!result[clientId]) {
        result[clientId] = [];
      }
      result[clientId].push(workOrder);
      return result;
    }, {});

    const clientsWithoutEmployee = clients.filter(client => {
      const clientId = client._id.toString();
      return clientWorkOrders[clientId] && clientWorkOrders[clientId].length > 0;
    });

    res.status(200).json({
      err: false,
      message: "Successful operation!",
      rows: clientsWithoutEmployee
    });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

exports.countUnhandledWorkOrderByClientId = async (req, res) => {
  const clientId = req.params.id;
  try {
    const count = await WorkOrder.countDocuments({ clientId: clientId,
      $or: [
        { employeeId: null }, // Check if employeeId is null
        { employeeId: { $exists: false } } // Check if employeeId does not exist
      ] });
    res.status(200).json({ err: false, message: "Successful operation !", rows: { count, clientId } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: true, message: error.message });
  }
};

// returns unhandled workOrders
exports.getUnhandledWorkOrders = async (req, res) => {
  const clientId = req.params.id;
  try {
    if (clientId) {
      const workOrder = await WorkOrder.find({
        clientId: clientId,
        $or: [
          { employeeId: null }, // Check if employeeId is null
          { employeeId: { $exists: false } } // Check if employeeId does not exist
        ]
      }).populate(
        [
          {
            path: 'listOfFiles',
            model: 'File',
          },
          {
            path: 'clientId',
            model: 'Client',
            select: 'company',
          },
          {
            path: 'employeeId',
            model: 'Employee',
            select: 'firstName lastName'
          },
          {
            path: 'ticketId',
            model: 'Ticket',
            select: 'title status creationDate description',
            populate: {
              path: 'listOfFiles',
              model: 'File'
            }
          },
          {
            path: 'followUpList',
            model: 'FollowUp'
          },
        ]);
      if (!workOrder) {
        return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
      }

      res.status(200).json({ err: false, message: "Successful operation !", rows: workOrder.reverse() });
    } else {
      const workOrder = await WorkOrder.find({
        $or: [
          { employeeId: null }, // Check if employeeId is null
          { employeeId: { $exists: false } } // Check if employeeId does not exist
        ]
      }).populate(
        [
          {
            path: 'listOfFiles',
            model: 'File',
          },
          {
            path: 'clientId',
            model: 'Client',
            select: 'company',
          },
          {
            path: 'employeeId',
            model: 'Employee',
            select: 'firstName lastName'
          },
          {
            path: 'ticketId',
            model: 'Ticket',
            select: 'title status creationDate description',
            populate: {
              path: 'listOfFiles',
              model: 'File'
            }
          },
          {
            path: 'followUpList',
            model: 'FollowUp'
          },
        ]);
      if (!workOrder) {
        return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
      }

      res.status(200).json({ err: false, message: "Successful operation !", rows: workOrder.reverse() });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: true, message: error.message });
  }
};



// returns Handled workOrders
exports.getHandledWorkOrders = async (req, res) => {
  const clientId = req.params.id;
  try {
    if (clientId) {
      const workOrder = await WorkOrder.find({
        clientId: clientId,
        employeeId: { $ne: null, $exists: true }
      }).populate(
        [
          {
            path: 'listOfFiles',
            model: 'File',
          },
          {
            path: 'clientId',
            model: 'Client',
            select: 'company',
          },
          {
            path: 'employeeId',
            model: 'Employee',
            select: 'firstName lastName'
          },
          {
            path: 'ticketId',
            model: 'Ticket',
            select: 'title status creationDate description',
            populate: {
              path: 'listOfFiles',
              model: 'File'
            }
          },
          {
            path: 'followUpList',
            model: 'FollowUp'
          },
        ]);
      if (!workOrder) {
        return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
      }

      res.status(200).json({ err: false, message: "Successful operation !", rows: workOrder.reverse() });
    } else {
      const workOrder = await WorkOrder.find({
        employeeId: { $ne: null, $exists: true }
      }).populate(
        [
          {
            path: 'listOfFiles',
            model: 'File',
          },
          {
            path: 'clientId',
            model: 'Client',
            select: 'company',
          },
          {
            path: 'employeeId',
            model: 'Employee',
            select: 'firstName lastName'
          },
          {
            path: 'ticketId',
            model: 'Ticket',
            select: 'title status creationDate description',
            populate: {
              path: 'listOfFiles',
              model: 'File'
            }
          },
          {
            path: 'followUpList',
            model: 'FollowUp'
          },
        ]);
      if (!workOrder) {
        return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
      }

      res.status(200).json({ err: false, message: "Successful operation !", rows: workOrder.reverse() });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: true, message: error.message });
  }
};



// returns non-expired workOrders
exports.getNonExpiredWorkOrders = async (req, res) => {
  const clientId = req.params.id;
  try {
    if (clientId) {
      const workOrder = await WorkOrder.find({
        clientId: clientId,
        $and: [
        {isFollowUp: false},
        {$or: [
          { employeeId: null }, // Check if employeeId is null
          { employeeId: { $exists: false } } // Check if employeeId does not exist
        ]}
      ]
      }).populate(
        [
          {
            path: 'listOfFiles',
            model: 'File',
          },
          {
            path: 'clientId',
            model: 'Client',
            select: 'company',
          },
          {
            path: 'employeeId',
            model: 'Employee',
            select: 'firstName lastName'
          },
          {
            path: 'ticketId',
            model: 'Ticket',
            select: 'title status creationDate description',
            populate: {
              path: 'listOfFiles',
              model: 'File'
            }
          },
        ]);
      if (!workOrder) {
        return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
      }

      res.status(200).json({ err: false, message: "Successful operation !", rows: workOrder });
    } else {
      const workOrder = await WorkOrder.find({
        $and: [
        {isFollowUp: false},
        {$or: [
          { employeeId: null }, // Check if employeeId is null
          { employeeId: { $exists: false } } // Check if employeeId does not exist
        ]}
      ]
      }).populate(
        [
          {
            path: 'listOfFiles',
            model: 'File',
          },
          {
            path: 'clientId',
            model: 'Client',
            select: 'company',
          },
          {
            path: 'employeeId',
            model: 'Employee',
            select: 'firstName lastName'
          },
          {
            path: 'ticketId',
            model: 'Ticket',
            select: 'title status creationDate description',
            populate: {
              path: 'listOfFiles',
              model: 'File'
            }
          },
          {
            path: 'followUpList',
            model: 'FollowUp'
          },
        ]);
      if (!workOrder) {
        return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
      }

      res.status(200).json({ err: false, message: "Successful operation !", rows: workOrder });
    }

  } catch (error) {

  }
};

// upload files
exports.uploadFiles = async (req, res) => {
  try {
    const files = req.files; // Get the array of uploaded files
    const uploadedFiles = [];

    for (const file of files) {
      const newFile = File({
        fileName: file.filename,
        path: file.destination + '/' + file.filename,
        title: req.body.title
      });
      await newFile.save();
      uploadedFiles.push(newFile);
    }
    const workOrder = await WorkOrder.findByIdAndUpdate(
      req.body.workOrderId,
      { $push: { listOfFiles: uploadedFiles } },
      { new: true }
    );
    res.status(200).json({ err: false, message: "Successful operation !", rows: workOrder });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Add FollowUp to a workOrder
exports.addFollowUp = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.body.id);

    const followUp = FollowUp({
      title:workOrder.title, 
      description: workOrder.description, 
      status: workOrder.status,
      signedBy: workOrder.signedBy,
      clientId: workOrder.clientId,
      employeeId: workOrder.employeeId,
      listOfFiles: workOrder.listOfFiles,
      ticketId: workOrder.ticketId,
      creationDate: workOrder.creationDate,
      finishDate: workOrder.finishDate,
      partNum: workOrder.partNum,
      partName: workOrder.partName,
      serialNum: workOrder.serialNum       
    });
    workOrder.followUpList.push(followUp);
    followUp.title += " - "+ workOrder.followUpList.length;
    await followUp.save();
    await workOrder.save();
    const last = false;
    const status = 'Expired';
    const _id = req.body._id;
    const updatedFollowUp = await FollowUp.findByIdAndUpdate(
      { _id },
      { last,status },
      { new: true }
    );
    res.status(200).json({ err: false, message: "Successful operation !", rows: followUp });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// remove FollowUp from a workOrder
exports.removeFollowUp = async (req, res) => {
  const { workOrderId, followUpId } = req.params;
  try {
    await FollowUp.findByIdAndDelete(followUpId);
    const workOrder = await WorkOrder.findByIdAndUpdate(
      workOrderId,
      { $pull: { followUpList: followUpId } },
      { new: true }
    );
    res.status(200).json({ err: false, message: "Successful operation !", rows: workOrder });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};


// Update a user still working on it username
exports.updateWorkOrder = async (req, res) => {
  try {
    const {
      _id, title, clientId, status, description, employeeId, partName, partNum, serialNum, logo, signedBy
    } = req.body;
    const updatedWorkOrder = await WorkOrder.findByIdAndUpdate(
      { _id },
      { title, clientId, status, description, employeeId, partName, partNum, serialNum, logo, signedBy },
      { new: true }
    );
    if (!updatedWorkOrder) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    //mailer uncomment and replace admin to use
    // if (employeeId){
    // const employee = await Employee.findById(employeeId);
    // const to = employee.email; // tech email
    // const subject = 'WorkOrder - '+partOrder._id;
    // const text = 'You just got assigned a new WorkOrder.';
    // await sendEmail(to ,subject, text);
    // const client = await Client.findById(clientId);
    //  const to2 = client.email; // tech email
    //  const subject2 = 'PartOrder - '+partOrder._id;
    //  const text2 = 'PartOrder created successfully.';
    //  await sendEmail(to2 ,subject2, text2);
    // }

    res.status(200).json({ err: false, message: "Successful operation !", rows: updatedWorkOrder });
  } catch (err) {
    console.error(error);
    res.status(500).json({ err: true, message: error.message });
  }
};

// Delete a workOrder
exports.deleteWorkOrder = async (req, res) => {
  const workOrderId = req.params.id;
  try {
    const workOrder = await WorkOrder.findByIdAndDelete(workOrderId);
    if (!workOrder) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }

    res.status(200).json({ err: false, message: "Successful operation !", rows: workOrder });
  } catch (err) {
    res.status(500).json({ err: true, message: error.message });
  }
}