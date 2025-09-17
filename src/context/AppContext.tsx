import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { AppState, AppAction } from '../types';

// Initial state
const initialState: AppState = {
  hasMicPermission: false,
  isListening: false,
  isCommandMode: false,
  transcript: '',
  products: [],
  categories: [],
  user: null,
  loading: false,
  error: null,
};

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_MIC_PERMISSION':
      return { ...state, hasMicPermission: action.payload };
    
    case 'SET_LISTENING':
      return { 
        ...state, 
        isListening: action.payload,
        // Reset command mode when stopping listening
        isCommandMode: action.payload ? state.isCommandMode : false,
        transcript: action.payload ? state.transcript : ''
      };
    
    case 'SET_COMMAND_MODE':
      return { ...state, isCommandMode: action.payload };
    
    case 'SET_TRANSCRIPT':
      return { ...state, transcript: action.payload };
    
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
};

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
