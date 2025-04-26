const Officer = require('../models/officerSchema'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginOfficer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const officer = await Officer.findOne({ email });

    if (!officer) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, officer.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: officer._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      officer: {
        id: officer._id,
        municipal: officer.municipal,
        role: officer.role,
        firstName: officer.firstName,
        lastName: officer.lastName,
        middleName: officer.middleName,
        address: officer.address,
        contactNo: officer.contactNo,
        email: officer.email,
        picture: officer.picture
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const registerOfficer = async (req, res) => {
    try {
      const {
        municipal,
        role,
        firstName,
        lastName,
        middleName,
        address,
        contactNo,
        email,
        password,
        picture
      } = req.body;
  
      let officer = await Officer.findOne({ email });
      if (officer) return res.status(400).json({ message: "Officer already exists" });
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      officer = new Officer({
        municipal,
        role,
        firstName,
        lastName,
        middleName,
        address,
        contactNo,
        email,
        password: hashedPassword,
        picture
      });
  
      await officer.save();
  
      res.status(201).json({ message: "Officer registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  module.exports = {
    registerOfficer,
    loginOfficer
  };
  