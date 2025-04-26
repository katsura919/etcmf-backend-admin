const Municipal = require('../models/municipalSchema');

// Create a new Municipal
const createMunicipal = async (req, res) => {
  const { name, address } = req.body;

  try {
    const municipal = new Municipal({ name, address });
    await municipal.save();
    res.status(201).json({ message: 'Municipal created successfully', municipal });
  } catch (err) {
    res.status(500).json({ message: 'Error creating municipal', error: err });
  }
};

// Get all Municipals
const getAllMunicipals = async (req, res) => {
  try {
    const municipals = await Municipal.find();
    res.status(200).json(municipals);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching municipals', error: err });
  }
};

// Get a single Municipal by ID
const getMunicipalById = async (req, res) => {
  const { id } = req.params;

  try {
    const municipal = await Municipal.findById(id);
    if (!municipal) {
      return res.status(404).json({ message: 'Municipal not found' });
    }
    res.status(200).json(municipal);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching municipal', error: err });
  }
};

// Update a Municipal by ID
const updateMunicipal = async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;

  try {
    const municipal = await Municipal.findByIdAndUpdate(id, { name, address }, { new: true });
    if (!municipal) {
      return res.status(404).json({ message: 'Municipal not found' });
    }
    res.status(200).json({ message: 'Municipal updated successfully', municipal });
  } catch (err) {
    res.status(500).json({ message: 'Error updating municipal', error: err });
  }
};

// Delete a Municipal by ID
const deleteMunicipal = async (req, res) => {
  const { id } = req.params;

  try {
    const municipal = await Municipal.findByIdAndDelete(id);
    if (!municipal) {
      return res.status(404).json({ message: 'Municipal not found' });
    }
    res.status(200).json({ message: 'Municipal deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting municipal', error: err });
  }
};

module.exports = {
  createMunicipal,
  getAllMunicipals,
  getMunicipalById,
  updateMunicipal,
  deleteMunicipal,
};
