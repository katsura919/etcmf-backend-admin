const Admin = require("../models/adminSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registerAdmin = async (req, res) => {
  try {
    const { firstname, lastname, middlename, email, password, picture } = req.body;

    let admin = await Admin.findOne({ email });
    if (admin) return res.status(400).json({ message: "Admin already exists" });

    admin = new Admin({
      firstname,
      lastname,
      middlename,
      email,
      password,
      picture: picture || '', 
    });

    await admin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      admin: {
        id: admin._id,
        firstname: admin.firstname,
        lastname: admin.lastname,
        middlename: admin.middlename,
        email: admin.email,
        picture: admin.picture,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



module.exports = {
  registerAdmin,
  loginAdmin,
};
