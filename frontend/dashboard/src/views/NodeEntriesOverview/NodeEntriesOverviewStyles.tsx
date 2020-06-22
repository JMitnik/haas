import styled from 'styled-components/macro';
import { Div } from '@haas/ui';

export const NodeEntriesOverviewContainer = styled.div`
  margin-top: 10px;
`;

export const NodeEntryContainer = styled.div`
  background: #f7f9fe;
  border-radius: 10px;
  margin-bottom: 12px;
  padding: 12px;


  >${Div}:first-child {
    font-size: 1.2rem;
  }

  >${Div}:last-child {
    margin-top: 6px;
  }
`;
