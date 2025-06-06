const Violation = require('../models/violationSchema');
const Penalty = require('../models/penaltySchema');

// Create violation
const createViolation = async (req, res) => {
  const violationData = req.body;

  try {
    const violation = new Violation(violationData);
    await violation.save();
    res.status(201).json({ message: 'Violation created successfully', violation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all violations
const getAllViolations = async (req, res) => {
  try {
    const violations = await Violation.find();
    res.status(200).json(violations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get violation by ID
const getViolationById = async (req, res) => {
  const { id } = req.params;

  try {
    const violation = await Violation.findById(id);
    if (!violation) {
      return res.status(404).json({ message: 'Violation not found' });
    }
    res.status(200).json(violation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update violation
const updateViolation = async (req, res) => {
  const { id } = req.params;
  const violationData = req.body;

  try {
    const violation = await Violation.findByIdAndUpdate(id, violationData, { new: true });
    if (!violation) {
      return res.status(404).json({ message: 'Violation not found' });
    }
    res.status(200).json({ message: 'Violation updated successfully', violation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete violation
const deleteViolation = async (req, res) => {
  const { id } = req.params;

  try {
    const violation = await Violation.findByIdAndDelete(id);
    if (!violation) {
      return res.status(404).json({ message: 'Violation not found' });
    }
    res.status(200).json({ message: 'Violation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};




// Search violation 
const searchViolation = async (req, res) => {
  const { title } = req.query;

  try {
    const violations = await Violation.find({ title: new RegExp(title, 'i') });
    if (violations.length > 0) {
      return res.status(200).json(violations);
    }
    return res.status(404).json({ message: 'No violations found' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createViolation,
  getAllViolations,
  getViolationById,
  updateViolation,
  deleteViolation,
  searchViolation,
};
