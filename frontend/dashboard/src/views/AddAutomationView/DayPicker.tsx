import * as Popover from '@radix-ui/react-popover';
import * as UI from '@haas/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { orderBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { slideUpFadeMotion } from 'components/animation/config';

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
    label: 'THU',
  },
  {
    index: 5,
    label: 'FRI',
  },
  {
    index: 6,
    label: 'SAT',
  },
];

const DaySelector = styled(UI.Div) <{ isSelected?: boolean, isWithinRange?: boolean }>`
${({ isSelected, isWithinRange, theme }) => css`
  display: flex;
  justify-content: center;
  cursor: pointer;
  padding: 0.5em;
  border-radius: 180px;
  border: 1px solid ${theme.colors.main['50']};
  box-shadow: ${theme.boxShadows.md};

  color: auto;

  ${isWithinRange && css`
    background-color: ${theme.colors.main['50']};
  `}

  ${isSelected && css`
    background-color: ${isSelected ? theme.colors.main['500'] : 'auto'};
    color: white;
  `}

  ${!isSelected && css`
    :hover {
      background-color: ${theme.colors.main['50']};
    }
  `}
`}
`;

enum DayMap {
  MON = 'Monday',
  TUE = 'Tuesday',
  WED = 'Wednesday',
  THU = 'Thursday',
  FRI = 'Friday',
  SAT = 'Saturday',
  SUN = 'Sunday',
}

interface DayPickerProps {
  onChange: (dayRange: { label: Day, index: number }[]) => void;
  value?: { label: Day, index: number }[];
}

export const DayPickerContent = ({ value, onChange }: DayPickerProps) => {
  const [isSelected, setIsSelected] = useState(false);
  const [selected, setSelected] = useState<{ label: Day, index: number }[]>(value || []);

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

  return (
    <UI.Card>
      <UI.Grid padding="0.5em" gridTemplateColumns="repeat(7, 1fr)">
        {days.map((day) => {
          const isWithinRange = isWithinSelectedDates(day.index);

          return (
            <DaySelector
              isSelected={!!value?.find((dayEntry) => day.label === dayEntry.label)}
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

interface DayPickerSelectProps {
  onChange: (dayRange: { label: Day, index: number }[]) => void;
  value: { label: string, index: number }[];
}

export const DayPicker = ({ onChange, value }: DayPickerSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();

  const findDayName = (input: { label: Day, index: number }) => {
    const dLabel = DayMap[input.label].toLowerCase();
    const translated = t(dLabel);
    return translated;
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger style={{ width: '100%', zIndex: 1000 }}>
        <UI.Input
          color="main.500"
          style={{ cursor: 'pointer' }}
          value={value?.map((day) => findDayName(day as any)).join('-')}
        />
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
              <DayPickerContent
                value={value as any}
                onChange={(dayRange) => onChange(dayRange)}
              />
            </motion.div>
          </Content>
        ) : null}
      </AnimatePresence>
    </Popover.Root>
  );
};
