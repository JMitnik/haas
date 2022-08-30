import styled, { css } from 'styled-components';

export const EventBarsContainer = styled.div`
  ${({ theme }) => css`
    position: relative;
    transition: all ${theme.transitions.normal};

    .tick text, .event-label {
      font-size: 0.9rem;
      fill: ${theme.colors.off[400]};
      font-weight: 800;
    }

    .tick {
      .visx-line {
        display: none;
      }
    }

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
