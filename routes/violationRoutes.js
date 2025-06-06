const express = require('express');
const {
  createViolation,
  getAllViolations,
  getViolationById,
  updateViolation,
  deleteViolation,
  searchViolation
} = require('../controllers/violationController');

const router = express.Router();


router.post('/create', createViolation);
router.get('/search', searchViolation);
router.get('/', getAllViolations);
router.get('/:id', getViolationById);
router.put('/:id', updateViolation);
router.delete('/:id', deleteViolation);


module.exports = router;
