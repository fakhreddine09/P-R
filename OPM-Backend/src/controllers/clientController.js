const Client = require('../models/clientModel');

// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const client = await Client.find();
    res.status(200).json({err: false, message: "Successful operation !", rows: client});
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Get a single clinet 
exports.getClientByEmail = async (req, res) => {
    try {
      const client = await Client.findOne({ email: req.body.email });
      if (!client) {
        return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
      }
      res.status(200).json({err: false, message: "Successful operation !", rows: client});
    } catch (err) {
      res.status(500).json({ err: true, message: error.message });
    }
  };

  exports.getAllClientsByValid = async (req, res) => {
    const { valid } = req.params;

    try {
      if(!valid){
        return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
      }
      const client = await Client.find({valid});
      res.status(200).json({err: false, message: "Successful operation !", rows: client});
    } catch (error) {
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
    res.status(200).json({err: false, message: "Successful operation !", rows: updatedClient });
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

    res.status(200).json({err: false, message: "Successful operation !", rows: client});
  } catch (err) {
    res.status(500).json({ err: true, message: error.message });
  }
};
