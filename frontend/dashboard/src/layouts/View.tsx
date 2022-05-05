import * as UI from '@haas/ui';
import React from 'react';

import { useDocumentTitle } from 'hooks/useDocumentTitle';

interface ViewProps {
  documentTitle: string;
  children: React.ReactNode;
}

export const View = ({ documentTitle, children }: ViewProps) => {
  useDocumentTitle(documentTitle);
  return (
    <UI.FadeIn>
      {children}
    </UI.FadeIn>
  );
};
