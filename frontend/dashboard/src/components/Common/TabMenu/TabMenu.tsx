import * as UI from '@haas/ui';
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/core';
import React from 'react';
import styled from 'styled-components';

interface TabMenuItem {
  label: string;
  icon?: React.ReactNode;
}

interface TabbedMenuProps {
  tabs: TabMenuItem[];
  children: React.ReactNode;
  menuHeader?: string;
}

const TabbedMenuContainer = styled.div`
  ${UI.Icon} svg {
    width: 100%;
  }
`;

/**
 * A tabbed menu, useful in Popovers.
 *
 * - Assumes that the number of `children` equal the number of `tabs`.
 */
export const TabbedMenu = ({ children, tabs, menuHeader }: TabbedMenuProps) => {
  const arrChildren = React.Children.toArray(children);

  return (
    <TabbedMenuContainer>
      <Tabs textAlign="left" orientation="vertical">
        <UI.Grid gridTemplateColumns="1fr 2fr">
          <UI.Div
            color="gray.600"
            borderTopLeftRadius={10}
            borderBottomLeftRadius={10}
            borderRight="1px solid"
            borderColor="gray.100"
            bg="gray.50"
            py={2}
            px={2}
          >
            {!!menuHeader && (
              <UI.Div mb={2} ml={1}>
                <UI.Helper>{menuHeader}</UI.Helper>
              </UI.Div>
            )}
            <TabList textAlign="left" borderBottom={0}>
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  fontSize="0.9rem"
                  textAlign="left"
                  fontWeight={600}
                  justifyContent="flex-start"
                  border="2px solid transparent"
                  borderColor="gray.50"
                  borderRadius={10}
                  _selected={{
                    borderColor: 'blue.500', bg: 'blue.50', boxShadow: 'none',
                  }}
                >
                  <UI.Span color="gray.600" display="flex">
                    {!!tab.icon && (
                      <UI.Icon width="18px" mr={1}>{tab.icon}</UI.Icon>
                    )}
                    {tab.label}
                  </UI.Span>
                </Tab>
              ))}
            </TabList>
          </UI.Div>
          <UI.Div py={4} px={2}>
            <TabPanels>
              {arrChildren.map((child, index) => (
                <TabPanel key={index}>
                  {child}
                </TabPanel>
              ))}
            </TabPanels>
          </UI.Div>
        </UI.Grid>
      </Tabs>
    </TabbedMenuContainer>
  );
};
