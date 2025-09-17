import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase
vi.mock('./services/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
    signInWithPopup: vi.fn(),
    signOut: vi.fn()
  },
  googleProvider: {},
  db: {},
  storage: {},
  categoryService: {
    getCategories: vi.fn().mockResolvedValue([
      {
        id: '1',
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        subcategories: ['Smartphones', 'Laptops', 'Tablets'],
        imageUrl: 'https://example.com/electronics.jpg'
      }
    ])
  },
  productService: {
    getProducts: vi.fn().mockResolvedValue([
      {
        id: '1',
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        category: 'Electronics',
        subcategory: 'Smartphones',
        stock: 10,
        imageUrl: 'https://example.com/product.jpg'
      }
    ]),
    addProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn()
  }
}));

// Mock Web Speech API
const mockSpeechRecognition = {
  start: vi.fn(),
  stop: vi.fn(),
  abort: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  continuous: false,
  interimResults: false,
  lang: 'en-US'
};

const mockSpeechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  getVoices: vi.fn().mockReturnValue([])
};

// Global mocks
Object.defineProperty(window, 'SpeechRecognition', {
  value: vi.fn(() => mockSpeechRecognition),
  writable: true
});

Object.defineProperty(window, 'webkitSpeechRecognition', {
  value: vi.fn(() => mockSpeechRecognition),
  writable: true
});

Object.defineProperty(window, 'speechSynthesis', {
  value: mockSpeechSynthesis,
  writable: true
});

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  value: vi.fn(),
  writable: true
});

// Mock navigator.mediaDevices
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn().mockResolvedValue({})
  },
  writable: true
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: []
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Suppress console errors in tests
const originalError = console.error;
console.error = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: ReactDOM.render is no longer supported')
  ) {
    return;
  }
  originalError.call(console, ...args);
};
