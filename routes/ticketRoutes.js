const express = require('express');
const {
  searchDriver,
  createDriver,
  searchVehicle,
  createVehicle,
  fetchViolations,
  createTicket,
} = require('../controllers/ticketController');

const router = express.Router();

router.get('/search-driver', searchDriver);
router.post('/create-driver', createDriver);
router.get('/search-vehicle', searchVehicle);
router.post('/create-vehicle', createVehicle);
router.get('/violations', fetchViolations);
router.post('/create-ticket', createTicket);

module.exports = router;
