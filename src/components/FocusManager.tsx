import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const FocusManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Focus management on route change
    const handleRouteChange = () => {
      // Find the main heading or main content area
      const mainHeading = document.querySelector('h1');
      const mainContent = document.getElementById('main-content');
      const skipTarget = mainHeading || mainContent;

      if (skipTarget) {
        // Make the element focusable temporarily
        const originalTabIndex = skipTarget.getAttribute('tabindex');
        skipTarget.setAttribute('tabindex', '-1');
        
        // Focus the element
        (skipTarget as HTMLElement).focus();
        
        // Restore original tabindex after a short delay
        setTimeout(() => {
          if (originalTabIndex !== null) {
            skipTarget.setAttribute('tabindex', originalTabIndex);
          } else {
            skipTarget.removeAttribute('tabindex');
          }
        }, 100);
      }
    };

    // Small delay to ensure DOM is updated
    const timer = setTimeout(handleRouteChange, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Keyboard navigation enhancement
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + M: Focus main content
      if (event.altKey && event.key === 'm') {
        event.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
        }
      }

      // Alt + N: Focus navigation
      if (event.altKey && event.key === 'n') {
        event.preventDefault();
        const nav = document.querySelector('nav');
        if (nav) {
          const firstLink = nav.querySelector('a, button');
          if (firstLink) {
            (firstLink as HTMLElement).focus();
          }
        }
      }

      // Alt + S: Focus search
      if (event.altKey && event.key === 's') {
        event.preventDefault();
        const searchInput = document.querySelector('input[name="search"]');
        if (searchInput) {
          (searchInput as HTMLElement).focus();
        }
      }

      // Escape: Close modals/dropdowns
      if (event.key === 'Escape') {
        // Close any open modals
        const modals = document.querySelectorAll('[role="dialog"]');
        modals.forEach(modal => {
          const closeButton = modal.querySelector('[aria-label*="close"], [aria-label*="Close"]');
          if (closeButton) {
            (closeButton as HTMLElement).click();
          }
        });

        // Close dropdowns
        const dropdowns = document.querySelectorAll('[aria-expanded="true"]');
        dropdowns.forEach(dropdown => {
          (dropdown as HTMLElement).click();
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Trap focus in modals
  useEffect(() => {
    const trapFocusInModal = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const modal = document.querySelector('[role="dialog"]');
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', trapFocusInModal);
    return () => document.removeEventListener('keydown', trapFocusInModal);
  }, []);

  return null; // This component doesn't render anything
};

export default FocusManager;
