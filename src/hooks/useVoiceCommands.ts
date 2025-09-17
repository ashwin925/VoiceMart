import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useSpeechRecognition } from './useSpeechRecognition';

export const useVoiceCommands = () => {
  const { state, dispatch } = useAppContext();
  const { isCommandMode } = state;
  const navigate = useNavigate();
  const commandModeRef = useRef(isCommandMode);

  // Keep ref in sync with state
  useEffect(() => {
    commandModeRef.current = isCommandMode;
    console.log('Command mode ref updated to:', isCommandMode);
  }, [isCommandMode]);

  // Process voice commands
  const processCommand = useCallback((transcript: string, isFinal: boolean) => {
    if (!isFinal) return;

    const command = transcript.toLowerCase().trim();

    // Get current state directly from context to avoid stale closure
    const currentState = state;
    console.log('Processing voice command:', command, 'Command mode:', currentState.isCommandMode);

    // Activation commands (work even when command mode is off)
    if (command.includes('listen now') || command.includes('start listening')) {
      console.log('Activating command mode, current state:', currentState.isCommandMode, 'ref:', commandModeRef.current);
      dispatch({ type: 'SET_COMMAND_MODE', payload: true });
      commandModeRef.current = true; // Update ref immediately
      console.log('Command mode activated, ref now:', commandModeRef.current);
      speak('Voice commands activated. I\'m listening for your commands.');
      return;
    }

    // Commands that only work when command mode is active
    // Use ref for more immediate state check
    if (!commandModeRef.current && !currentState.isCommandMode) {
      console.log('Command mode not active, ignoring command:', command, 'ref:', commandModeRef.current, 'state:', currentState.isCommandMode);
      return;
    }

    // Deactivation commands
    if (command.includes('stop listening') || command.includes('stop commands')) {
      console.log('Deactivating command mode and stopping recognition');
      dispatch({ type: 'SET_COMMAND_MODE', payload: false });
      commandModeRef.current = false; // Update ref immediately
      speak('Voice commands deactivated.');
      // Also stop the speech recognition
      setTimeout(() => {
        speechRecognition.stopRecognition();
      }, 1000); // Give time for the speech to finish
      return;
    }

    // Basic scroll commands
    if (command.includes('scroll down')) {
      console.log('Executing scroll down - current scroll position:', window.scrollY);
      window.scrollBy({ top: 300, behavior: 'smooth' });
      speak('Scrolling down');
      setTimeout(() => {
        console.log('After scroll down - new scroll position:', window.scrollY);
      }, 500);
      return;
    }

    if (command.includes('scroll up')) {
      console.log('Executing scroll up - current scroll position:', window.scrollY);
      window.scrollBy({ top: -300, behavior: 'smooth' });
      speak('Scrolling up');
      setTimeout(() => {
        console.log('After scroll up - new scroll position:', window.scrollY);
      }, 500);
      return;
    }

    // Help command
    if (command.includes('help') || command.includes('what can i say')) {
      console.log('Providing help');
      speak('You can say: scroll up, scroll down, stop listening, or help.');
      return;
    }

    // Unknown command - be more specific about available commands
    console.log('Unknown command received:', command);
    speak('I didn\'t understand that command. You can say: scroll up, scroll down, stop listening, or help.');
  }, [state, dispatch, navigate]);

  // Text-to-speech function
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Use a more natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.lang.startsWith('en')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Scroll to a specific section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId) || 
                   document.querySelector(`[data-category="${sectionId}"]`) ||
                   document.querySelector(`h2:contains("${sectionId}")`);
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // If section not found, scroll to a reasonable position
      window.scrollBy({ top: 400, behavior: 'smooth' });
    }
  }, []);

  // Perform search
  const performSearch = useCallback((searchTerm: string) => {
    // Focus search input and set value
    const searchInput = document.querySelector('input[name="search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      searchInput.value = searchTerm;
      
      // Trigger search form submission
      const form = searchInput.closest('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    }
  }, []);

  // Initialize speech recognition with command processing
  const speechRecognition = useSpeechRecognition({
    continuous: true,
    interimResults: true,
    onResult: processCommand,
    onError: (error) => {
      console.error('Voice recognition error:', error);
      dispatch({ type: 'SET_ERROR', payload: error });
    }
  });

  // Load voices when they become available
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      
      // Load voices immediately if available
      loadVoices();
      
      // Also load when voices change (some browsers load them asynchronously)
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, []);

  return {
    ...speechRecognition,
    speak,
    processCommand,
    isCommandMode
  };
};
