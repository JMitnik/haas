import styled, { css } from 'styled-components/macro';
import { Div, H1, H2, H3, H4 } from '@haas/ui';

export const FloatingNodeContainer = styled(Div)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  height: 90%;
`;

export const ActiveNodeContainer = styled(Div)`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;

  ${H2} {
    color: white;
    text-align: center;
  }
`;
