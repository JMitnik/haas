import styled, { css } from 'styled-components';

export const ReactFlowContainer = styled.div`
  ${({ theme }) => css`
    .minimap {
      border: 1px solid ${theme.colors.gray[300]};
    }

    .react-flow__edge path {
      opacity: 0.4;
    }
    
    .react-flow__edge.animated path {
      stroke: red;
      stroke-width: 3px;
      opacity: 1;
    }
  `}
`;