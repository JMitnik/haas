import styled from 'styled-components/macro';
import { H2 } from '@haas/ui';
import { ActiveNodeContainer } from '../Node/NodeStyles';

export const SliderNodeContainer = styled(ActiveNodeContainer)`
  height: 100%;
`;

export const SliderNodeValue = styled(H2)`
  text-shadow: 2px 3px rgba(0, 0, 0, 0.25);
`;
