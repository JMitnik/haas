import { useEffect, useRef } from 'react';

export const useDocumentTitle = (title: string, retainOnUnmount: boolean = false) => {
  const envPrefix = (process.env.VITE_ENV && process.env.VITE_ENV === 'local') ? '(Local) ' : '';
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    document.title = `${envPrefix}${title}`;
  }, [title]);

  useEffect(() => () => {
    if (!retainOnUnmount) {
      document.title = `${defaultTitle.current}`;
    }
  }, []);
};
