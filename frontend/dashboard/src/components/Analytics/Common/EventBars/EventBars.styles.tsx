import styled, { css } from 'styled-components';

export const EventBarsContainer = styled.div`
  ${({ theme }) => css`
    position: relative;
    transition: all ${theme.transitions.normal};

    .tooltip {
      background: transparent !important;
      padding: 0 !important;
    }

    .event-bar:hover {
      cursor: pointer;
      transition: all ${theme.transitions.normal};
      fill: ${theme.colors.off[300]};
    }
  `}
`;
