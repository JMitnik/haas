import React from 'react';

import { useDocumentTitle } from 'hooks/useDocumentTitle';

interface ViewProps {
  documentTitle: string;
  children: React.ReactNode;
}

export const View = ({ documentTitle, children }: ViewProps) => {
  useDocumentTitle(documentTitle);
  return (
    <>
      {children}
    </>
  );
};
