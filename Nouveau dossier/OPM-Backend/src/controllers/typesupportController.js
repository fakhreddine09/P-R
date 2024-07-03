const Typesupport = require('../models/typeSupportModel');
// const Site = require('../models/siteModel');

//create contract
exports.createTypeSupport = async (req, res) => {
  try {
    // const supportName = req.body.supportName;
    const typesupport = Typesupport(req.body);
    await typesupport.save();
    res.status(200).json({ err: false, message: "Successful operation !", rows: typesupport });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.updateTypeSupport= async (req, res) => {
  try {
    const { _id, supportName} = req.body;
    const updateTypeSupport = await Typesupport.findByIdAndUpdate(
      { _id },
      {supportName},
      { new: true }
    );
    if (!updateTypeSupport) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({err: false, message: "Successful operation !", rows: updateTypeSupport });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
// equipmentName version constructure
exports.deleteTypeSupport = async (req, res) => {
  try {
    const typesupport = await Typesupport.findOneAndDelete({ _id: req.body._id });
    if (!typesupport) {
      return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
    }
    res.status(200).json({ err: false, message: "Successful operation !", rows: typesupport });
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};
exports.getAllTypeSupport  = async (req, res) => {
  try {
    const typesupport = await Typesupport.find();
    res.status(200).json({err: false, message: "Successful operation !", rows: typesupport});
  } catch (error) {
    res.status(500).json({ err: true, message: error.message });
  }
};

    // console.log(req.body._id );
