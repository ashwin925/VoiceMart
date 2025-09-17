import { useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import type { SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '../types';

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export const useSpeechRecognition = (options: UseSpeechRecognitionOptions = {}) => {
  const { state, dispatch } = useAppContext();
  const { hasMicPermission, isListening } = state;
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isStartingRef = useRef(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldStopRef = useRef(false);
  const keepAliveRef = useRef<NodeJS.Timeout | null>(null);

  const {
    continuous = true,
    interimResults = true,
    lang = 'en-US',
    onResult,
    onError,
    onStart,
    onEnd
  } = options;

  // Initialize speech recognition
  const initializeRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      onError?.('Speech recognition is not supported in this browser');
      return null;
    }

    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionConstructor() as SpeechRecognition;

    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    // Handle results
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const fullTranscript = finalTranscript || interimTranscript;
      console.log('Speech recognition result:', {
        fullTranscript,
        isFinal: !!finalTranscript,
        confidence: event.results[event.resultIndex]?.[0]?.confidence
      });

      dispatch({ type: 'SET_TRANSCRIPT', payload: fullTranscript });

      if (onResult) {
        onResult(fullTranscript, !!finalTranscript);
      }
    };

    // Handle errors
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      
      // Handle specific error types
      switch (event.error) {
        case 'not-allowed':
          dispatch({ type: 'SET_MIC_PERMISSION', payload: false });
          dispatch({ type: 'SET_LISTENING', payload: false });
          onError?.('Microphone access denied. Please allow microphone access and try again.');
          break;
        case 'no-speech':
          // This is normal, just restart if we're supposed to be listening
          if (isListening && continuous) {
            restartRecognition();
          }
          break;
        case 'audio-capture':
          onError?.('No microphone found. Please check your microphone connection.');
          break;
        case 'network':
          onError?.('Network error occurred. Please check your internet connection.');
          break;
        default:
          onError?.(`Speech recognition error: ${event.error}`);
      }
    };

    // Handle start
    recognition.onstart = () => {
      console.log('Speech recognition started');
      isStartingRef.current = false;
      onStart?.();
    };

    // Handle end
    recognition.onend = () => {
      console.log('Speech recognition ended, shouldStop:', shouldStopRef.current, 'isListening:', isListening, 'continuous:', continuous);

      // Auto-restart if we should still be listening and not explicitly stopped
      if (isListening && continuous && !isStartingRef.current && !shouldStopRef.current) {
        console.log('Auto-restarting speech recognition in 500ms');
        restartRecognition();
      } else {
        console.log('Not restarting recognition - shouldStop:', shouldStopRef.current, 'isListening:', isListening, 'isStarting:', isStartingRef.current);
      }

      onEnd?.();
    };

    return recognition;
  }, [continuous, interimResults, lang, onResult, onError, onStart, onEnd, dispatch, isListening]);

  // Restart recognition with a small delay
  const restartRecognition = useCallback(() => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }

    restartTimeoutRef.current = setTimeout(() => {
      if (isListening && recognitionRef.current && !isStartingRef.current && !shouldStopRef.current) {
        try {
          console.log('Attempting to restart speech recognition...');
          isStartingRef.current = true;
          recognitionRef.current.start();
          console.log('Speech recognition restarted successfully');
        } catch (error) {
          console.error('Error restarting recognition:', error);
          isStartingRef.current = false;

          // If we get an error, try to reinitialize and restart
          if (error.message?.includes('already started')) {
            console.log('Recognition already started, continuing...');
            isStartingRef.current = false;
          } else {
            // Try to reinitialize after a longer delay
            setTimeout(() => {
              if (isListening && !shouldStopRef.current) {
                console.log('Reinitializing speech recognition after error...');
                recognitionRef.current = initializeRecognition();
                if (recognitionRef.current) {
                  try {
                    isStartingRef.current = true;
                    recognitionRef.current.start();
                  } catch (retryError) {
                    console.error('Failed to restart after reinitializing:', retryError);
                    isStartingRef.current = false;
                  }
                }
              }
            }, 1000);
          }
        }
      } else {
        console.log('Not restarting - isListening:', isListening, 'hasRecognition:', !!recognitionRef.current, 'isStarting:', isStartingRef.current, 'shouldStop:', shouldStopRef.current);
      }
    }, 500); // Increased delay to 500ms for more reliable restart
  }, [isListening, initializeRecognition]);

  // Keep-alive mechanism to ensure continuous listening
  const setupKeepAlive = useCallback(() => {
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
    }

    // Check every 10 seconds if recognition is still active
    keepAliveRef.current = setInterval(() => {
      if (isListening && !shouldStopRef.current && !isStartingRef.current) {
        // If recognition should be running but isn't, restart it
        if (!recognitionRef.current || recognitionRef.current.readyState === 'inactive') {
          console.log('Keep-alive: Recognition inactive, restarting...');
          restartRecognition();
        }
      }
    }, 10000);
  }, [isListening, restartRecognition]);

  // Start recognition
  const startRecognition = useCallback(() => {
    if (!hasMicPermission) {
      onError?.('Microphone permission required');
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = initializeRecognition();
    }

    if (recognitionRef.current && !isStartingRef.current) {
      try {
        shouldStopRef.current = false; // Reset stop flag
        isStartingRef.current = true;
        recognitionRef.current.start();
        dispatch({ type: 'SET_LISTENING', payload: true });
        console.log('Started speech recognition, shouldStop reset to false');

        // Setup keep-alive mechanism
        setupKeepAlive();
      } catch (error) {
        console.error('Error starting recognition:', error);
        isStartingRef.current = false;
        onError?.('Failed to start voice recognition');
      }
    }
  }, [hasMicPermission, initializeRecognition, dispatch, onError, setupKeepAlive]);

  // Stop recognition
  const stopRecognition = useCallback(() => {
    console.log('Stopping speech recognition explicitly');
    shouldStopRef.current = true; // Set stop flag

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }

    isStartingRef.current = false;
    dispatch({ type: 'SET_LISTENING', payload: false });
    dispatch({ type: 'SET_TRANSCRIPT', payload: '' });
  }, [dispatch]);

  // Toggle recognition
  const toggleRecognition = useCallback(() => {
    if (isListening) {
      stopRecognition();
    } else {
      startRecognition();
    }
  }, [isListening, startRecognition, stopRecognition]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (keepAliveRef.current) {
        clearInterval(keepAliveRef.current);
      }
    };
  }, []);

  // Check browser support
  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  return {
    isSupported,
    isListening,
    startRecognition,
    stopRecognition,
    toggleRecognition,
    transcript: state.transcript
  };
};
