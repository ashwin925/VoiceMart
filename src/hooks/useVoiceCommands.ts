import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useSpeechRecognition } from './useSpeechRecognition';

export const useVoiceCommands = () => {
  const { state, dispatch } = useAppContext();
  const { isCommandMode } = state;
  const navigate = useNavigate();

  // Process voice commands
  const processCommand = useCallback((transcript: string, isFinal: boolean) => {
    if (!isFinal) return;

    const command = transcript.toLowerCase().trim();
    console.log('Processing voice command:', command);

    // Activation commands (work even when command mode is off)
    if (command.includes('listen now') || command.includes('start listening')) {
      dispatch({ type: 'SET_COMMAND_MODE', payload: true });
      speak('Voice commands activated. I\'m listening for your commands.');
      return;
    }

    // Commands that only work when command mode is active
    if (!isCommandMode) {
      return;
    }

    // Deactivation commands
    if (command.includes('stop listening') || command.includes('stop commands')) {
      dispatch({ type: 'SET_COMMAND_MODE', payload: false });
      speak('Voice commands deactivated.');
      return;
    }

    // Navigation commands
    if (command.includes('scroll down') || command.includes('scroll down page')) {
      window.scrollBy({ top: 300, behavior: 'smooth' });
      speak('Scrolling down');
      return;
    }

    if (command.includes('scroll up') || command.includes('scroll up page')) {
      window.scrollBy({ top: -300, behavior: 'smooth' });
      speak('Scrolling up');
      return;
    }

    if (command.includes('go to top') || command.includes('scroll to top')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      speak('Going to top of page');
      return;
    }

    if (command.includes('go to bottom') || command.includes('scroll to bottom')) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      speak('Going to bottom of page');
      return;
    }

    // Category navigation
    if (command.includes('go to electronics') || command.includes('show electronics')) {
      scrollToSection('electronics');
      speak('Going to electronics section');
      return;
    }

    if (command.includes('go to fashion') || command.includes('show fashion')) {
      scrollToSection('fashion');
      speak('Going to fashion section');
      return;
    }

    if (command.includes('go to home') || command.includes('show home')) {
      scrollToSection('home');
      speak('Going to home section');
      return;
    }

    if (command.includes('go to sports') || command.includes('show sports')) {
      scrollToSection('sports');
      speak('Going to sports section');
      return;
    }

    // Page navigation
    if (command.includes('go home') || command.includes('go to home page')) {
      navigate('/');
      speak('Going to home page');
      return;
    }

    if (command.includes('admin dashboard') || command.includes('go to admin')) {
      navigate('/admin');
      speak('Going to admin dashboard');
      return;
    }

    // Search commands
    if (command.includes('search for')) {
      const searchTerm = command.replace(/.*search for\s+/, '');
      if (searchTerm) {
        performSearch(searchTerm);
        speak(`Searching for ${searchTerm}`);
      }
      return;
    }

    // Help command
    if (command.includes('help') || command.includes('what can i say')) {
      speak('You can say: scroll up, scroll down, go to electronics, search for products, stop listening, or ask for help.');
      return;
    }

    // Unknown command
    speak('I didn\'t understand that command. Say "help" to hear available commands.');
  }, [isCommandMode, dispatch, navigate]);

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
