const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const archiver = require('archiver');
const axios = require('axios');
const Image = require('./models/Image');
const Gallery = require('./models/Gallery');
const Analytics = require('./models/Analytics');
const Visitor = require('./models/Visitor');
const { upload } = require('./config/cloudinaryConfig');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'SnapShare API is running... 📸' });
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

// POST a new image
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

// --- GALLERY ENDPOINTS ---

// GET a specific gallery
app.get('/gallery/:id', async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ message: 'Gallery connection lost. Source not found.' });
    }
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST to upload a new gallery (multi-image)
app.post('/upload-gallery', upload.array('images', 100), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No data stream detected. Upload files required.' });
    }

    const imagesData = req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    }));

    const gallery = new Gallery({
      title: req.body.title || `Data_Extract_${Date.now()}`,
      images: imagesData
    });

    const savedGallery = await gallery.save();
    res.status(201).json({ 
      message: 'Gallery synchronized to mainframe.',
      galleryId: savedGallery._id,
      imageCount: savedGallery.images.length
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- ANALYTICS ENDPOINTS ---

// GET analytics data
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

// POST track event
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
      return res.json({ success: true, message: 'View tracked' });
    } 
    
    if (type === 'download') {
      stats.totalDownloads += 1;
      await stats.save();
      return res.json({ success: true, message: 'Download tracked' });
    }
    
    if (type === 'visit' && visitorId) {
      const existingVisitor = await Visitor.findOne({ visitorId });
      
      if (!existingVisitor) {
        // New unique visitor
        const newVisitor = new Visitor({ visitorId });
        await newVisitor.save();
        
        stats.uniqueVisitorsCount += 1;
        await stats.save();
        return res.json({ success: true, message: 'New unique visitor tracked', isNew: true });
      } else {
        // Returning visitor, update lastSeen
        existingVisitor.lastSeen = Date.now();
        await existingVisitor.save();
        return res.json({ success: true, message: 'Returning visitor tracked', isNew: false });
      }
    }

    res.status(400).json({ success: false, message: 'Invalid tracking type or missing data' });

  } catch (err) {
    console.error('Tracking Error:', err);
    res.status(500).json({ message: err.message });
  }
});

// --- ORIGINAL IMAGE ENDPOINTS ---

// DOWNLOAD ALL as ZIP
app.get('/api/images/download-all', async (req, res) => {
  try {
    const images = await Image.find();
    if (images.length === 0) {
      return res.status(404).json({ message: 'No images found to bundle.' });
    }

    const archive = archiver('zip', { zlib: { level: 5 } });
    
    res.attachment('snapshare-archive.zip');
    archive.pipe(res);

    for (const img of images) {
      try {
        const response = await axios({
          url: img.url,
          method: 'GET',
          responseType: 'stream'
        });
        
        // Use title or id for filename, default to .jpg
        const filename = `${img.title.replace(/\s+/g, '_')}_${img._id}.jpg`;
        archive.append(response.data, { name: filename });
      } catch (err) {
        console.error(`Failed to fetch image: ${img.url}`, err.message);
      }
    }

    await archive.finalize();
  } catch (err) {
    console.error('ZIP Error:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error generating archive.' });
    }
  }
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });
