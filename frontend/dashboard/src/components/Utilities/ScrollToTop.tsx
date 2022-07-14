import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * On each page transition, scroll the app to the top of the screen (to prevent)
 * users from being suddenly "lost" on the app.
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
