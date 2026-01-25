const InstrumentPart = require('../models/InstrumentPart');

// Get all instrument parts
exports.getAllParts = async (req, res) => {
  try {
    const parts = await InstrumentPart.find().sort({ createdAt: -1 });
    res.json(parts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single part
exports.getPart = async (req, res) => {
  try {
    const part = await InstrumentPart.findById(req.params.id);
    if (!part) {
      return res.status(404).json({ message: 'Part not found' });
    }
    res.json(part);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create part
exports.createPart = async (req, res) => {
  try {
    const { name, price, details, image } = req.body;
    
    console.log('Received data:', { name, price, details, image });

    if (!name || !price || !details) {
      return res.status(400).json({ message: 'Please provide name, price, and details' });
    }

    const part = new InstrumentPart({
      name,
      price,
      details,
      image: image || '',
    });

    const savedPart = await part.save();
    console.log('Saved part:', savedPart);
    res.status(201).json(savedPart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update part
exports.updatePart = async (req, res) => {
  try {
    const { name, price, details, image } = req.body;

    const part = await InstrumentPart.findById(req.params.id);
    if (!part) {
      return res.status(404).json({ message: 'Part not found' });
    }

    part.name = name || part.name;
    part.price = price || part.price;
    part.details = details || part.details;
    part.image = image !== undefined ? image : part.image;
    part.updatedAt = Date.now();

    const updatedPart = await part.save();
    res.json(updatedPart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete part
exports.deletePart = async (req, res) => {
  try {
    const part = await InstrumentPart.findById(req.params.id);
    if (!part) {
      return res.status(404).json({ message: 'Part not found' });
    }

    await InstrumentPart.findByIdAndDelete(req.params.id);
    res.json({ message: 'Part deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
