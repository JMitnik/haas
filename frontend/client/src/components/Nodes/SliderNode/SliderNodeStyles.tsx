import styled from 'styled-components/macro';
import { H2 } from '@haas/ui';
import { ActiveNodeContainer } from '../Node/NodeStyles';

export const SliderNodeContainer = styled(ActiveNodeContainer)`
  height: 100%;
`;

export const SliderNodeValue = styled(H2)`
  text-shadow: 2px 3px rgba(0, 0, 0, 0.25);
  display: inline-block;
  border-radius: 100%;
  width: 75px;
  height: 75px;
  margin: 100px auto;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const HAASRabbit = styled.div`
  position: absolute;
  transform: translateX(-50%);

  svg {
    /* TODO: Find out why important is so important */
    width: auto !important;
    height: auto !important;
    max-width: 200px;
  }
`;
