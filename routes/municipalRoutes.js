const express = require('express');
const {
  createMunicipal,
  getAllMunicipals,
  getMunicipalById,
  updateMunicipal,
  deleteMunicipal,
} = require('../controllers/municipalController');
const authMiddleware = require('../middlewares/authMiddleware'); // Import authMiddleware

const router = express.Router();

// Create a new Municipal (no authentication required)
router.post('/', authMiddleware, createMunicipal);

// Get all Municipals (authentication required)
router.get('/', authMiddleware, getAllMunicipals);

// Get a single Municipal by ID (authentication required)
router.get('/:id', authMiddleware, getMunicipalById);

// Update a Municipal by ID (authentication required)
router.put('/:id', authMiddleware, updateMunicipal);

// Delete a Municipal by ID (authentication required)
router.delete('/:id', authMiddleware, deleteMunicipal);

module.exports = router;
