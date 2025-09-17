import React from 'react';
import { Mic, Volume2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const VoiceFeedbackOverlay: React.FC = () => {
  const { state } = useAppContext();
  const { isListening, isCommandMode, transcript } = state;

  // Don't show overlay if not listening
  if (!isListening) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border p-4 max-w-sm">
        {/* Status Header */}
        <div className="flex items-center space-x-2 mb-2">
          <div className={`p-2 rounded-full ${isCommandMode ? 'bg-green-100' : 'bg-orange-100'}`}>
            <Mic className={`w-4 h-4 ${isCommandMode ? 'text-green-600' : 'text-orange-600'}`} />
          </div>
          <div>
            <div className={`font-medium text-sm ${isCommandMode ? 'text-green-700' : 'text-orange-700'}`}>
              {isCommandMode ? 'Command Mode Active' : 'Listening...'}
            </div>
            <div className="text-xs text-gray-500">
              {isCommandMode ? 'Say a command' : 'Say "listen now" to activate'}
            </div>
          </div>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="mt-3 p-2 bg-gray-50 rounded border">
            <div className="flex items-start space-x-2">
              <Volume2 className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700 min-h-[1rem]">
                {transcript || 'Listening...'}
              </div>
            </div>
          </div>
        )}

        {/* Visual Indicator */}
        <div className="mt-3 flex justify-center">
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${isCommandMode ? 'bg-green-400' : 'bg-orange-400'
                  } animate-pulse`}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Quick Commands Hint */}
        {isCommandMode && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Available commands:</div>
            <div className="text-xs text-gray-600 space-y-0.5">
              <div>"scroll down" or "scroll up"</div>
              <div>"help" for more commands</div>
              <div>"stop listening" to deactivate</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceFeedbackOverlay;
