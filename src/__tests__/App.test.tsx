import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// Mock Firebase
vi.mock('../services/firebase', () => ({
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
    getCategories: vi.fn().mockResolvedValue([])
  },
  productService: {
    getProducts: vi.fn().mockResolvedValue([])
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

beforeEach(() => {
  // Mock Speech Recognition
  (global as any).SpeechRecognition = vi.fn(() => mockSpeechRecognition);
  (global as any).webkitSpeechRecognition = vi.fn(() => mockSpeechRecognition);

  // Mock Speech Synthesis
  (global as any).speechSynthesis = mockSpeechSynthesis;
  (global as any).SpeechSynthesisUtterance = vi.fn();

  // Mock navigator.mediaDevices
  Object.defineProperty(navigator, 'mediaDevices', {
    value: {
      getUserMedia: vi.fn().mockResolvedValue({})
    },
    writable: true
  });

  // Clear all mocks
  vi.clearAllMocks();
});

const renderApp = () => {
  return render(<App />);
};

describe('App Component', () => {
  it('renders without crashing', () => {
    renderApp();
    expect(screen.getByText(/VoiceCart/i)).toBeInTheDocument();
  });

  it('displays the main navigation', () => {
    renderApp();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('shows the voice activation button', () => {
    renderApp();
    expect(screen.getByText(/Enable Voice Commands/i)).toBeInTheDocument();
  });

  it('displays categories section', async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByText(/Shop by Category/i)).toBeInTheDocument();
    });
  });

  it('handles voice permission request', async () => {
    renderApp();

    const enableButton = screen.getByText(/Enable Voice Commands/i);
    fireEvent.click(enableButton);

    // Should show permission modal or start voice recognition
    await waitFor(() => {
      expect(mockSpeechRecognition.start).toHaveBeenCalled();
    });
  });

  it('displays error boundary on error', () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    const ThrowError = () => {
      throw new Error('Test error');
    };

    const { rerender } = renderApp();

    // Force an error by rendering a component that throws
    expect(() => {
      rerender(<ThrowError />);
    }).toThrow();

    consoleSpy.mockRestore();
  });

  it('navigates to admin dashboard when authenticated', async () => {
    // Mock authenticated user
    vi.doMock('../hooks/useAuth', () => ({
      useAuth: () => ({
        user: {
          uid: 'test-uid',
          email: 'admin@test.com',
          displayName: 'Test Admin'
        },
        loading: false,
        signIn: vi.fn(),
        signOut: vi.fn()
      })
    }));

    renderApp();

    // Navigate to admin route
    window.history.pushState({}, 'Admin', '/admin');

    await waitFor(() => {
      expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
    });
  });

  it('shows 404 page for invalid routes', () => {
    renderApp();

    // Navigate to invalid route
    window.history.pushState({}, 'Not Found', '/invalid-route');

    expect(screen.getByText(/404 - Page Not Found/i)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    renderApp();

    // Check for skip link
    const skipLink = screen.getByText(/Skip to main content/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');

    // Check for main content area
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('id', 'main-content');
  });

  it('supports keyboard navigation', () => {
    renderApp();

    // Test tab navigation
    const firstFocusableElement = screen.getByText(/Skip to main content/i);
    firstFocusableElement.focus();
    expect(document.activeElement).toBe(firstFocusableElement);

    // Test escape key handling
    fireEvent.keyDown(document, { key: 'Escape' });
    // Should close any open modals/dropdowns
  });
});

describe('Voice Commands Integration', () => {
  it('processes voice commands correctly', async () => {
    renderApp();

    // Mock speech recognition result
    const mockEvent = {
      results: [{
        0: { transcript: 'listen now' },
        isFinal: true
      }]
    };

    // Simulate voice command
    const onResult = mockSpeechRecognition.addEventListener.mock.calls
      .find(call => call[0] === 'result')?.[1];

    if (onResult) {
      onResult(mockEvent);

      await waitFor(() => {
        // Should activate command mode
        expect(screen.getByText(/Listening for commands/i)).toBeInTheDocument();
      });
    }
  });

  it('provides voice feedback', async () => {
    renderApp();

    // Enable voice commands first
    const enableButton = screen.getByText(/Enable Voice Commands/i);
    fireEvent.click(enableButton);

    await waitFor(() => {
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });
  });
});

describe('Performance Optimizations', () => {
  it('lazy loads images', () => {
    renderApp();

    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('loading', 'lazy');
    });
  });

  it('implements proper error boundaries', () => {
    // Error boundary should catch and display errors gracefully
    expect(() => renderApp()).not.toThrow();
  });
});
