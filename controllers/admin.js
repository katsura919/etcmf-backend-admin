const Admin = require('../models/adminSchema');
const cloudinary = require('../libs/cloudinary'); 


const getAdminData = async (req, res) => {
  try {
    // Get admin ID from the decoded token (set by auth middleware)
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json({
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
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const updateAdminData = async (req, res) => {
  try {
    const { firstname, lastname, middlename, email } = req.body;
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      { firstname, lastname, middlename, email },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json(updatedAdmin);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const changeProfilePicture = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      // Upload file buffer to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'admin_pictures' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer); // upload the buffer!
      });
  
      const updatedAdmin = await Admin.findByIdAndUpdate(
        req.params.id,
        { picture: result.secure_url },
        { new: true }
      );
  
      if (!updatedAdmin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      res.status(200).json({
        message: 'Profile picture updated successfully',
        picture: result.secure_url
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  

module.exports = { getAdminData, updateAdminData, changeProfilePicture };
