import styled, { css } from 'styled-components';

export const ReactFlowContainer = styled.div`
  ${({ theme }) => css`
    .minimap {
      border: 1px solid ${theme.colors.gray[300]};
    }
  `}
`;