import React, { useState } from 'react';

import * as UI from '@haas/ui';
import styled, { css } from 'styled-components';

import { Brand } from 'config/theme';
import { MinusCircle, PlusCircle } from 'react-feather';

export interface TimelineProps {
  children: React.ReactNode;
  enableFold?: boolean;
  nrItems?: number;
  isBlock?: boolean;
  brand?: Brand;
}

export const TimelineContainer = styled(UI.Div) <TimelineProps>`
  ${({ theme, isBlock, brand }) => css`
    display: block;
    position: relative;
    --timeline-color: ${theme.colors?.gray[200]};

    .fold-button {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    ${brand && css`
      background: ${theme.colors?.[brand][50]};
      color: ${theme.colors?.[brand][600]};
      /* Set a number of variables to scope */
      --timeline-color: ${theme.colors?.[brand][200]};
      --timeline-background: ${theme.colors?.[brand][50]};
      --circle-outline-color: var(--timeline-background);
    `}

    ${isBlock && css`
      padding: ${theme.gutter / 2}px;
      border-radius: 10px;
    `}
  `}
`;

export const Timeline = ({ children, enableFold, nrItems, ...props }: TimelineProps) => {
  const [isFold, setIsFold] = useState<boolean>(false);

  const handleToggleFold = () => {
    setIsFold((isFolding) => !isFolding);
  };

  return (
    <TimelineContainer {...props}>
      {enableFold && (
        <UI.Button size="xs" onClick={handleToggleFold} className="fold-button">
          {!isFold ? (
            <UI.Icon>
              <MinusCircle />
            </UI.Icon>
          ) : (
            <UI.Icon>
              <PlusCircle />
            </UI.Icon>
          )}
        </UI.Button>
      )}

      {!isFold ? children : (
        <>
          {!!nrItems && (
            <>
              Currently hiding
              {' '}
              {nrItems}
              {' '}
              items
            </>
          )}
        </>
      )}
    </TimelineContainer>
  );
};
