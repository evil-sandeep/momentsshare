import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, X, CheckCircle2, AlertCircle,
  Link2, Copy, Check, ImagePlus, Loader2, QrCode, Clock, Download, Crown,
} from 'lucide-react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';

const MAX_FILES = 30;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/* ── Mobile detection hook ── */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
};

/* ── Pixel sparkle decorations ── */
const SparkleRed = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <rect x="12" y="0"  width="4" height="4" fill="#FF2222"/>
    <rect x="12" y="24" width="4" height="4" fill="#FF2222"/>
    <rect x="0"  y="12" width="4" height="4" fill="#FF2222"/>
    <rect x="24" y="12" width="4" height="4" fill="#FF2222"/>
    <rect x="12" y="12" width="4" height="4" fill="#FF2222"/>
    <rect x="6"  y="6"  width="2" height="2" fill="#FF2222" opacity="0.6"/>
    <rect x="20" y="6"  width="2" height="2" fill="#FF2222" opacity="0.6"/>
    <rect x="6"  y="20" width="2" height="2" fill="#FF2222" opacity="0.6"/>
    <rect x="20" y="20" width="2" height="2" fill="#FF2222" opacity="0.6"/>
  </svg>
);

const SparkleYellow = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <rect x="12" y="0"  width="4" height="4" fill="#FFD700"/>
    <rect x="12" y="24" width="4" height="4" fill="#FFD700"/>
    <rect x="0"  y="12" width="4" height="4" fill="#FFD700"/>
    <rect x="24" y="12" width="4" height="4" fill="#FFD700"/>
    <rect x="12" y="12" width="4" height="4" fill="#FFD700"/>
    <rect x="6"  y="6"  width="2" height="2" fill="#FFD700" opacity="0.6"/>
    <rect x="20" y="6"  width="2" height="2" fill="#FFD700" opacity="0.6"/>
    <rect x="6"  y="20" width="2" height="2" fill="#FFD700" opacity="0.6"/>
    <rect x="20" y="20" width="2" height="2" fill="#FFD700" opacity="0.6"/>
  </svg>
);

