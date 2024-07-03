const Ticket = require('../models/ticketModel');
const File = require('../models/fileModel');
const checkSLA = require('../middlewares/SLAcheck');
const cron = require('node-cron');
const Client = require('../models/clientModel');
const Contract = require('../models/contractModel');
const Rapport = require('../models/rapportModele');
const Tasks = require('../models/tasksModel');
const Technicien = require('../models/technicienModel');
const Folder = require('../models/folderModel');
const moment = require('moment');
require('moment-timezone');

exports.createTicket = async (req, res) => {

  try {
    const { contractId, neveuxEsclade } = req.body;
    const contract = await Contract.findById(
      contractId)
    let listTems = []
    contract.equipeTechnique.forEach(element => {
      listTems.push(element)
    });
    let Listtech = []
    if (neveuxEsclade == 'level3') { Listtech.push(contract.responsableEquipeTechnique.responsable) }
    else {
      listTems.forEach(element => {
        console.log(element.tech);
        if (neveuxEsclade == 'level1' || neveuxEsclade == 'level2') { Listtech.push(element.tech) }
      });
    }
    // const ticket = Ticket(title,description,neveuxEsclade,clientId,siteId,equipmentSoftId,equipmentHardId)
    const ticket = Ticket(req.body)
    ticket.technicienId = Listtech;
    if (req.files) {
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
      ticket.listOfFiles = uploadedFiles;
    }
    const sla = contract.sla;
    const futureTime = moment().add(sla, 'hours');                                                          // add sla to current time
    const cronPattern = moment(futureTime).format('m H D M d');                                                               //format the futureTime to something understandable by node.cron
    const task = cron.schedule(cronPattern, () => checkSLA(ticket._id), { scheduled: true });
    await ticket.save();
    res.status(200).json({ err: false, message: "Successful operation !", rows: ticket });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.updateTicket = async (req, res) => {
  try {
    const { _id, title, description, neveuxEsclade,siteId ,equipmentSoftId,equipmentHardId, status } = req.body;
    const updatedTicket = await Ticket.findByIdAndUpdate(
      { _id },
      { title, description, neveuxEsclade,siteId ,equipmentSoftId,equipmentHardId, status },
      { new: true }
    );
    if (!updatedTicket) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: updatedTicket });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.getAllTicketByClientIdAndContract = async (req, res) => {
  const clientId = req.params.clientId;
  const contractId = req.params.contractId;
  try {
    const tickets = await Ticket.find({ clientId, contractId })
    .sort({ creationDate: -1 })
    .populate('siteId')
    .populate('equipmentHardId')
    .populate('equipmentSoftId')
    .populate([
      {
        path: 'technicienId',
        model: 'Technicien',
        populate: { path: 'image', model: 'File' },
      },])

    res.status(200).json({ err: false, message: "Successful operation !", rows: tickets });

  } catch (error) {
    res.status(500).json({ err: true, message: error.message });

  }
};




// -----------------------------------------
exports.getTicketByStatus = async (req, res) => {
  const clientId = req.params._id;
  const status = req.params.status;

  try {
    if (!status) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    const ticket = await Ticket.find({ clientId, status });
    if (!ticket) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: ticket });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.getAllTicketByClientId = async (req, res) => {
  const clientId = req.params._id;
  // const status = req.params.status;

  try {
    if (!clientId) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    const ticket = await Ticket.find({ clientId });
    if (!ticket) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: ticket });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.getAllTicketByTechnicienId = async (req, res) => {
  const technicienId = req.params._id;
  // const status = req.params.status;

  try {
    if (!technicienId) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    const ticket = await Ticket.find({ technicienId });
    if (!ticket) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: ticket });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

exports.affecteTechnicienToTicket = async (req, res) => {
  try {
    const { _id, technicienId, status } = req.body;
    const updatedTicket = await Ticket.findByIdAndUpdate(
      { _id },
      { technicienId, status },
      { new: true }
    );
    if (!updatedTicket) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: updatedTicket });
  } catch (err) {
    console.error(error);
    res.status(500).json({ err: true, message: error.message });
  }
};
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
exports.uploadFilesToticket = async (req, res) => {
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
    const ticket = await Ticket.findByIdAndUpdate(
      req.body.ticket_id,
      { $push: { listOfFiles: uploadedFiles } },
      { new: true }
    );
    res.status(200).json({ err: false, message: "Successful operation !", rows: ticket });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.addRapportTicket = async (req, res) => {
  try {
    const { _id, startDate, endDate, technicienId } = req.body;
    const rapport = Rapport({
      startDate: Date(startDate),
      endDate: Date(endDate),
      technicienId: technicienId
    })
    // rapport.listOfTasks = listOfTasks;
    await rapport.save();
    const rapportId = rapport._id;
    const ticketUpdate = await Ticket.findByIdAndUpdate(
      { _id },
      { rapportId },
      { new: true }
    );
    res.status(200).json({ err: false, message: "Successful operation !", rows: ticketUpdate });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.addTasksListRapportTicket = async (req, res) => {
  try {
    let rapport;
    if (req.files) {
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
      const task = Tasks({
        description: req.body.description,
      })
      task.listOfFiles = uploadedFiles;
      task.save();

      //  console.log(await task.save());
      let taskId = task._id.toString();

      rapport = await Rapport.findByIdAndUpdate(
        req.body._id,
        { $push: { listOfTasks: task._id.toString() } },
        { new: true }
      );
    } else {
      const task = Tasks({
        description: req.body.description,
      })
      task.save();
      rapport = await Rapport.findByIdAndUpdate(
        req.body._id,
        { $push: { listOfTasks: task._id.toString() } },
        { new: true }
      );
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: rapport });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};















// upload files







// Add file to a ticket
exports.ticketAddFile = async (req, res) => {
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
    const ticket = await Ticket.findByIdAndUpdate(
      req.body.ticketId,
      { $push: { listOfFiles: uploadedFiles } },
      { new: true }
    );
    res.status(200).json({
      err: false,
      message: "Successful operation !",
      rows: [ticket, files.map(file => file.originalname)]
    });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// remove file to the folder
exports.ticketRemoveFile = async (req, res) => {
  try {
    const file = await File.findByIdAndDelete(req.params.fileId);
    if (!file) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.ticketId,
      { $pull: { listOfFiles: req.params.fileId } },
      { new: true }
    );
    res.status(200).json({ err: false, message: "Successful operation !", rows: ticket });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};


// Get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const ticket = await Ticket.find();
    res.status(200).json({ err: false, message: "Successful operation !", rows: ticket });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Get a single ticket
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('listOfFiles');
    if (!ticket) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: ticket });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Get a ticket by work order id
exports.getTicketByWorkOrderId = async (req, res) => {
  const workOrderId = req.params.id;
  try {
    const ticket = await Ticket.findOne({ workOrderId }).populate(listOfFiles);
    if (!ticket) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: ticket });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Get a ticket by client id
exports.getTicketByClientId = async (req, res) => {
  const clientId = req.params.id;
  try {
    const ticket = await Ticket.find({ clientId });
    if (!ticket) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: ticket });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

exports.countTicketsByClientId = async (req, res) => {
  const clientId = req.params.id;
  try {
    const count = await Ticket.countDocuments({ clientId });
    res.status(200).json({ err: false, message: "Successful operation !", rows: { count, clientId } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: true, message: error.message });
  }
};

// Update a user still working on it username


// Delete a ticket
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.body._id);
    if (!ticket) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }

    res.status(200).json({ err: false, message: "Successful operation !", rows: ticket });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
