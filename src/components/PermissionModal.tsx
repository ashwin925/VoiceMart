import React, { useEffect, useState } from 'react';
import { Mic, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const PermissionModal: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { hasMicPermission } = state;
  const [showModal, setShowModal] = useState(false);
  const [permissionState, setPermissionState] = useState<'requesting' | 'granted' | 'denied' | 'error'>('requesting');

  useEffect(() => {
    // Show modal on initial load if permission hasn't been determined
    const checkPermission = async () => {
      try {
        if ('permissions' in navigator) {
          const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });

          if (permission.state === 'granted') {
            dispatch({ type: 'SET_MIC_PERMISSION', payload: true });
          } else if (permission.state === 'denied') {
            setShowModal(true);
            setPermissionState('denied');
          } else {
            setShowModal(true);
          }
        } else {
          // Fallback for browsers without permissions API
          setShowModal(true);
        }
      } catch (error) {
        console.error('Error checking microphone permission:', error);
        setShowModal(true);
      }
    };

    if (!hasMicPermission) {
      checkPermission();
    }
  }, [hasMicPermission, dispatch]);

  const requestPermission = async () => {
    setPermissionState('requesting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Permission granted
      stream.getTracks().forEach(track => track.stop()); // Stop the stream
      dispatch({ type: 'SET_MIC_PERMISSION', payload: true });
      setPermissionState('granted');

      setTimeout(() => {
        setShowModal(false);
      }, 1500);

    } catch (error) {
      console.error('Microphone permission denied:', error);
      setPermissionState('denied');
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSkip = () => {
    setShowModal(false);
    // User can still use the site without voice features
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <Mic className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Voice Control Setup
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content based on permission state */}
        {permissionState === 'requesting' && (
          <>
            <div className="mb-4">
              <p className="text-gray-600 mb-3">
                VoiceCart uses voice commands to help you navigate and shop hands-free.
                This is especially helpful for users with mobility impairments.
              </p>
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-blue-900 mb-2">Voice Features:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Navigate categories with voice</li>
                  <li>• Scroll pages hands-free</li>
                  <li>• Search for products by speaking</li>
                  <li>• Complete accessibility support</li>
                </ul>
              </div>
              <p className="text-sm text-gray-500">
                Your voice data is processed locally and never stored or transmitted.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={requestPermission}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Enable Voice Control
              </button>
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Skip
              </button>
            </div>
          </>
        )}

        {permissionState === 'granted' && (
          <div className="text-center">
            <div className="mb-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Voice Control Enabled!
              </h3>
              <p className="text-gray-600">
                You can now use voice commands to navigate VoiceCart.
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Getting started:</strong> Click the microphone icon in the navigation bar,
                then say "listen now" to activate voice commands.
              </p>
            </div>
          </div>
        )}

        {permissionState === 'denied' && (
          <>
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h3 className="font-medium text-gray-900">Microphone Access Denied</h3>
              </div>
              <p className="text-gray-600 mb-3">
                Voice control features are not available without microphone access.
                You can still use VoiceCart with keyboard and mouse navigation.
              </p>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">To enable voice control:</h4>
                <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
                  <li>Click the microphone icon in your browser's address bar</li>
                  <li>Select "Allow" for microphone access</li>
                  <li>Refresh the page</li>
                </ol>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={requestPermission}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Continue Without Voice
              </button>
            </div>
          </>
        )}

        {permissionState === 'error' && (
          <>
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h3 className="font-medium text-gray-900">Setup Error</h3>
              </div>
              <p className="text-gray-600 mb-3">
                There was an error setting up voice control. This might be due to browser
                compatibility or security settings.
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">
                  Voice control requires a modern browser with Web Speech API support.
                  Chrome, Edge, and Safari work best.
                </p>
              </div>
            </div>

            <button
              onClick={handleSkip}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Continue Without Voice Control
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PermissionModal;
