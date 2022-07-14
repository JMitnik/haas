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
import { orderBy } from 'lodash';
import { slideUpFadeMotion } from 'components/animation/config';
import { useCustomer } from 'providers/CustomerProvider';
import { useUser } from 'providers/UserProvider';
import SearchBar from 'components/Common/SearchBar';
import Searchbar from 'components/Common/SearchBar';
import endOfDay from 'date-fns/endOfDay';

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

type Day = 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';

const days: { index: number, label: Day }[] = [
  {
    index: 0,
    label: 'SUN',
  },
  {
    index: 1,
    label: 'MON',
  },
  {
    index: 2,
    label: 'TUE',
  },
  {
    index: 3,
    label: 'WED',
  },
  {
    index: 4,
    label: 'THU'
  },
  {
    index: 5,
    label: 'FRI',
  },
  {
    index: 6,
    label: 'SAT'
  }
];

const DaySelector = styled(UI.Div) <{ isSelected?: boolean, isWithinRange?: boolean }>`
${({ isSelected, isWithinRange, theme }) => css`
  display: flex;
  justify-content: center;
  cursor: pointer;
  padding: 0.5em;
  border-radius: 180px;
  
  color: auto;

  ${isWithinRange && css`
    background-color: ${theme.colors.main['50']};
  `}

  ${isSelected && css`
    background-color: ${isSelected ? theme.colors.main['500'] : 'auto'};
    color: white;
  `}
`}
`;

interface DayPickerProps {
  onClose: () => void;
  onChange: (dayRange: { label: Day, index: number }[]) => void;
  // onSetDates
}

export const WorkspaceSwitchContent = ({ onClose, onChange }: DayPickerProps) => {
  const [isSelected, setIsSelected] = useState(false);
  const [selected, setSelected] = useState<{ label: Day, index: number }[]>([]);

  const handleDateSelection = (entry: { label: Day, index: number }) => {
    if (!isSelected) {
      setIsSelected(true);
      setSelected([entry]);
    }

    if (isSelected && selected.length === 1) {
      if (selected[0].label === entry.label) {
        setIsSelected(false);
        setSelected([]);
      } else {
        setSelected((prevSelected) => orderBy([...prevSelected, entry], (day) => day.index));
      }
    }

    if (isSelected && selected.length === 2) {
      setSelected([entry]);
    }
  };

  const isWithinSelectedDates = (index: number) => {
    if (selected.length < 2) return false;
    if (index > selected[0].index && index < selected[1].index) return true;
    return false;
  };

  useEffect(() => {
    onChange(selected);
  }, [selected]);

  console.log('Selected: ', selected);

  return (
    <UI.Card>
      <UI.Grid padding="1em" gridTemplateColumns="repeat(7, 1fr)">
        {days.map((day) => {
          const isWithinRange = isWithinSelectedDates(day.index);

          return (
            <DaySelector
              isSelected={!!selected.find((selected) => day.label === selected.label)}
              isWithinRange={isWithinRange}
              onClick={() => handleDateSelection(day)}
            >
              {day.label}

            </DaySelector>
          );
        })}
      </UI.Grid>
    </UI.Card>
  );
};

export const DayPicker = () => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = useState('');

  console.log('Search: ', search);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger style={{ width: '100%', zIndex: 1000 }}>
        <UI.Input value={search} />
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
              <WorkspaceSwitchContent
                onChange={(dayRange) => setSearch(dayRange.map((day) => day.label).join('-'))}
                onClose={() => setOpen(false)}
              />
            </motion.div>
          </Content>
        ) : null}
      </AnimatePresence>
    </Popover.Root>
  );
};
