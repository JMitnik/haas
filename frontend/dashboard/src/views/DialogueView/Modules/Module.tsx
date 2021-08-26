import * as UI from '@haas/ui';
import React from 'react';
import styled from 'styled-components';

import { ReactComponent as EmptyIll } from 'assets/images/undraw_empty.svg';

const ModuleContainer = styled(UI.Div)`
    background: #f7f9fe;
    border-radius: 12px;
    overflow: hidden;

    ol {
        padding: 12px 24px;
    }
`;

interface ModuleProps {
  isLoading: boolean;
  fallbackIllustration?: React.ReactNode;
  fallbackText?: string;
  fallbackHeight?: number;
  isEmpty?: boolean;
  children?: React.ReactNode;
}

export const Module = ({
  isLoading,
  isEmpty,
  fallbackIllustration = <EmptyIll />,
  fallbackHeight = 320,
  fallbackText = 'No user interactions available yet.',
  children
}: ModuleProps) => (
  <UI.Skeleton isLoading={isLoading} isRefreshing={isLoading}>
    <UI.Card bg="white">
      {isEmpty ? (
        <UI.Div minHeight={fallbackHeight}>
          <UI.IllustrationCard
            svg={fallbackIllustration}
            isFlat
            text={fallbackText}
          />
        </UI.Div>
      ) : (
        <>
          {children}
        </>
      )}
    </UI.Card>
  </UI.Skeleton>
);

export default ModuleContainer;
