import { Div } from '@haas/ui';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface ListItemProps {
  isNotClickable?: boolean;
}

export const ListContainer = styled(Div)`
  padding: 8px 0;
`;

const List = ({ children }: { children: ReactNode }) => (
  <ListContainer>
    {children}
  </ListContainer>
);

export default List;
