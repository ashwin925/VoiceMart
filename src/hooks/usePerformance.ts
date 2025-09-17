import { useEffect, useCallback } from 'react';

export const usePerformance = () => {
  // Preload critical resources
  const preloadResource = useCallback((href: string, as: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  }, []);

  // Prefetch resources for better navigation
  const prefetchResource = useCallback((href: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }, []);

  // Debounce function for search and other frequent operations
  const debounce = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  // Throttle function for scroll events
  const throttle = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // Intersection Observer for lazy loading
  const createIntersectionObserver = useCallback((
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) => {
    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers without IntersectionObserver
      return null;
    }

    return new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    });
  }, []);

  // Performance monitoring
  useEffect(() => {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      // This would integrate with a real performance monitoring service
      console.log('Performance monitoring initialized');
    }

    // Monitor memory usage in development
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      const logMemoryUsage = () => {
        const memory = (performance as any).memory;
        console.log('Memory usage:', {
          used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
          total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
        });
      };

      const interval = setInterval(logMemoryUsage, 30000); // Log every 30 seconds
      return () => clearInterval(interval);
    }
  }, []);

  // Image optimization helper
  const optimizeImage = useCallback((src: string, width?: number, height?: number) => {
    // In a real app, this would integrate with an image optimization service
    // For now, we'll just add loading="lazy" and proper sizing
    return {
      src,
      loading: 'lazy' as const,
      ...(width && { width }),
      ...(height && { height }),
      style: {
        aspectRatio: width && height ? `${width}/${height}` : undefined
      }
    };
  }, []);

  // Bundle splitting helper - dynamically import components
  const lazyImport = useCallback(<T extends React.ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>
  ) => {
    const { lazy } = require('react');
    return lazy(importFunc);
  }, []);

  // Service Worker registration for caching
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return {
    preloadResource,
    prefetchResource,
    debounce,
    throttle,
    createIntersectionObserver,
    optimizeImage,
    lazyImport
  };
};
