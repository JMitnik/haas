import * as Popover from '@radix-ui/react-popover';
import * as UI from '@haas/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import * as RadixSelect from 'components/Common/Select';
import { Avatar } from 'components/Common/Avatar';
import { ReactComponent as SwitchIcon } from 'assets/icons/icon-switch.svg';
import { slideUpFadeMotion } from 'components/animation/config';
import { useCustomer } from 'providers/CustomerProvider';
import { useUser } from 'providers/UserProvider';
import SearchBar from 'components/Common/SearchBar';
import Searchbar from 'components/Common/SearchBar';

export const WorkspaceSwitcherContainer = styled(UI.Div)`
  ${({ theme }) => css`
    text-align: left;
    width: 100%;
    position: relative;
    padding: ${theme.gutter}px;
    border-top: 1px solid ${theme.colors.gray[200]};
    border-right: 1px solid ${theme.colors.neutral[500]};
    transition: all ${theme.transitions.slow};

    &:hover {
      background: ${theme.colors.off[100]};
      transition: all ${theme.transitions.slow};

      cursor: pointer;
    }

    ${UI.Icon} svg path {
      stroke: currentColor;
    }
  `}
`;

const Content = styled(Popover.Content)`
  transform-origin: top left;
  z-index: 10000;
  width: 100%;
`;

interface TimePickerProps {
  onClose: () => void;
}

const times = [
  { label: '7:00AM', value: '7 0' },
  { label: '7:15AM', value: '7 15' },
  { label: '7:30AM', value: '7 30' },
  { label: '7:45AM', value: '7 45' },
  { label: '8:00AM', value: '8 0' },
  { label: '8:15AM', value: '8 15' },
  { label: '1:00PM', value: '13 0' }
];

export const WorkspaceSwitchContent = ({ onClose }: TimePickerProps) => {
  const [search, setSearch] = useState('');
  console.log('Search: ', search);
  const [filteredItems, setFilteredItems] = useState(times);

  useEffect(
    () => {
      if (!search) setFilteredItems(times);

      setFilteredItems(times.filter((time) => time.label.includes(search)));
    }, [search]
  );
  return (
    <UI.Div>
      <RadixSelect.Root defaultValue="8 0">
        <RadixSelect.SelectTrigger aria-label="Food">
          <RadixSelect.SelectValue />
          <RadixSelect.SelectIcon>
            <ChevronDownIcon />
          </RadixSelect.SelectIcon>
        </RadixSelect.SelectTrigger>
        <RadixSelect.SelectContent>
          <RadixSelect.SelectScrollUpButton>
            <ChevronUpIcon />
          </RadixSelect.SelectScrollUpButton>
          <RadixSelect.SelectViewport>
            <SearchBar
              key="searchy"
              search={search}
              onSearchChange={(e) => setSearch(e)}
            />
            <RadixSelect.SelectGroup>
              {filteredItems.map((item) => (
                <RadixSelect.SelectItem value={item.value}>
                  <RadixSelect.SelectItemText>{item.label}</RadixSelect.SelectItemText>
                  <RadixSelect.SelectItemIndicator>
                    <CheckIcon />
                  </RadixSelect.SelectItemIndicator>
                </RadixSelect.SelectItem>
              ))}
            </RadixSelect.SelectGroup>
          </RadixSelect.SelectViewport>
          <RadixSelect.SelectScrollDownButton>
            <ChevronDownIcon />
          </RadixSelect.SelectScrollDownButton>
        </RadixSelect.SelectContent>
      </RadixSelect.Root>
    </UI.Div>
  );
};

export const TimePicker = () => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = useState('');

  console.log('Search: ', search);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger style={{ width: '100%', zIndex: 1000 }}>
        <UI.Input onChange={(e) => setSearch(e.currentTarget?.value)} />
      </Popover.Trigger>

      <AnimatePresence>
        {open ? (
          <Content
            asChild
            forceMount
            forwardedAs={motion.div}
            align="start"
            alignOffset={12}
            portalled={false}
            side="bottom"
            {...slideUpFadeMotion}
            style={{ minWidth: '320px', zIndex: 10000 }}
          >
            <motion.div>
              <WorkspaceSwitchContent onClose={() => setOpen(false)} />
            </motion.div>
          </Content>
        ) : null}
      </AnimatePresence>
    </Popover.Root>
  );
};
