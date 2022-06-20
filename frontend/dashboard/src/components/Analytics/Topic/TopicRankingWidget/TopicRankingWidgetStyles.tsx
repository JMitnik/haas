import * as UI from '@haas/ui';
import styled from 'styled-components';

import { ItemStyles } from 'components/Common/Dropdownable/Dropdownable.styles';

export const Item = styled(UI.Div)`
  ${ItemStyles}
`;

export const ClickableSvg = styled.svg`
  pointer-events: none;
  svg {
    cursor: pointer;
    pointer-events: auto;
  }
`;
