import { ThemeContext } from 'styled-components/macro';
import { useContext, useEffect, useState } from 'react';

/**
 * Tracks device sizes
 */
const useMediaDevice = () => {
  const { mediaSizes } = useContext(ThemeContext);
  const [dimensions, setDimensions] = useState([
    document.body.clientWidth,
    document.body.clientHeight,
  ]);

  useEffect(() => {
    const handleResize = () => setDimensions([
      document.body.clientWidth, document.body.clientHeight,
    ]);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isIphone = navigator.userAgent.match(/(iPhone|iPad)/);

  return {
    isSmall: mediaSizes.sm <= dimensions[0] && mediaSizes.md > dimensions[0],
    isMedium: mediaSizes.md <= dimensions[0] && mediaSizes.lg > dimensions[0],
    isLarge: mediaSizes.lg < dimensions[0],
    isPortrait: dimensions[0] < dimensions[1],
    isIphone,
  };
};

export default useMediaDevice;
