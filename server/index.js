const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cron = require('node-cron');
const archiver = require('archiver');
const axios = require('axios');
const Image = require('./models/Image');
const Gallery = require('./models/Gallery');
const Analytics = require('./models/Analytics');
const Visitor = require('./models/Visitor');
const { upload, cloudinary } = require('./config/cloudinaryConfig');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================================
//  CRON JOB — runs every day at midnight (00:00)
//  Finds galleries whose expiresAt <= now, deletes all their
//  Cloudinary images, then removes the MongoDB document.
// ============================================================
cron.schedule('0 0 * * *', async () => {
  console.log('🕐 [CRON] Running daily gallery expiry cleanup...');
  try {
    const now = new Date();
    const expired = await Gallery.find({ expiresAt: { $lte: now } });

    if (expired.length === 0) {
      console.log('✅ [CRON] No expired galleries found.');
      return;
    }

    for (const gallery of expired) {
      // 1. Delete each image from Cloudinary
      const publicIds = gallery.images
        .map(img => img.public_id)
        .filter(Boolean);

      if (publicIds.length > 0) {
        try {
          await cloudinary.api.delete_resources(publicIds);
          console.log(`🗑️  [CRON] Deleted ${publicIds.length} Cloudinary asset(s) for gallery ${gallery._id}`);
        } catch (cloudErr) {
          console.error(`⚠️  [CRON] Cloudinary delete error for gallery ${gallery._id}:`, cloudErr.message);
        }
      }

      // 2. Delete the gallery from MongoDB
      await Gallery.findByIdAndDelete(gallery._id);
      console.log(`✅ [CRON] Gallery ${gallery._id} removed from database.`);
    }

    console.log(`✅ [CRON] Cleanup complete. ${expired.length} expired gallery(ies) deleted.`);
  } catch (err) {
    console.error('❌ [CRON] Error during cleanup:', err.message);
  }
});

// ============================================================
//  ROUTES
// ============================================================

app.get('/', (req, res) => {
  res.json({ message: 'SnapShare API is running 📸' });
});

// GET all images
app.get('/api/images', async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new image record
app.post('/api/images', async (req, res) => {
  const image = new Image({
    title: req.body.title,
    url: req.body.url,
    user: req.body.user,
    likes: req.body.likes || '0'
  });
  try {
    const newImage = await image.save();
    res.status(201).json(newImage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// -----------------------------------------------------------
//  GALLERY ENDPOINTS
// -----------------------------------------------------------

// GET a specific gallery by ID
// Returns 410 Gone if the gallery has expired (or not found)
app.get('/gallery/:id', async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'This gallery does not exist or has been deleted.' 
      });
    }

    // Extra safety check (in case TTL index hasn't fired yet)
    if (gallery.expiresAt && gallery.expiresAt <= new Date()) {
      // Trigger immediate cleanup
      const publicIds = gallery.images.map(img => img.public_id).filter(Boolean);
      if (publicIds.length > 0) {
        cloudinary.api.delete_resources(publicIds).catch(console.error);
      }
      await Gallery.findByIdAndDelete(gallery._id);

      return res.status(410).json({ 
        expired: true,
        message: 'This gallery has expired. Images have been deleted.' 
      });
    }

    res.json(gallery);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid ID', message: 'The provided gallery ID format is invalid.' });
    }
    console.error('Gallery Fetch Error:', err);
    res.status(500).json({ message: 'Internal server error while fetching gallery.' });
  }
});

// POST upload a new gallery (multi-image upload to Cloudinary)
// Images are tagged for easy batch management and auto-expire after 7 days
app.post('/upload-gallery', upload.array('images', 30), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images received.' });
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const imagesData = req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    }));

    const gallery = new Gallery({
      title: req.body.title || `SnapShare_${Date.now()}`,
      images: imagesData,
      expiresAt
    });

    const savedGallery = await gallery.save();

    res.status(201).json({
      message: 'Gallery created successfully.',
      galleryId: savedGallery._id,
      imageCount: savedGallery.images.length,
      expiresAt: savedGallery.expiresAt
    });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------------------------------------
//  ANALYTICS ENDPOINTS
// -----------------------------------------------------------

app.get('/api/analytics', async (req, res) => {
  try {
    let stats = await Analytics.findOne({ id: 'global_stats' });
    if (!stats) {
      stats = new Analytics();
      await stats.save();
    }
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/analytics/track', async (req, res) => {
  try {
    const { type, visitorId } = req.body;
    let stats = await Analytics.findOne({ id: 'global_stats' });
    if (!stats) {
      stats = new Analytics();
      await stats.save();
    }

    if (type === 'view') {
      stats.totalViews += 1;
      await stats.save();
      return res.json({ success: true });
    }

    if (type === 'download') {
      stats.totalDownloads += 1;
      await stats.save();
      return res.json({ success: true });
    }

    if (type === 'visit' && visitorId) {
      const existing = await Visitor.findOne({ visitorId });
      if (!existing) {
        await new Visitor({ visitorId }).save();
        stats.uniqueVisitorsCount += 1;
        await stats.save();
        return res.json({ success: true, isNew: true });
      } else {
        existing.lastSeen = Date.now();
        await existing.save();
        return res.json({ success: true, isNew: false });
      }
    }

    res.status(400).json({ success: false, message: 'Invalid tracking type.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------------------------------------
//  DOWNLOAD ALL as ZIP
// -----------------------------------------------------------

app.get('/api/images/download-all', async (req, res) => {
  try {
    const { galleryId } = req.query;
    let images = [];
    let zipName = 'snapshare-archive.zip';

    if (galleryId) {
      const gallery = await Gallery.findById(galleryId);
      if (!gallery) return res.status(404).json({ message: 'Gallery not found.' });
      images = gallery.images.map(img => ({
        url: img.url,
        title: gallery.title,
        id: img.public_id
      }));
      zipName = `snapshare-${gallery.title.replace(/\s+/g, '_')}.zip`;
    } else {
      images = await Image.find();
      if (images.length === 0) return res.status(404).json({ message: 'No images found.' });
    }

    const archive = archiver('zip', { zlib: { level: 5 } });
    res.attachment(zipName);
    archive.pipe(res);

    for (const img of images) {
      try {
        const response = await axios({ url: img.url, method: 'GET', responseType: 'stream' });
        const cleanTitle = (img.title || 'image').replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
        const filename = `${cleanTitle}_${img.id || img._id}.jpg`;
        archive.append(response.data, { name: filename });
      } catch (e) {
        console.error(`Failed to fetch image for ZIP: ${img.url}`);
      }
    }

    await archive.finalize();
  } catch (err) {
    console.error('ZIP Error:', err.message);
    if (!res.headersSent) res.status(500).json({ message: 'Error generating archive.' });
  }
});

// ============================================================
//  START SERVER
// ============================================================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🕐 Daily cleanup cron job scheduled (runs at midnight)`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });
