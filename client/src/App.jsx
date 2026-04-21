import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Feed from './pages/Feed';
import UploadPage from './pages/UploadPage';
import GalleryPage from './pages/GalleryPage';
import LandingSplash from './pages/LandingSplash';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import PageWrapper from './components/PageWrapper';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

/* ── GitHub icon SVG ── */
const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
  </svg>
);

/* ── Portfolio (Globe) icon SVG ── */
const GlobeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

/* ── Fixed bottom-right developer badge ── */
const DeveloperBadge = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 0.7, y: 0 }}
    whileHover={{ opacity: 1 }}
    transition={{ duration: 0.4, delay: 0.8 }}
    style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 8,
    }}
  >
    {/* Label */}
    {/* <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 8,
      background: 'rgba(10,10,10,0.7)',
      border: '1px solid rgba(255,215,0,0.15)',
      backdropFilter: 'blur(8px)',
    }}> */}
    {/* <span style={{ fontSize: '0.58rem', color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}></span>
      // <span style={{ fontSize: '0.7rem', color: '#FFD700', fontWeight: 800, letterSpacing: '0.04em' }}></span> */}
    {/* </div> */}

    {/* Icon row */}
    <div style={{ display: 'flex', gap: 8 }}>
      {/* GitHub */}
      <motion.a
        href="https://github.com/evil-sandeep"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.12, y: -2 }}
        title="GitHub"
        style={{
          width: 36, height: 36,
          borderRadius: 10,
          background: 'rgba(10,10,10,0.85)',
          border: '1px solid #FF2222',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#FFD700',
          cursor: 'pointer',
          textDecoration: 'none',
        }}
      >
        <GitHubIcon />
      </motion.a>

      {/* Portfolio */}
      <motion.a
        href="https://sandeep-lilac.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.12, y: -2 }}
        title="Portfolio"
        style={{
          width: 36, height: 36,
          borderRadius: 10,
          background: 'rgba(10,10,10,0.85)',
          border: '1px solid #FF2222',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#FFD700',
          cursor: 'pointer',
          textDecoration: 'none',
        }}
      >
        <GlobeIcon />
      </motion.a>
    </div>
  </motion.div>
);

function App() {
  const location = useLocation();

  React.useEffect(() => {
    const trackVisitor = async () => {
      let visitorId = localStorage.getItem('snapshare_vid');
      if (!visitorId) {
        visitorId = uuidv4();
        localStorage.setItem('snapshare_vid', visitorId);
      }
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await axios.post(`${apiUrl}/api/analytics/track`, { type: 'visit', visitorId });
      } catch (err) {
        // silently fail
      }
    };
    trackVisitor();
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#000', overflow: 'hidden', color: '#fff' }}>
      {/* Fixed bottom-right developer signature */}
      <DeveloperBadge />

      {/* Page content */}
      <div style={{ position: 'relative', zIndex: 10, height: '100%', overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Home & Upload */}
            <Route path="/" element={
              <PageWrapper><UploadPage /></PageWrapper>
            } />
            <Route path="/upload" element={
              <PageWrapper><UploadPage /></PageWrapper>
            } />

            {/* Browse / Dashboard */}
            <Route path="/feed" element={
              <PageWrapper><Feed /></PageWrapper>
            } />

            {/* Gallery Pages */}
            <Route path="/gallery/:id" element={
              <PageWrapper><GalleryPage /></PageWrapper>
            } />
            <Route path="/gallery" element={
              <PageWrapper><GalleryPage /></PageWrapper>
            } />

            {/* Analytics & System */}
            <Route path="/analytics" element={
              <PageWrapper><AnalyticsDashboard /></PageWrapper>
            } />
            <Route path="/qr" element={<LandingSplash />} />

            {/* Fallback */}
            <Route path="*" element={
              <PageWrapper>
                <div className="flex flex-col items-center justify-center h-screen text-center px-4">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                    style={{ background: '#0a0a0a', border: '1px solid #222' }}>
                    <span className="text-4xl font-bold" style={{ color: '#333' }}>404</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
                  <p className="max-w-sm mx-auto mb-8" style={{ color: '#555' }}>
                    The page you're looking for doesn't exist or has been moved.
                  </p>
                  <a href="/" className="px-6 py-2.5 rounded-xl font-bold text-white transition-all hover:opacity-80"
                    style={{ background: '#FF2222' }}>
                    Go Home
                  </a>
                </div>
              </PageWrapper>
            } />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
