import * as RadixDropdown from '@radix-ui/react-dropdown-menu';
import * as UI from '@haas/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'react-feather';
import { NavLink, NavLinkProps } from 'react-router-dom';
import React from 'react';
import styled, { css } from 'styled-components';

import { slideUpFadeMotion } from 'components/animation/config';

import { ItemStyles, LabelStyles } from '../Dropdownable/Dropdownable.styles';

export const Root = styled(RadixDropdown.Root)``;

export const Label = styled(RadixDropdown.Label)`
  ${LabelStyles}
`;

export const Trigger = styled(RadixDropdown.Trigger)``;

export const ContentContainer = styled(RadixDropdown.Content)`
  ${({ theme }) => css`
    transform-origin: top left;
    width: 100%;

    ${UI.Card} {
      padding: ${theme.gutter / 4}px;
    }

    ${UI.Hr} {
      padding: 0;
      margin: ${theme.gutter / 4}px 0px;
    }
  `}
`;

interface ContentProps {
  open: boolean;
  children: React.ReactNode;
}

export const Content = ({ open, children }: ContentProps) => (
  <AnimatePresence>
    {open ? (
      <ContentContainer
        asChild
        forceMount
        forwardedAs={motion.div}
        align="start"
        alignOffset={12}
        side="bottom"
        {...slideUpFadeMotion}
        style={{ minWidth: '200px' }}
      >
        <motion.div>
          <UI.Card padding={1}>
            {children}
          </UI.Card>
        </motion.div>
      </ContentContainer>
    ) : null}
  </AnimatePresence>
);

export const Item = styled(RadixDropdown.Item)`
  ${ItemStyles}
`;

export const NavItemContainer = styled(NavLink)`
  display: block !important;
`;

type NavItemProps = NavLinkProps & RadixDropdown.DropdownMenuItemProps;

export const NavItem = ({ children, ...props }: NavItemProps) => (
  <Item asChild>
    <NavItemContainer {...props}>
      {children}
    </NavItemContainer>
  </Item>
);

interface CheckedItemContainerProps {
  $isChecked: boolean;
}

export const CheckedItemContainer = styled(Item) <CheckedItemContainerProps>`
  ${({ theme, $isChecked }) => css`
    ${$isChecked && css`
      color: ${theme.colors.main[500]};
    `}
  `}
`;

interface CheckedItemProps {
  isChecked: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const CheckedItem = ({ children, isChecked, onClick }: CheckedItemProps) => (
  <CheckedItemContainer $isChecked={isChecked} onClick={onClick}>
    <UI.Flex justifyContent="space-between" alignItems="center">
      {children}

      {isChecked && (
        <UI.Icon>
          <Check />
        </UI.Icon>
      )}
    </UI.Flex>
  </CheckedItemContainer>
);
