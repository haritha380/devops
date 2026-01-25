const Instrument = require('../models/Instrument');

// Get all instruments
exports.getAllInstruments = async (req, res) => {
  try {
    const instruments = await Instrument.find().sort({ createdAt: -1 });
    res.json(instruments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single instrument
exports.getInstrument = async (req, res) => {
  try {
    const instrument = await Instrument.findById(req.params.id);
    if (!instrument) {
      return res.status(404).json({ message: 'Instrument not found' });
    }
    res.json(instrument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create instrument
exports.createInstrument = async (req, res) => {
  try {
    const { name, price, details, image } = req.body;

    if (!name || !price || !details) {
      return res.status(400).json({ message: 'Please provide name, price, and details' });
    }

    const instrument = new Instrument({
      name,
      price,
      details,
      image: image || '',
    });

    const savedInstrument = await instrument.save();
    res.status(201).json(savedInstrument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update instrument
exports.updateInstrument = async (req, res) => {
  try {
    const { name, price, details, image } = req.body;

    const instrument = await Instrument.findById(req.params.id);
    if (!instrument) {
      return res.status(404).json({ message: 'Instrument not found' });
    }

    instrument.name = name || instrument.name;
    instrument.price = price || instrument.price;
    instrument.details = details || instrument.details;
    instrument.image = image !== undefined ? image : instrument.image;
    instrument.updatedAt = Date.now();

    const updatedInstrument = await instrument.save();
    res.json(updatedInstrument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete instrument
exports.deleteInstrument = async (req, res) => {
  try {
    const instrument = await Instrument.findById(req.params.id);
    if (!instrument) {
      return res.status(404).json({ message: 'Instrument not found' });
    }

    await Instrument.findByIdAndDelete(req.params.id);
    res.json({ message: 'Instrument deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
