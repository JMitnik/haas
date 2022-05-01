import { useEffect, useRef } from 'react';

export const useDocumentTitle = (title: string, retainOnUnmount: boolean = false) => {
  const envPrefix = (import.meta.env.VITE_ENV && import.meta.env.VITE_ENV === 'local') ? '(Local) ' : '';
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    document.title = `${envPrefix}${title}`;
  }, [title]);

  useEffect(() => () => {
    if (!retainOnUnmount) {
      document.title = `${envPrefix}${defaultTitle.current}`;
    }
  }, []);
};