/* ─────────────────────────────────────────────
   Step 1: Upload Screen
───────────────────────────────────────────── */
const UploadScreen = ({ onSuccess }) => {
  const isMobile = useIsMobile();
  const [files, setFiles]         = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [error, setError]         = useState(null);

  const onDrop = useCallback((accepted) => {
    setError(null);
    const remaining = MAX_FILES - files.length;
    if (remaining <= 0) { setError(`Maximum ${MAX_FILES} images allowed.`); return; }
    const toAdd = accepted.slice(0, remaining).map(f =>
      Object.assign(f, { preview: URL.createObjectURL(f), status: 'pending' })
    );
    if (accepted.length > remaining)
      setError(`Only ${remaining} more image(s) can be added (max ${MAX_FILES}).`);
    setFiles(prev => [...prev, ...toAdd]);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: MAX_FILES, disabled: uploading,
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
    setUploading(true); setProgress(0); setError(null);
    const formData = new FormData();
    files.forEach(f => formData.append('images', f));
    formData.append('title', `SnapShare_${Date.now()}`);
    try {
      const progressInterval = setInterval(() => setProgress(p => Math.min(p + 2, 90)), 80);
      const res = await axios.post(`${API_URL}/upload-gallery`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => onSuccess(res.data.galleryId, files.length, res.data.expiresAt), 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
      setUploading(false); setProgress(0);
    }
  };

  const headingSize   = isMobile ? '0.75rem' : 'clamp(1.2rem, 4.5vw, 2.6rem)';
  const sparkleSize   = isMobile ? 16 : 28;
  const dropzonePy    = isMobile ? 24 : 48;
  const iconBoxSize   = isMobile ? 44 : 56;

  return (
    <div style={{
      height: '100dvh', width: '100%', background: '#000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? '16px 16px' : '24px',
      overflow: 'hidden', boxSizing: 'border-box',
    }}>

      {/* ── SNAPSHARE badge ── */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ marginBottom: isMobile ? 12 : 20 }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: isMobile ? '6px 14px' : '7px 18px',
          borderRadius: 999, border: '1.5px solid #FFD700', background: '#0a0a00',
        }}>
          <span style={{ color: '#FFD700', fontSize: isMobile ? 11 : 13 }}>⚡</span>
          <span className="font-pixel" style={{
            color: '#FFD700',
            fontSize: isMobile ? '0.38rem' : '0.48rem',
            letterSpacing: '0.18em',
          }}>
            SNAPSHARE
          </span>
        </div>
      </motion.div>

      {/* ── Heading ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.05 }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: isMobile ? 6 : 12, marginBottom: isMobile ? 8 : 10,
          width: '100%',
        }}
      >
        <SparkleRed size={sparkleSize} />
        <h1 className="font-pixel" style={{
          fontSize: headingSize,
          lineHeight: 1.2,
          letterSpacing: '0.04em',
          textAlign: 'center',
          margin: 0,
        }}>
          <span style={{ color: '#FF2222' }}>SHARE YOUR </span>
          <span style={{ color: '#FFD700' }}>MOMENTS</span>
        </h1>
        <SparkleYellow size={sparkleSize} />
      </motion.div>

      {/* ── Subtitle ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{ textAlign: 'center', marginBottom: isMobile ? 14 : 24, lineHeight: 1.6 }}
      >
        <p style={{ color: '#cccccc', fontSize: isMobile ? '0.75rem' : '0.88rem', margin: 0 }}>
          Upload up to {MAX_FILES} photos — get an instant QR code and
        </p>
        <p style={{ color: '#FFD700', fontSize: isMobile ? '0.75rem' : '0.88rem', margin: 0 }}>
          shareable link.
        </p>
      </motion.div>

      {/* ── Drop Zone ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.45 }}
        style={{ width: '100%', maxWidth: isMobile ? '100%' : 680, marginBottom: 10 }}
      >
        <div
          {...getRootProps()}
          style={{
            cursor: 'pointer',
            borderRadius: 18,
            border: `2px dashed ${isDragActive ? '#FFD700' : '#FF2222'}`,
            background: isDragActive ? 'rgba(255,34,34,0.04)' : 'transparent',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: isMobile ? 10 : 16,
            paddingTop: dropzonePy, paddingBottom: dropzonePy,
            paddingLeft: 16, paddingRight: 16,
            transition: 'all 0.25s',
            opacity: uploading ? 0.6 : 1,
            pointerEvents: uploading ? 'none' : 'auto',
          }}
        >
          <input {...getInputProps()} />
          <div style={{
            width: iconBoxSize, height: iconBoxSize,
            border: '2px solid #FF2222', borderRadius: 14,
            background: 'rgba(255,34,34,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ImagePlus size={isMobile ? 20 : 26} color={isDragActive ? '#FFD700' : '#FFD700'} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#FF2222', fontWeight: 700, fontSize: isMobile ? '0.88rem' : '1.05rem', marginBottom: 4 }}>
              {isDragActive ? 'Drop your photos here!' : 'Drag & drop your photos'}
            </p>
            <p style={{ color: '#777', fontSize: isMobile ? '0.78rem' : '0.85rem' }}>
              or <span style={{ color: '#FFD700', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>
                click to browse
              </span>
            </p>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16,
            color: '#555', fontSize: isMobile ? '0.68rem' : '0.78rem',
            flexWrap: 'wrap', justifyContent: 'center',
          }}>
            <span>JPG, PNG, WEBP</span>
            <span style={{ color: '#FF2222', fontSize: '0.55rem' }}>●</span>
            <span>Max {MAX_FILES} images</span>
            <span style={{ color: '#FF2222', fontSize: '0.55rem' }}>●</span>
            <span style={{ color: files.length >= MAX_FILES ? '#FF2222' : '#555' }}>
              {files.length}/{MAX_FILES} selected
            </span>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: 8, display: 'flex', alignItems: 'center', gap: 8,
              color: '#FF4444', fontSize: '0.8rem',
              background: 'rgba(255,34,34,0.08)', border: '1px solid rgba(255,34,34,0.2)',
              borderRadius: 10, padding: '8px 12px',
            }}
          >
            <AlertCircle size={14} /> {error}
          </motion.div>
        )}
      </motion.div>

      {/* ── Preview grid (when files selected) ── */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ width: '100%', maxWidth: isMobile ? '100%' : 680, marginBottom: 10 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#777', fontSize: '0.75rem' }}>
                {files.length} photo{files.length !== 1 ? 's' : ''} ready
              </span>
              {files.length < MAX_FILES && (
                <span style={{ color: '#444', fontSize: '0.72rem' }}>{MAX_FILES - files.length} more</span>
              )}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? 50 : 60}px, 1fr))`,
              gap: 6,
            }}>
              <AnimatePresence>
                {files.map((file, idx) => (
                  <motion.div
                    key={file.name + idx}
                    layout
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="group"
                    style={{ position: 'relative', aspectRatio: '1', borderRadius: 8, overflow: 'hidden', background: '#111', border: '1px solid #222' }}
                  >
                    <img src={file.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {!uploading && (
                      <button
                        onClick={() => removeFile(idx)}
                        style={{
                          position: 'absolute', top: 2, right: 2,
                          width: 16, height: 16, borderRadius: '50%',
                          background: 'rgba(0,0,0,0.8)', border: 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={8} color="#fff" />
                      </button>
                    )}
                    {uploading && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Loader2 size={12} className="animate-spin" color="#FF2222" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Upload button ── */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ width: '100%', maxWidth: isMobile ? '100%' : 680, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
          >
            {uploading && (
              <div style={{ width: '100%', height: 3, background: '#1a1a1a', borderRadius: 999, overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', background: 'linear-gradient(to right, #FF2222, #FFD700)', borderRadius: 999 }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: isMobile ? '11px 32px' : '12px 48px',
                borderRadius: 12, fontWeight: 700, fontSize: '0.85rem',
                width: isMobile ? '100%' : 'auto',
                background: uploading ? '#1a1a1a' : '#FF2222',
                color: uploading ? '#444' : '#fff',
                cursor: uploading ? 'not-allowed' : 'pointer',
                boxShadow: uploading ? 'none' : '0 0 24px rgba(255,34,34,0.35)',
                border: 'none',
              }}
            >
              {uploading
                ? <><Loader2 size={16} className="animate-spin" /> Uploading {progress}%...</>
                : <><Upload size={16} /> Upload {files.length} Photo{files.length !== 1 ? 's' : ''}</>
              }
            </button>
            {!uploading && (
              <button onClick={() => setFiles([])} style={{ color: '#444', fontSize: '0.72rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                Clear all
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom decoration ── */}
      {files.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: isMobile ? 14 : 20 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span className="font-pixel" style={{ color: '#FFD700', fontSize: isMobile ? '0.32rem' : '0.42rem', letterSpacing: '0.22em' }}>
              YOUR GALLERY
            </span>
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: 'rgba(255,34,34,0.15)', border: '1.5px solid #FF2222',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Crown size={12} color="#FF2222" />
            </div>
            <span className="font-pixel" style={{ color: '#FFD700', fontSize: isMobile ? '0.32rem' : '0.42rem', letterSpacing: '0.22em' }}>
              DELIVERED INSTANTLY ✦
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};


/* ─────────────────────────────────────────────
   Step 2: Share / QR Screen
───────────────────────────────────────────── */
const ShareScreen = ({ galleryId, imageCount, expiresAt, onReset }) => {
  const isMobile = useIsMobile();
  const shareUrl = `${window.location.origin}/gallery/${galleryId}`;
  const [copied, setCopied] = useState(false);
  const qrRef = useRef();

  const expiryDate = expiresAt
    ? new Date(expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '7 days from now';

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2500);
    });
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const a = document.createElement('a');
    a.href = pngUrl; a.download = `snapshare-qr-${galleryId}.png`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const qrSize = isMobile ? 130 : 150;

  return (
    <div style={{
      height: '100dvh', width: '100%', background: '#000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? '16px' : '20px 24px',
      overflow: 'hidden', boxSizing: 'border-box',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        style={{ width: '100%', maxWidth: isMobile ? '100%' : 800 }}
      >
        {/* ── Success header ── */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 14 : 18 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: isMobile ? 38 : 44, height: isMobile ? 38 : 44,
              borderRadius: '50%', marginBottom: 8,
              background: 'linear-gradient(135deg, #FF2222, #FFD700)',
              boxShadow: '0 0 24px rgba(255,34,34,0.4)',
            }}
          >
            <CheckCircle2 size={isMobile ? 18 : 22} color="#fff" />
          </motion.div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h2 className="font-pixel" style={{ color: '#FFD700', fontSize: isMobile ? '0.55rem' : '0.75rem', letterSpacing: '0.06em', margin: 0 }}>
              GALLERY CREATED!
            </h2>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'rgba(255,170,0,0.1)', border: '1px solid rgba(255,170,0,0.25)',
              color: '#FFAA00', fontSize: '0.68rem', borderRadius: 20, padding: '2px 10px',
            }}>
              <Clock size={9} /> Expires {expiryDate}
            </div>
          </div>
          <p style={{ color: '#555', fontSize: '0.75rem', marginTop: 4 }}>
            {imageCount} photo{imageCount !== 1 ? 's' : ''} uploaded · Share with anyone
          </p>
        </div>

        {/* ── Main content: QR + Info (side-by-side on desktop, stacked on mobile) ── */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 12 : 16,
          alignItems: isMobile ? 'center' : 'stretch',
        }}>

          {/* QR Card */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : -16, y: isMobile ? 10 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: 18,
              padding: isMobile ? '14px 20px' : '20px 24px',
              display: 'flex', flexDirection: isMobile ? 'row' : 'column',
              alignItems: 'center', gap: isMobile ? 14 : 12,
              flexShrink: 0,
              width: isMobile ? '100%' : 'auto',
            }}
          >
            <div ref={qrRef} style={{ padding: 8, background: '#fff', borderRadius: 10, flexShrink: 0 }}>
              <QRCodeCanvas
                value={shareUrl}
                size={qrSize}
                bgColor="#ffffff" fgColor="#000000"
                level="H" includeMargin={false}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: isMobile ? 'flex-start' : 'center' }}>
              <div className="font-pixel" style={{ color: '#FF2222', fontSize: '0.36rem', letterSpacing: '0.14em', display: 'flex', alignItems: 'center', gap: 5 }}>
                <QrCode size={10} /> SCAN TO OPEN
              </div>
              <button
                onClick={downloadQRCode}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 8,
                  background: '#111', color: '#888', border: '1px solid #2a2a2a',
                  fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                <Download size={12} color="#FFD700" /> Download
              </button>
            </div>
          </motion.div>

          {/* Right panel */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : 16, y: isMobile ? 10 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, width: isMobile ? '100%' : 'auto' }}
          >
            {/* Shareable link */}
            <div style={{ background: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: 14, padding: '12px 14px' }}>
              <p style={{ color: '#444', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Link2 size={9} /> Shareable Link
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <p style={{
                  flex: 1, fontFamily: 'monospace', fontSize: '0.7rem',
                  color: '#FFD700', background: '#0d0a00',
                  border: '1px solid #2a2000', borderRadius: 8,
                  padding: '7px 10px', margin: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {shareUrl}
                </p>
                <button
                  onClick={copyLink}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '7px 12px', borderRadius: 8, border: 'none',
                    fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0,
                    ...(copied
                      ? { background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)' }
                      : { background: 'rgba(255,34,34,0.1)', color: '#FF4444', border: '1px solid rgba(255,34,34,0.2)' }
                    ),
                  }}
                >
                  {copied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
                </button>
              </div>
            </div>

            <p style={{ color: '#333', fontSize: '0.7rem', textAlign: 'center', margin: 0 }}>
              Anyone with this link or QR code can view the gallery
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, textAlign: 'center', padding: '11px 0',
                  borderRadius: 12, background: '#FF2222', color: '#fff',
                  fontWeight: 900, fontSize: isMobile ? '0.8rem' : '0.85rem',
                  textDecoration: 'none', boxShadow: '0 0 18px rgba(255,34,34,0.3)',
                }}
              >
                Open Gallery →
              </a>
              <button
                onClick={onReset}
                style={{
                  flex: 1, padding: '11px 0', borderRadius: 12,
                  background: '#111', color: '#777',
                  fontWeight: 700, fontSize: isMobile ? '0.8rem' : '0.85rem',
                  border: '1px solid #2a2a2a', cursor: 'pointer',
                }}
              >
                Upload More
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};


/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const UploadPage = () => {
  const [step, setStep]             = useState('upload');
  const [galleryId, setGalleryId]   = useState(null);
  const [imageCount, setImageCount] = useState(0);
  const [expiresAt, setExpiresAt]   = useState(null);

  const handleSuccess = (id, count, expiry) => {
    setGalleryId(id); setImageCount(count); setExpiresAt(expiry); setStep('share');
  };
  const handleReset = () => {
    setGalleryId(null); setImageCount(0); setExpiresAt(null); setStep('upload');
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
