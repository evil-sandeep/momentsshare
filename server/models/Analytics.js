const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  id: { type: String, default: 'global_stats' },
  totalViews: { type: Number, default: 0 },
  totalDownloads: { type: Number, default: 0 },
  uniqueVisitorsCount: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', analyticsSchema);
