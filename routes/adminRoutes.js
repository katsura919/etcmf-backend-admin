const express = require('express');
const { check } = require('express-validator');
const multer = require('multer');
const { getAdminData, updateAdminData, changeProfilePicture } = require('../controllers/admin');
const validate = require('../middlewares/validate');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Set up multer storage for profile picture uploads
const storage = multer.memoryStorage();

const upload = multer({ storage });

// Validation for updating admin data
const updateAdminValidation = [
  check('firstname').isLength({ min: 1 }).withMessage('First name is required'),
  check('lastname').isLength({ min: 1 }).withMessage('Last name is required'),
  check('email').isEmail().withMessage('Please enter a valid email'),
];


// Route to fetch admin data by ID
router.get('/:id', async (req, res) => {
  try {
    const admin = await getAdminData(req, res);
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching admin data', error: err.message });
  }
});

// Route to update admin data
router.put('/:id', updateAdminValidation, validate, async (req, res) => {
  try {
    const admin = await updateAdminData(req, res);
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Error updating admin data', error: err.message });
  }
});

// Route to change profile picture
router.put(
    '/:id/profile-picture',
    authMiddleware,
    upload.single('picture'),
    changeProfilePicture
  );
  

module.exports = router;
