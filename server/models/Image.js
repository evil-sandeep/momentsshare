const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  user: { type: String, default: 'anonymous_creator' },
  likes: { type: String, default: '0' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', imageSchema);
