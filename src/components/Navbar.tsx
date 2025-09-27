import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, MicOff, Search, ShoppingCart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import AuthButton from './AuthButton';

const Navbar: React.FC = () => {
  const { state } = useAppContext();
  const { isListening, isCommandMode, hasMicPermission } = state;
  const { toggleRecognition } = useVoiceCommands();

  const handleMicToggle = () => {
    if (!hasMicPermission) {
      // Request permission will be handled by the PermissionModal
      return;
    }

    toggleRecognition();
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchTerm = formData.get('search') as string;

    if (searchTerm.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchTerm);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VC</span>
            </div>
            <span className="text-xl font-bold text-gray-900">VoiceCart</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </form>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Voice Control Button */}
            <button
              onClick={handleMicToggle}
              className={`relative p-2 rounded-full transition-all duration-200 ${isListening
                ? 'bg-red-100 text-red-600 voice-listening'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              title={isListening ? 'Stop listening' : 'Start voice control'}
              disabled={!hasMicPermission}
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}

              {/* Command mode indicator */}
              {isCommandMode && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              )}
            </button>

            {/* Voice Status Text */}
            <div className="hidden sm:block text-sm">
              {!hasMicPermission ? (
                <span className="text-gray-500">Mic access needed</span>
              ) : isCommandMode ? (
                <span className="text-green-600 font-medium">Listening for commands</span>
              ) : isListening ? (
                <span className="text-orange-600">Say "listen now" to activate</span>
              ) : (
                <span className="text-gray-500">Voice control off</span>
              )}
            </div>

            {/* Shopping Cart */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </button>

            {/* User Authentication */}
            <AuthButton />
          </div>
        </div>
      </div>

      {/* Mobile menu - can be expanded later */}
      <div className="sm:hidden px-4 py-2 border-t border-gray-200 bg-white/90">
        <div className="text-xs text-center">
          {!hasMicPermission ? (
            <span className="text-gray-500">Microphone access needed for voice control</span>
          ) : isCommandMode ? (
            <span className="text-green-600 font-medium">🎤 Listening for commands</span>
          ) : isListening ? (
            <span className="text-orange-600">Say "listen now" to activate commands</span>
          ) : (
            <span className="text-gray-500">Voice control is off</span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
