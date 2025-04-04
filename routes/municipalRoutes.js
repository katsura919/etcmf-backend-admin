const express = require('express');
const {
  createMunicipal,
  getAllMunicipals,
  getMunicipalById,
  updateMunicipal,
  deleteMunicipal,
} = require('../controllers/municipalController');
const authMiddleware = require('../middlewares/authMiddleware'); 

const router = express.Router();

router.post('/', authMiddleware, createMunicipal);

router.get('/', authMiddleware, getAllMunicipals);

router.get('/:id', authMiddleware, getMunicipalById);

router.put('/:id', authMiddleware, updateMunicipal);

router.delete('/:id', authMiddleware, deleteMunicipal);

module.exports = router;
