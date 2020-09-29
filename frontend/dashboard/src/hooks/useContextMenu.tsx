import { Ref, RefObject, useEffect, useState } from 'react';
import useOnClickOutside from './useClickOnOutside';

const useContextMenu = (ref: RefObject<HTMLElement | null>) => {
  const [isShowing, setIsShowing] = useState(false);
  useOnClickOutside(ref, () => setIsShowing(false));

  useEffect(() => {
    ref.current?.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      setIsShowing(true);
    });
    return () => {
      setIsShowing(false);
        ref.current?.removeEventListener('contextmenu', () => { setIsShowing(true); });
    };
  }, [setIsShowing]);

  return { isShowing };
};

export default useContextMenu;
