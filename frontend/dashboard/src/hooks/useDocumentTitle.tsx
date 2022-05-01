import { useEffect, useRef } from 'react';

export const useDocumentTitle = (title: string, retainOnUnmount: boolean = false) => {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => () => {
    if (!retainOnUnmount) {
      document.title = defaultTitle.current;
    }
  }, []);
};
