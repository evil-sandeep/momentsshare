import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, X, CheckCircle2, AlertCircle, Sparkles,
  Link2, Copy, Check, ImagePlus, Loader2, QrCode, Clock, Download
} from 'lucide-react';

const GithubIcon = ({ size = 20, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);
import axios from 'axios';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';

const MAX_FILES = 30;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DeveloperCredit = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.5 }}
    whileHover={{ opacity: 1, y: -2 }}
    transition={{ duration: 0.5 }}
    className="fixed bottom-6 flex items-center gap-3 px-4 py-2 rounded-2xl bg-red-950/20 backdrop-blur-md border border-red-900/30 group cursor-pointer"
  >
    <a 
      href="https://github.com/evil-sandeep" 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-3 no-underline"
    >
      <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center group-hover:bg-red-500/10 group-hover:shadow-[0_0_20px_rgba(255,0,0,0.15)] transition-all">
        <GithubIcon size={16} className="text-zinc-500 group-hover:text-primary" />
      </div>
      <div className="flex flex-col">
        <span className="text-[8px] uppercase tracking-widest text-zinc-600 font-bold group-hover:text-red-500 transition-colors">Developed by</span>
        <span className="text-[11px] text-zinc-400 group-hover:text-white font-pixel font-black tracking-tight transition-colors">evil-sandeep</span>
      </div>
    </a>
  </motion.div>
);

