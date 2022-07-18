import * as Popover from '@radix-ui/react-popover';
import * as UI from '@haas/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import * as RadixSelect from 'components/Common/Select';
import { slideUpFadeMotion } from 'components/animation/config';
import SearchBar from 'components/Common/SearchBar';

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

const times = [
  { label: '7:00AM', value: '0 7' },
  { label: '7:15AM', value: '15 7' },
  { label: '7:30AM', value: '30 7' },
  { label: '7:45AM', value: '45 7' },
  { label: '8:00AM', value: '0 8' },
  { label: '8:15AM', value: '15 8' },
  { label: '1:00PM', value: '0 13' },
];

interface TimePickerSelectProps {
  onChange: (e: string) => void;
  value?: string;
}

export const TimePickerContent = ({ onChange, value }: TimePickerSelectProps) => {
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState(times);

  useEffect(
    () => {
      if (!search) setFilteredItems(times);

      setFilteredItems(times.filter((time) => time.label.includes(search)));
    }, [search],
  );
  return (
    <UI.Div>
      <RadixSelect.Root value={value} onValueChange={onChange} defaultValue="0 8">
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

  const onChange = (e: string) => e;

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
              <TimePickerContent onChange={onChange} />
            </motion.div>
          </Content>
        ) : null}
      </AnimatePresence>
    </Popover.Root>
  );
};
