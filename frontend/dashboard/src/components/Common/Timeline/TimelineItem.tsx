import * as UI from '@haas/ui';
import React from 'react';

import styled from 'styled-components';

interface TimelineItemContainerProps {
  isFirst?: boolean;
  isLast?: boolean;
}

export const TimelineItemContainer = styled(UI.Grid) <TimelineItemContainerProps>`
  position: relative;
  padding: 10px 0;

  &:first-of-type {
    align-items: flex-start;
    padding-top: 0;
  }

  &:last-of-type {
    padding-bottom: 0;
  }

  &::before {
    content: '';
    position: absolute;
    left: 20px;
    transform: translateX(-50%);
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: var(--timeline-color);
  }

  >:first-of-type {
    position: relative;
  }
`;

export const TimelineItem = ({ children, gridTemplateColumns }: any) => (
  <TimelineItemContainer gridTemplateColumns={gridTemplateColumns}>
    {children}
  </TimelineItemContainer>
);
