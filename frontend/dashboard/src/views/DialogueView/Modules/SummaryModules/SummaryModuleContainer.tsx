import styled from 'styled-components';

import { Card, Grid } from '@haas/ui';

const SummaryModuleContainer = styled(Grid)`
  grid-template-columns: 1fr 1fr 1fr;
  /* grid-gap: 0; */

  > ${Card} {
      border-radius: 0;
      
      &:first-child {
        border-radius: 10px 0 0 10px;
      }

      &:last-child {
        border-radius: 0 10px 10px 0;
      }

      h3 {
        font-size: 1.2rem;
      }

      h2 {
        font-size: 1.3rem;
      }
  }
`;

export default SummaryModuleContainer;
