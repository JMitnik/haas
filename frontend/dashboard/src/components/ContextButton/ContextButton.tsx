import { ReactComponent as ContextButtonSVG } from 'assets/icons/icon-more.svg';
import { Menu, MenuButton, MenuList } from '@chakra-ui/core';
import React from 'react';
import styled from 'styled-components';

export const ContextButtonContainer = styled.div`
  height: 25px;
  width: 40px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContextButton = ({ children }: { children: React.ReactNode }) => (
  <ContextButtonContainer onClick={(e) => e.stopPropagation()} data-cy="ContextButton">
    <Menu>
      <MenuButton as="span">
        <ContextButtonSVG />
      </MenuButton>
      <MenuList>
        {children}
      </MenuList>
    </Menu>
  </ContextButtonContainer>
);

export default ContextButton;
