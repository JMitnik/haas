import { Div } from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components/macro';

interface ListItemProps {
  isNotClickable?: boolean;
}

export const ListContainer = styled(Div)`
  padding: 8px 0;
`;

const List = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();

  return (
    <ListContainer>
      {children}
    </ListContainer>
  );
};

export default List;
