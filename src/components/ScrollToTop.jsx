import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component automatically scrolls to the top of the page
 * whenever the route changes.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Multiple approaches to ensure scroll to top works
    const scrollMethods = [
      // Standard window scroll
      () => window.scrollTo(0, 0),
      // Scroll main element if it exists
      () => {
        const mainElement = document.querySelector('main');
        if (mainElement) {
          mainElement.scrollTop = 0;
        }
      },
      // Scroll html element
      () => {
        const htmlElement = document.querySelector('html');
        if (htmlElement) {
          htmlElement.scrollTop = 0;
        }
      },
      // Scroll body element
      () => {
        const bodyElement = document.querySelector('body');
        if (bodyElement) {
          bodyElement.scrollTop = 0;
        }
      },
      // Scroll to top with smooth behavior
      () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    ];

    // Execute all scroll methods to ensure it works
    const timer = setTimeout(() => {
      scrollMethods.forEach(method => {
        try {
          method();
        } catch (e) {
          console.warn('Scroll method failed:', e);
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}