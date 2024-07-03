const bcrypt = require('bcrypt');
const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const Client = require('../models/clientModel');
const Technicien = require('../models/technicienModel');
const Contract = require('../models/contractModel');
const Folder = require('../models/folderModel');
const tokenGen = require("../middlewares/tokenMiddleware");
const sendEmail = require('../middlewares/mailer');
const File = require('../models/fileModel');
const emailController = require('./emailController');

exports.register = async (req, res) => {
  const { email, password, authority } = req.body;
  let Model;
  if(authority == 'technician'){
    Model = Technicien;

  }else{
    return res.status(400).json({ message: 'Invalid role' });
  }
  try {
    const userExists = await Model.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Technician already exists' });
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    let obj = (Model) (req.body) ;
    const files = req.files[0]
    const newFile =File({
      fileName: files.filename,
      path: 'http://localhost:3000/'+files.destination + '/' + files.filename,
      title:files.originalname.toString(),
    })
    newFile.save();
    obj.image =newFile._id.toString()
    obj.password = hashedPassword;
    await obj.save();
    res.status(201).json({ message: 'User created successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message});
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    var user = await Admin.findOne({ email });
    if (!user){
    user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }}
    if (user.valid == false) {
      return res.status(404).json({ message: 'account in progress' });
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }
    var contract;
    var folder ;
    var nameFolder = null
    if (user.authority == "client"){
      contract = await Contract.findById(user.contractId);
      folder = await Folder.find({clientId:user._id})
       nameFolder =folder[0].name 
    }
  
    const payload = {user, contract,folder:nameFolder};
    const { accessToken, refreshToken } = await tokenGen.generateToken(user);
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    //res.setHeader('Refresh-Token', refreshToken); it will be sent with httpOnly cookie 
    res.status(200).json({ message: 'Login successful', payload, accessToken, refreshToken});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

exports.verify = async (req, res, next) => {
  try {
    if (!req.headers.authorization){
      throw("invalid token");
    }
    const token = req.headers.authorization.split(' ')[1];
    const { tokenDetails, message ,error } = await tokenGen.verifyToken(token);
    if(error){
      res.status(500).json({ message: message });
      return;
    }
    res.setHeader('Authorization', `Bearer ${tokenDetails.AccessToken}`);
    next();
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const { message } = await tokenGen.deleteToken(token);
    res.status(200).json({err: false, message: "Successful operation !"  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};
exports.updateEtatUsers = async (req, res) => {
    try {
      const { _id, valid } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        {_id },
        { valid },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ err: true, message: "No (data,operation) (found,done) ! " });
      }
      res.status(200).json({err: false, message: "Successful operation !", rows: updatedUser});
    } catch (error) {
      res.status(500).json({ err: true, message: error.message });
    }
};


exports.sendEmail = async (req, res) => {
  const receiver = "mohamedali.jbeli@prologic.com.tn";
  const subject = "Compte crée avec succès";
  const content = "Bonjour, votre compte a été créé avec succès, en attente de validation.";
  emailController.nodeMal(req, res, receiver, subject, content);
}