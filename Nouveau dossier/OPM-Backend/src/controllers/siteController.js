const Site = require('../models/siteModel');
const Folder = require('../models/folderModel');

exports.getListSiteByContract = async (req, res) => {
    try {
     const folder = await Folder.find({contractId:req.params._id}).populate('listSite').select('listSite')

      res.status(200).json({ err: false, message: "Successful operation!", rows: folder[0].listSite });
    } catch (error) {
      res.status(500).json({ err: true, message: error.message });
    }
  };
  