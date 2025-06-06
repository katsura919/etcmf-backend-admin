const Driver = require('../models/driverSchema');
const Vehicle = require('../models/vehicleSchema');
const Violation = require('../models/violationSchema');
const Ticket = require('../models/ticketSchema');

// Search driver by license number
const searchDriver = async (req, res) => {
  const { licenseNo } = req.query;

  try {
    const driver = await Driver.findOne({ licenseNo });
    if (driver) {
      return res.status(200).json(driver);
    }
    return res.status(404).json({ message: 'Driver not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create driver profile
const createDriver = async (req, res) => {
  const driverData = req.body;

  try {
    const driver = new Driver(driverData);
    await driver.save();
    res.status(201).json({ message: 'Driver profile created successfully', driver });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Search vehicle by plate number
const searchVehicle = async (req, res) => {
  const { plateNumber } = req.query;

  try {
    const vehicle = await Vehicle.findOne({ plateNumber });
    if (vehicle) {
      return res.status(200).json(vehicle);
    }
    return res.status(404).json({ message: 'Vehicle not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create vehicle information
const createVehicle = async (req, res) => {
  const vehicleData = req.body;

  try {
    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();
    res.status(201).json({ message: 'Vehicle information created successfully', vehicle });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Fetch violation list
const fetchViolations = async (req, res) => {
  try {
    const violations = await Violation.find();
    res.status(200).json(violations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create ticket with selected violations
const createTicket = async (req, res) => {
  const { ticketData, violationIds } = req.body;

  try {
    const ticket = new Ticket(ticketData);
    await ticket.save();

    await Promise.all(
      violationIds.map(async (violationId) => {
        await ticket.updateOne({ $push: { violations: violationId } });
      })
    );

    res.status(201).json({ message: 'Ticket created successfully', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  searchDriver,
  createDriver,
  searchVehicle,
  createVehicle,
  fetchViolations,
  createTicket,
};
