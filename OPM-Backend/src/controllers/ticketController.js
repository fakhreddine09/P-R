const Ticket = require('../models/ticketModel');
const File = require('../models/fileModel');

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
       req.body.ticketId ,
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
   if (!file){
    return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
   }
      const ticket = await Ticket.findByIdAndUpdate(
        req.params.ticketId ,
        { $pull: { listOfFiles: req.params.fileId } },
        { new: true }
       );
      res.status(200).json({ err: false, message: "Successful operation !", rows: ticket });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const ticket = Ticket(req.body);
    await ticket.save();
    res.status(200).json({err: false, message: "Successful operation !", rows: ticket});
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const ticket = await Ticket.find();
    res.status(200).json({err: false, message: "Successful operation !", rows: ticket});
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
      res.status(200).json({err: false, message: "Successful operation !", rows: ticket});
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
    res.status(200).json({err: false, message: "Successful operation !", rows: ticket});
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
      res.status(200).json({err: false, message: "Successful operation !", rows: ticket});
    } catch (error) {
      res.status(500).json({ err: true, message: error.message });
    }
  };

  exports.countTicketsByClientId = async (req, res) => {
    const clientId = req.params.id;
    try {
      const count = await Ticket.countDocuments({ clientId });
      res.status(200).json({err: false, message: "Successful operation !", rows: {count, clientId} });
    } catch (error) {
      console.error(error);
      res.status(500).json({ err: true, message: error.message });
    }
  };

// Update a user still working on it username
exports.updateTicket = async (req, res) => {
  try {
    const { _id, title, adminId, employeeId, status, description } = req.body;
    const updatedTicket = await Ticket.findByIdAndUpdate(
      { _id },
      { title, adminId, employeeId, status, description },
      { new: true }
    );
    if (!updatedTicket) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({err: false, message: "Successful operation !", rows: updatedTicket });
  } catch (err) {
    console.error(error);
    res.status(500).json({ err: true, message: error.message });
  }
};

// Delete a ticket
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.body._id);
    if (!ticket) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }

    res.status(200).json({err: false, message: "Successful operation !", rows: ticket});
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
