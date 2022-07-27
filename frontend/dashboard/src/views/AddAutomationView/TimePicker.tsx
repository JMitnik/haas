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
  { label: '00:00AM', value: '0 0' },
  { label: '00:15AM', value: '15 0' },
  { label: '00:30AM', value: '30 0' },
  { label: '00:45AM', value: '45 0' },
  { label: '01:00AM', value: '0 1' },
  { label: '01:15AM', value: '15 1' },
  { label: '01:30AM', value: '30 1' },
  { label: '01:45AM', value: '45 1' },
  { label: '02:00AM', value: '0 2' },
  { label: '02:15AM', value: '15 2' },
  { label: '02:30AM', value: '30 2' },
  { label: '02:45AM', value: '45 2' },
  { label: '03:00AM', value: '0 3' },
  { label: '03:15AM', value: '15 3' },
  { label: '03:30AM', value: '30 3' },
  { label: '03:45AM', value: '45 3' },
  { label: '04:00AM', value: '0 4' },
  { label: '04:15AM', value: '15 4' },
  { label: '04:30AM', value: '30 4' },
  { label: '04:45AM', value: '45 4' },
  { label: '05:00AM', value: '0 5' },
  { label: '05:15AM', value: '15 5' },
  { label: '05:30AM', value: '30 5' },
  { label: '05:45AM', value: '45 5' },
  { label: '06:00AM', value: '0 6' },
  { label: '06:15AM', value: '15 6' },
  { label: '06:30AM', value: '30 6' },
  { label: '06:45AM', value: '45 6' },
  { label: '7:00AM', value: '0 7' },
  { label: '7:15AM', value: '15 7' },
  { label: '7:30AM', value: '30 7' },
  { label: '7:45AM', value: '45 7' },
  { label: '8:00AM', value: '0 8' },
  { label: '8:15AM', value: '15 8' },
  { label: '8:30AM', value: '30 8' },
  { label: '8:45AM', value: '45 8' },
  { label: '9:00AM', value: '0 9' },
  { label: '9:15AM', value: '15 9' },
  { label: '9:30AM', value: '30 9' },
  { label: '9:45AM', value: '45 9' },
  { label: '10:00AM', value: '0 10' },
  { label: '10:15AM', value: '15 10' },
  { label: '10:30AM', value: '30 10' },
  { label: '10:45AM', value: '45 10' },
  { label: '11:00AM', value: '0 11' },
  { label: '11:15AM', value: '15 11' },
  { label: '11:30AM', value: '30 11' },
  { label: '11:45AM', value: '45 11' },
  { label: '12:00PM', value: '0 12' },
  { label: '12:15PM', value: '15 12' },
  { label: '11:30PM', value: '30 12' },
  { label: '12:45PM', value: '45 12' },
  { label: '1:00PM', value: '0 13' },
  { label: '1:15PM', value: '15 13' },
  { label: '1:30PM', value: '30 13' },
  { label: '1:45PM', value: '45 13' },
  { label: '2:00PM', value: '0 14' },
  { label: '2:15PM', value: '15 14' },
  { label: '2:30PM', value: '30 14' },
  { label: '2:45PM', value: '45 14' },
  { label: '3:00PM', value: '0 15' },
  { label: '3:15PM', value: '15 15' },
  { label: '3:30PM', value: '30 15' },
  { label: '3:45PM', value: '45 15' },
  { label: '4:00PM', value: '0 16' },
  { label: '4:15PM', value: '15 16' },
  { label: '4:30PM', value: '30 16' },
  { label: '4:45PM', value: '45 16' },
  { label: '5:00PM', value: '0 17' },
  { label: '5:15PM', value: '15 17' },
  { label: '5:30PM', value: '30 17' },
  { label: '5:45PM', value: '45 17' },
  { label: '6:00PM', value: '0 18' },
  { label: '6:15PM', value: '15 18' },
  { label: '6:30PM', value: '30 18' },
  { label: '6:45PM', value: '45 18' },
  { label: '7:00PM', value: '0 19' },
  { label: '7:15PM', value: '15 19' },
  { label: '7:30PM', value: '30 19' },
  { label: '7:45PM', value: '45 19' },
  { label: '8:00PM', value: '0 20' },
  { label: '8:15PM', value: '15 20' },
  { label: '8:30PM', value: '30 20' },
  { label: '8:45PM', value: '45 20' },
  { label: '9:00PM', value: '0 21' },
  { label: '9:15PM', value: '15 21' },
  { label: '9:30PM', value: '30 21' },
  { label: '9:45PM', value: '45 21' },
  { label: '10:00PM', value: '0 22' },
  { label: '10:15PM', value: '15 22' },
  { label: '10:30PM', value: '30 22' },
  { label: '10:45PM', value: '45 22' },
  { label: '11:00PM', value: '0 23' },
  { label: '11:15PM', value: '15 23' },
  { label: '11:30PM', value: '30 23' },
  { label: '11:45PM', value: '45 23' },
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
                <RadixSelect.SelectItem key={item.value} value={item.value}>
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
