import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Feed from './pages/Feed';
import UploadPage from './pages/UploadPage';
import GalleryPage from './pages/GalleryPage';
import LandingSplash from './pages/LandingSplash';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import PageWrapper from './components/PageWrapper';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Routes that should NOT show the sidebar (full-screen experiences)
const FULL_SCREEN_ROUTES = ['/', '/upload'];

function App() {
  const location = useLocation();
  const isFullScreen = FULL_SCREEN_ROUTES.includes(location.pathname);

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

  // Full-screen layout (no sidebar) — for upload & splash
  if (isFullScreen) {
    return (
      <div className="min-h-screen bg-[#080C10] text-white overflow-x-hidden">
        <div className="bg-grid absolute inset-0 pointer-events-none" />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<UploadPage />} />
            <Route path="/upload" element={<UploadPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    );
  }

  // Standard layout with sidebar
  return (
    <div className="min-h-screen bg-[#0B0F14] text-white flex overflow-hidden">
      <div className="bg-grid absolute inset-0 pointer-events-none" />
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/feed" element={
              <PageWrapper><div className="px-8 py-8"><Feed /></div></PageWrapper>
            } />
            <Route path="/gallery/:id" element={
              <PageWrapper><GalleryPage /></PageWrapper>
            } />
            <Route path="/gallery" element={
              <PageWrapper><GalleryPage /></PageWrapper>
            } />
            <Route path="/qr" element={<LandingSplash />} />
            <Route path="/analytics" element={
              <PageWrapper><AnalyticsDashboard /></PageWrapper>
            } />
            <Route path="*" element={
              <PageWrapper>
                <div className="flex items-center justify-center min-h-[50vh] text-slate-700 text-xs uppercase tracking-widest">
                  Page Not Found
                </div>
              </PageWrapper>
            } />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
