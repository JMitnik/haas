import { Div } from '@haas/ui';
import styled from 'styled-components';

const GlobalAppLayout = styled(Div)`
  min-width: 100vw;
  min-height: calc(var(--vh, 1vh) * 100);
  background: url('/bg.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  display: flex;
  align-items: stretch;

  font-family: 'Inter', sans-serif;
`;

export default GlobalAppLayout;