// ---------- Step 1: Upload Screen ----------
const UploadScreen = ({ onSuccess }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const onDrop = useCallback((accepted) => {
    setError(null);
    const remaining = MAX_FILES - files.length;
    if (remaining <= 0) {
      setError(`Maximum ${MAX_FILES} images allowed.`);
      return;
    }
    const toAdd = accepted.slice(0, remaining).map(f =>
      Object.assign(f, { preview: URL.createObjectURL(f), status: 'pending' })
    );
    if (accepted.length > remaining) {
      setError(`Only ${remaining} more image(s) can be added (max ${MAX_FILES}).`);
    }
    setFiles(prev => [...prev, ...toAdd]);
  }, [files, uploading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: MAX_FILES,
    disabled: uploading,
  });

  const removeFile = (idx) => {
    setFiles(prev => {
      const next = [...prev];
      URL.revokeObjectURL(next[idx].preview);
      next.splice(idx, 1);
      return next;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    files.forEach(f => formData.append('images', f));
    formData.append('title', `SnapShare_${Date.now()}`);

    try {
      // Simulate progress while uploading
      const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 2, 90));
      }, 80);

      const res = await axios.post(`${API_URL}/upload-gallery`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        onSuccess(res.data.galleryId, files.length, res.data.expiresAt);
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C10] flex flex-col items-center justify-start px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 text-primary text-xs font-bold tracking-widest uppercase mb-5">
          <Sparkles size={12} />
          SnapShare
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-3">
          Share Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5252] to-[#00FAD9]">Moments</span>
        </h1>
        <p className="text-zinc-400 max-w-md mx-auto text-sm md:text-base">
          Upload up to {MAX_FILES} photos — get an instant QR code and shareable link.
        </p>
      </motion.div>

      {/* Drop Zone */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="w-full max-w-3xl mb-6"
      >
        <div
          {...getRootProps()}
          className={`relative cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 p-12 flex flex-col items-center justify-center gap-4
            ${isDragActive
              ? 'border-primary bg-primary/5 scale-[0.99]'
              : 'border-red-950 bg-black/40 hover:border-red-800 hover:bg-black/60'
            }
            ${uploading ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${isDragActive ? 'border-primary bg-primary/10' : 'border-red-950 bg-red-950/20'}`}>
            <ImagePlus size={28} className={isDragActive ? 'text-primary' : 'text-zinc-500'} />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-lg mb-1">
              {isDragActive ? 'Drop your photos here!' : 'Drag & drop your photos'}
            </p>
            <p className="text-zinc-500 text-sm">or <span className="text-primary underline underline-offset-2">click to browse</span></p>
          </div>
          <div className="flex items-center gap-6 text-xs text-zinc-600 mt-2">
            <span>JPG, PNG, WEBP</span>
            <span>•</span>
            <span>Max {MAX_FILES} images</span>
            <span>•</span>
            <span className={files.length >= MAX_FILES ? 'text-primary font-bold' : 'text-zinc-600'}>
              {files.length}/{MAX_FILES} selected
            </span>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-2 text-primary text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2"
          >
            <AlertCircle size={14} /> {error}
          </motion.div>
        )}
      </motion.div>

      {/* Image Preview Grid */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-3xl mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-zinc-300">
                {files.length} photo{files.length !== 1 ? 's' : ''} ready
              </p>
              {files.length < MAX_FILES && (
                <span className="text-xs text-zinc-500">{MAX_FILES - files.length} more can be added</span>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              <AnimatePresence>
                {files.map((file, idx) => (
                  <motion.div
                    key={file.name + idx}
                    layout
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="relative group aspect-square rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700/50"
                  >
                    <img
                      src={file.preview}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Remove button */}
                    {!uploading && (
                      <button
                        onClick={() => removeFile(idx)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                        title="Remove"
                      >
                        <X size={10} />
                      </button>
                    )}
                    {/* Uploading overlay */}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 size={16} className="animate-spin text-red-500" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Button + Progress */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-3xl flex flex-col items-center gap-4"
          >
            {uploading && (
              <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              className={`
                group relative w-full md:w-auto px-12 py-4 rounded-2xl font-bold text-base transition-all duration-300
                flex items-center justify-center gap-3
                ${uploading
                  ? 'bg-zinc-950/40 text-zinc-900 cursor-not-allowed'
                  : 'bg-[#FF5252] text-white hover:shadow-[0_0_40px_rgba(255,82,82,0.35)] hover:scale-[1.02] active:scale-[0.98]'
                }
              `}
            >
              {uploading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Uploading {progress}%...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Upload {files.length} Photo{files.length !== 1 ? 's' : ''}
                </>
              )}
            </button>

            {!uploading && (
              <button
                onClick={() => setFiles([])}
                className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Clear all
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state hint */}
      {files.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-zinc-700 text-xs tracking-widest uppercase mt-4"
        >
          Your gallery will be ready instantly ✦
        </motion.p>
      )}

      <DeveloperCredit />
    </div>
  );
};


// ---------- Step 2: Success / Share Screen ----------
const ShareScreen = ({ galleryId, imageCount, expiresAt, onReset }) => {
  const shareUrl = `${window.location.origin}/gallery/${galleryId}`;
  const [copied, setCopied] = useState(false);
  const qrRef = useRef();

  const expiryDate = expiresAt
    ? new Date(expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '7 days from now';

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `snapshare-qr-${galleryId}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="min-h-screen bg-[#080C10] flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="w-full max-w-lg"
      >
        {/* Success badge */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-secondary mb-4 shadow-[0_0_30px_rgba(255,0,0,0.5)]"
          >
            <CheckCircle2 size={32} className="text-white" />
          </motion.div>
          <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Gallery Created!</h2>
          <p className="text-zinc-400 text-sm">
            {imageCount} photo{imageCount !== 1 ? 's' : ''} uploaded · Share with anyone
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 text-amber-400 text-xs">
            <Clock size={11} />
            Expires on {expiryDate}
          </div>
        </div>

        {/* QR Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/60 border border-zinc-700/50 rounded-3xl p-8 mb-4 flex flex-col items-center gap-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 text-red-500 text-xs font-bold tracking-widest uppercase">
            <QrCode size={14} />
            Scan to open gallery
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-6">
            <div ref={qrRef} className="p-4 bg-white rounded-2xl shadow-[0_0_40px_rgba(0,245,255,0.15)]">
              <QRCodeCanvas
                value={shareUrl}
                size={200}
                bgColor="#ffffff"
                fgColor="#FF5252"
                level="H"
                includeMargin={false}
              />
            </div>

              <button
                onClick={downloadQRCode}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold border border-white/10 transition-all duration-200"
              >
                <Download size={16} className="text-red-500" />
                Download PNG
              </button>
          </div>

          <p className="text-zinc-500 text-xs text-center">
            Anyone with this QR code or link can view the gallery
          </p>
        </motion.div>

        {/* Shareable Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900/60 border border-zinc-700/50 rounded-2xl p-4 mb-6 backdrop-blur-sm"
        >
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest mb-2 flex items-center gap-1">
            <Link2 size={11} /> Shareable Link
          </p>
          <div className="flex items-center gap-2">
            <p className="flex-1 text-primary text-sm font-mono truncate bg-red-950/20 px-3 py-2 rounded-xl border border-red-900/20">
              {shareUrl}
            </p>
            <button
              onClick={copyLink}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 shrink-0 ${
                copied
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/10 text-primary border border-red-500/20 hover:bg-red-500/20'
              }`}
            >
              {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
            </button>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-3 rounded-2xl bg-[#FF5252] text-white font-black text-sm hover:shadow-[0_0_30px_rgba(255,82,82,0.3)] hover:scale-[1.02] transition-all duration-200"
          >
            Open Gallery →
          </a>
          <button
            onClick={onReset}
            className="flex-1 py-3 rounded-2xl bg-zinc-800 text-zinc-300 font-bold text-sm hover:bg-zinc-700 transition-all duration-200 border border-zinc-700"
          >
            Upload More Photos
          </button>
        </motion.div>
      </motion.div>
      
      <DeveloperCredit />
    </div>
  );
};


// ---------- Main Component ----------
const UploadPage = () => {
  const [step, setStep] = useState('upload'); // 'upload' | 'share'
  const [galleryId, setGalleryId] = useState(null);
  const [imageCount, setImageCount] = useState(0);
  const [expiresAt, setExpiresAt] = useState(null);

  const handleSuccess = (id, count, expiry) => {
    setGalleryId(id);
    setImageCount(count);
    setExpiresAt(expiry);
    setStep('share');
  };

  const handleReset = () => {
    setGalleryId(null);
    setImageCount(0);
    setExpiresAt(null);
    setStep('upload');
  };

  return (
    <AnimatePresence mode="wait">
      {step === 'upload' ? (
        <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <UploadScreen onSuccess={handleSuccess} />
        </motion.div>
      ) : (
        <motion.div key="share" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ShareScreen galleryId={galleryId} imageCount={imageCount} expiresAt={expiresAt} onReset={handleReset} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadPage;
