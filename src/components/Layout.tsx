import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import VoiceFeedbackOverlay from './VoiceFeedbackOverlay';
import PermissionModal from './PermissionModal';
import VoiceController from './VoiceController';
import ErrorToast from './ErrorToast';
import SkipLink from './SkipLink';
import FocusManager from './FocusManager';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Skip Link for Accessibility */}
      <SkipLink />

      {/* Focus Manager for Keyboard Navigation */}
      <FocusManager />

      {/* Voice Controller - manages voice recognition */}
      <VoiceController />

      {/* Permission Modal */}
      <PermissionModal />

      {/* Voice Feedback Overlay */}
      <VoiceFeedbackOverlay />

      {/* Error Toast */}
      <ErrorToast />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main id="main-content" className="flex-1 pt-16" tabIndex={-1}>
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
