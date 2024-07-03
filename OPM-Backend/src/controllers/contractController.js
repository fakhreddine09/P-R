const Contract = require('../models/contractModel');

//create contract
exports.createContract = async (req, res) => {
  try {
    const contract = Contract(req.body);
    await contract.save();
    res.status(200).json({err: false, message: "Successful operation !", rows: contract});
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Get all contracts
exports.getAllContracts = async (req, res) => {
  try {
    const contract = await Contract.find().populate('employeeId');
    res.status(200).json({err: false, message: "Successful operation !", rows: contract});
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

// Get a single contract
exports.getContractById = async (req, res) => {
    try {
      const contract = await Contract.findById(req.params.id );
      if (!contract) {
        return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
      }
      res.status(200).json({err: false, message: "Successful operation !", rows: contract});
    } catch (error) {
      res.status(500).json({ err: true, message: error.message });
    }
  };
// Update a contract 
exports.updateContract = async (req, res) => {
  try {
    const { _id, terms, type, startDate, endDate, sla, employeeId } = req.body;
    const updatedContract = await Contract.findByIdAndUpdate(
      {_id },
      { terms, type, startDate, endDate, sla, employeeId  },
      { new: true }
    );
    if (!updatedContract) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({err: false, message: "Successful operation !", rows: updatedContract});
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.test = async (req, res) => {
  res.status(200).json("ok");
}
// Delete a contract
exports.deleteContract = async (req, res) => {
  try {
    const contract = await Contract.findOneAndDelete({ email: req.body.contractId });
    if (!contract) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }

    res.status(200).json({err: false, message: "Successful operation !", rows: contract});
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
