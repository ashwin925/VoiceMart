import React, { useEffect } from 'react';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import { useAppContext } from '../context/AppContext';

const VoiceController: React.FC = () => {
  const { state } = useAppContext();
  const { hasMicPermission, isCommandMode } = state;
  const voiceCommands = useVoiceCommands();

  // Auto-start voice recognition when permission is granted
  useEffect(() => {
    if (hasMicPermission && voiceCommands.isSupported) {
      // Small delay to ensure everything is initialized
      const timer = setTimeout(() => {
        if (!voiceCommands.isListening) {
          console.log('VoiceController: Starting voice recognition');
          voiceCommands.startRecognition();
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [hasMicPermission, voiceCommands]);

  // Log command mode changes for debugging
  useEffect(() => {
    console.log('VoiceController: Command mode changed to:', isCommandMode);
  }, [isCommandMode]);

  // Show warning if speech recognition is not supported
  useEffect(() => {
    if (!voiceCommands.isSupported) {
      console.warn('Speech recognition is not supported in this browser');
    }
  }, [voiceCommands.isSupported]);

  // This component doesn't render anything visible
  // It just manages the voice recognition system
  return null;
};

export default VoiceController;
