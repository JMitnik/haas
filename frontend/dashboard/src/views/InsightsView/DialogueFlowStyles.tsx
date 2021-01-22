import styled, { css } from 'styled-components';

interface ReactFlowContainerProps {
  isInFocusMode?: boolean;
}

export const ReactFlowContainer = styled.div<ReactFlowContainerProps>`
  ${({ theme, isInFocusMode }) => css`
    .minimap {
      border: 1px solid ${theme.colors.gray[300]};
    }

    ${isInFocusMode && css`
      .react-flow__edge path {
        opacity: 0.4;
      }

      .react-flow__edge.animated {
        &.critical path, &.critical {
          stroke: ${theme.colors.red[500]};
        }

        &.popular path, &.popular {
          stroke: ${theme.colors.blue[500]};
        }
      }
      .react-flow__edge.animated path {
        stroke-width: 3px;
        opacity: 1;
      }
    `}
  `}
`;