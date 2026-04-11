const mongoose = require('mongoose');

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const gallerySchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Gallery' },
  images: [{
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now },

  // TTL field — MongoDB auto-deletes the document when this date passes
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + SEVEN_DAYS_MS),
    index: { expires: 0 }   // TTL index: delete doc when expiresAt is reached
  }
});

module.exports = mongoose.model('Gallery', gallerySchema);
