import styled, { css } from 'styled-components';
import * as UI from '@haas/ui';

import { lighten, saturate } from '../Theme/colorUtils';

export const DrawerContainer = styled(UI.Div)`
  ${({ theme }) => css`
    position: relative;
    background: linear-gradient(45deg, ${lighten(theme.colors._primary, 0.3)}, ${saturate(lighten(theme.colors._primary, 0.3), 1)});
    padding: 24px;
    border-radius: 30px;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px;
    backdrop-filter: blur(10px);
  `}
`;

export const LoadingContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
`;
export const IframeContainer = styled.div`
  overflow: hidden;
  padding-bottom: 56.25%;
  position: relative;
  height: 0;

  iframe {
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    position: absolute;
  }
`;
