import { Timestamp } from 'firebase/firestore';

// Product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string; // Main category (e.g., "Electronics")
  subcategory: string; // Subcategory (e.g., "Headphones")
  imageUrl: string;
  stock: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Category interface
export interface Category {
  id: string;
  name: string;
  subcategories: string[];
  imageUrl: string;
}

// User interface
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAdmin?: boolean;
  createdAt: Timestamp;
}

// App State interface for useReducer
export interface AppState {
  hasMicPermission: boolean;
  isListening: boolean; // Whether mic is active
  isCommandMode: boolean; // Whether system responds to commands (after "listen now")
  transcript: string;
  products: Product[];
  categories: Category[];
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Action types for useReducer
export type AppAction = 
  | { type: 'SET_MIC_PERMISSION'; payload: boolean }
  | { type: 'SET_LISTENING'; payload: boolean }
  | { type: 'SET_COMMAND_MODE'; payload: boolean }
  | { type: 'SET_TRANSCRIPT'; payload: string }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

// Voice command types
export type VoiceCommand = 
  | 'listen now'
  | 'stop listening'
  | 'scroll up'
  | 'scroll down'
  | 'go to electronics'
  | 'go to fashion'
  | 'go to home'
  | 'search for'
  | 'admin dashboard'
  | 'logout';

// Form interfaces for React Hook Form
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  stock: number;
  image?: FileList;
}

export interface CategoryFormData {
  name: string;
  subcategories: string;
  image?: FileList;
}

// API Response types
export interface FirebaseError {
  code: string;
  message: string;
}

// Voice recognition types
export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  serviceURI: string;
  grammars: SpeechGrammarList;
  start(): void;
  stop(): void;
  abort(): void;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

export declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

export interface SpeechGrammarList {
  length: number;
  item(index: number): SpeechGrammar;
  [index: number]: SpeechGrammar;
  addFromURI(src: string, weight?: number): void;
  addFromString(string: string, weight?: number): void;
}

export interface SpeechGrammar {
  src: string;
  weight: number;
}
