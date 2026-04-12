import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Maximize2, Heart, Sparkles, Loader2, Zap, Clock, ImageOff } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ImageModal from '../components/ImageModal';
import PixelButton from '../components/PixelButton';

const GalleryPage = () => {
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [galleryTitle, setGalleryTitle] = useState('Shared Gallery');
  const [expiresAt, setExpiresAt] = useState(null);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [zipping, setZipping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        if (id) {
          const response = await axios.get(`${apiUrl}/gallery/${id}`);
          setImages(response.data.images || []);
          setGalleryTitle(response.data.title || 'Shared Gallery');
          if (response.data.expiresAt) setExpiresAt(new Date(response.data.expiresAt));
        } else {
          const response = await axios.get(`${apiUrl}/api/images`);
          setImages(response.data);
          setGalleryTitle('Public Archive');
        }
      } catch (error) {
        if (error.response?.status === 410 || error.response?.status === 404) {
          setExpired(true);
        } else {
          console.error('Failed to fetch gallery', error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [id]);

  const handleDownloadAll = async () => {
    if (images.length === 0) return;
    setZipping(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const url = id 
        ? `${apiUrl}/api/images/download-all?galleryId=${id}`
        : `${apiUrl}/api/images/download-all`;
        
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'blob',
      });

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', id ? `snapshare-${galleryTitle}.zip` : 'snapshare-archive.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("ZIP Download failed", error);
      alert("Failed to generate archive.");
    } finally {
      setZipping(false);
    }
  };

  const handleSingleDownload = (img) => {
    const downloadUrl = img.url.replace('/upload/', '/upload/fl_attachment/');
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `${img.title || 'snapshare-image'}.jpg`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };


  // ── Expired Gallery Screen ──────────────────────────────────
  if (expired) {
    return (
      <div className="min-h-screen bg-[#080C10] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          className="text-center max-w-md"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 border border-slate-700 mb-6">
            <ImageOff size={36} className="text-slate-500" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-3">Gallery Not Found</h1>
          <p className="text-slate-400 mb-2">
            This gallery does not exist or has expired and been permanently deleted.
          </p>
          <p className="text-slate-600 text-sm mb-8">
            SnapShare galleries are automatically removed after <span className="text-slate-400 font-semibold">7 days</span>.
          </p>
          <div className="flex items-center justify-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-5 py-3 text-amber-400 text-sm mb-8">
            <Clock size={15} />
            <span>Links and QR codes expire after a set period.</span>
          </div>
          <a
            href="/"
            className="inline-block px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold text-sm hover:shadow-[0_0_30px_rgba(0,245,255,0.3)] hover:scale-105 transition-all duration-200"
          >
            Create a New Gallery →
          </a>
        </motion.div>
      </div>
    );
  }

  // ── Loading Screen ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#080C10] flex items-center justify-center flex-col gap-4">
        <Loader2 className="text-cyan-400 animate-spin" size={40} />
        <p className="font-pixel text-[10px] tracking-widest text-slate-700">EXTRACTING ASSETS...</p>
      </div>
    );
  }

  return (
    <div className="px-8 py-12 max-w-[1600px] mx-auto min-h-screen relative z-10">
      <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <Sparkles className="text-cyan-400" />
            <span className="font-pixel text-xs tracking-widest text-cyan-400 uppercase">
              {id ? 'Shared Archive' : 'Global Mesh'}
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-4 text-white uppercase italic">
            {galleryTitle}
          </h1>
          <p className="text-slate-500 max-w-xl">
            {id 
              ? `Displaying images from the shared cluster. Auto-cleanup scheduled for ${expiresAt?.toLocaleDateString() || '7 days'}.`
              : 'Synchronizing with the global image mesh. Real-time assets extracted from the MongoDB mainframe.'
            }
          </p>
        </div>
        
        <div className="flex gap-4">
          <PixelButton 
            onClick={handleDownloadAll} 
            disabled={zipping || images.length === 0}
            className={`!bg-slate-900 border border-slate-800 hover:!border-cyan-500/50 min-w-[200px] ${zipping ? 'opacity-70' : ''}`}
          >
            {zipping ? (
              <>
                <Loader2 className="animate-spin text-cyan-400" size={18} />
                <span>Creating ZIP...</span>
              </>
            ) : (
              <>
                <Zap className="text-cyan-400" size={18} />
                <span>{id ? 'Download Gallery' : 'Bulk Extract'}</span>
              </>
            )}
          </PixelButton>
        </div>
      </header>

      {images.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex -ml-6 w-auto"
          columnClassName="pl-6 bg-clip-padding"
        >
          {images.map((img, i) => (
            <motion.div
              key={img._id || img.id || i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="mb-6 relative group"
            >
              <div className="relative rounded-2xl overflow-hidden glass border-slate-800 transition-all duration-500 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_30px_rgba(0,245,255,0.1)]">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  src={img.url}
                  alt={img.title || 'Shared Moment'}
                  loading="lazy"
                  className="w-full h-auto object-cover cursor-pointer"
                  onClick={() => setSelectedImage(img)}
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg leading-tight text-white line-clamp-1">
                      {img.title || 'Shared Moment'}
                    </h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleSingleDownload(img); }}
                        className="p-2 glass rounded-lg hover:text-cyan-400 transition-colors"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400 lowercase italic">@{img.user || 'guest'}</p>
                    <button 
                      onClick={() => setSelectedImage(img)}
                      className="flex items-center gap-1 text-xs font-bold text-cyan-400 border-b border-cyan-400/0 hover:border-cyan-400 transition-all"
                    >
                      <Maximize2 size={12} />
                      Expand
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </Masonry>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-40 glass rounded-[2rem] border-slate-800/50 bg-slate-900/10"
        >
          <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-6 border border-slate-700/50">
            <ImageOff className="text-slate-600" size={32} />
          </div>
          <p className="text-slate-400 font-pixel text-[10px] tracking-[0.2em] uppercase mb-4">No Assets Syncing</p>
          <h3 className="text-xl font-bold text-slate-700 mb-8">This cluster segment is currently empty.</h3>
          <a 
            href="/upload" 
            className="px-8 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase hover:bg-cyan-500/20 transition-all"
          >
            Initiate First Sync →
          </a>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedImage && (
          <ImageModal 
            image={{ ...selectedImage, title: selectedImage.title || 'Shared Moment', user: selectedImage.user || 'guest' }} 
            onClose={() => setSelectedImage(null)} 
            onDownload={() => handleSingleDownload(selectedImage)}
          />
        )}
      </AnimatePresence>

      <footer className="mt-20 py-12 border-t border-slate-900/50 text-center">
        <p className="text-slate-600 text-xs uppercase tracking-widest mb-6 font-pixel">Network Synchronized</p>
        <PixelButton 
          className="!bg-slate-900 !text-slate-400 border border-slate-800 hover:!border-cyan-500/50"
          onClick={() => window.location.reload()}
        >
          Sync Manual Cache
        </PixelButton>
      </footer>
    </div>
  );
};

export default GalleryPage;
