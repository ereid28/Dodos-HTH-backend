const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  name: String,
  ecoScore: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Score', ScoreSchema);
