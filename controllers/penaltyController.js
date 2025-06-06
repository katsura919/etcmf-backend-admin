const Penalty = require('../models/penaltySchema');

// Create penalty
const createPenalty = async (req, res) => {
  const penaltyData = req.body;

  try {
    const penalty = new Penalty(penaltyData);
    await penalty.save();
    res.status(201).json({ message: 'Penalty created successfully', penalty });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all penalties
const getAllPenalties = async (req, res) => {
  try {
    const penalties = await Penalty.find();
    res.status(200).json(penalties);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get penalty by ID
const getPenaltyById = async (req, res) => {
  const { id } = req.params;

  try {
    const penalty = await Penalty.findById(id);
    if (!penalty) {
      return res.status(404).json({ message: 'Penalty not found' });
    }
    res.status(200).json(penalty);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update penalty
const updatePenalty = async (req, res) => {
  const { id } = req.params;
  const penaltyData = req.body;

  try {
    const penalty = await Penalty.findByIdAndUpdate(id, penaltyData, { new: true });
    if (!penalty) {
      return res.status(404).json({ message: 'Penalty not found' });
    }
    res.status(200).json({ message: 'Penalty updated successfully', penalty });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete penalty
const deletePenalty = async (req, res) => {
  const { id } = req.params;

  try {
    const penalty = await Penalty.findByIdAndDelete(id);
    if (!penalty) {
      return res.status(404).json({ message: 'Penalty not found' });
    }
    res.status(200).json({ message: 'Penalty deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get penalties for a specific violation
const getPenaltiesByViolation = async (req, res) => {
  const { violationId } = req.params;

  try {
    const penalties = await Penalty.find({ violationId });
    if (penalties.length === 0) {
      return res.status(404).json({ message: 'No penalties found for this violation' });
    }
    res.status(200).json(penalties);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createPenalty,
  getAllPenalties,
  getPenaltyById,
  updatePenalty,
  deletePenalty,
  getPenaltiesByViolation,
};
