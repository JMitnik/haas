import { Div, Flex, H4, Span } from '@haas/ui';
import { differenceInCalendarDays, format, formatDistance } from 'date-fns';
import { maxBy } from 'lodash';
import DesktopIcon from 'components/Icons/DesktopIcon';
import React from 'react';

interface CellProps {
  value: any;
}

export const WhenCell = ({ value }: { value: any }) => {
  const date = new Date(parseInt(value, 10));
  const currentDate = new Date();
  const dateDifference = differenceInCalendarDays(currentDate, date);

  let formatted;
  if (dateDifference <= 4 || dateDifference >= 7) {
    formatted = `${formatDistance(date, currentDate)} ago`;
  } else if (dateDifference > 4 && dateDifference < 7) {
    formatted = format(date, 'EEEE hh:mm a');
  }

  return (
    <Div m="0" padding="4px 24px" borderRadius="90px" backgroundColor="#f1f5f8" color="#6d767d">
      <Span fontSize="0.8em" fontWeight={900}>{formatted?.toUpperCase()}</Span>
    </Div>
  );
};

const getBadgeBackgroundColour = (value: number) => {
  if (value >= 70) return { background: '#58D173', color: 'white' };
  if (value > 50 && value < 70) return { background: '#ffa500', color: 'white' };
  return { background: '#FF3A3A', color: 'white' };
};

export const ScoreCell = ({ value }: CellProps) => {
  const { background, color } = getBadgeBackgroundColour(value);
  const decimalScore = (value) ? (value / 10).toFixed(1) : value;
  return (
    <Flex alignItems="center">
      <Div display="inline-block" padding="10px" borderRadius="90px" backgroundColor={background} color={color}>
        <Span fontSize="1.2em" fontWeight={900}>
          {decimalScore}
        </Span>
      </Div>
    </Flex>
  );
};

export const UserCell = ({ value }: CellProps) => (
  <Flex alignItems="center">
    <Div display="inline-block" padding="4px 24px" borderRadius="90px" backgroundColor="#f1f5f8" color="#6d767d">
      <Span fontSize="0.8em" fontWeight={900}>{value}</Span>
    </Div>
  </Flex>
);

export const InteractionUserCell = ({ value }: CellProps) => (
  <Flex alignItems="center">
    <Div borderRadius="lg" padding="5px" backgroundColor="default.light">
      <DesktopIcon />
    </Div>
    <Flex minWidth="195px" marginLeft="15px" flexDirection="column">
      <H4 color="default.darker">Desktop user</H4>
      <Span color="default.dark" fontSize="0.8em" fontWeight={900}>{value}</Span>
    </Flex>
  </Flex>
);

export const InteractionDateCell = ({ value }: { value: any }) => {
  const date = new Date(parseInt(value, 10));
  // const currentDate = new Date();
  // const dateDifference = differenceInCalendarDays(currentDate, date);

  const formattedDate = format(date, 'LLL d');
  const formattedTime = format(date, 'h:mm a');

  return (
    <Flex flexDirection="column" alignItems="center">
      <Div>
        <H4 color="default.darker">{formattedDate?.toUpperCase()}</H4>
        <Span color="default.dark" fontSize="0.8em" fontWeight={900}>{formattedTime}</Span>
      </Div>

    </Flex>
  );
};

export const InteractionCTACell = ({ value: nodeEntries }: CellProps) => {
  const potentialCTA = maxBy(nodeEntries, (entry: any) => entry.depth);

  const getCTAType = (potentialCTA: any) => {
    const { value: { textboxNodeEntry, linkNodeEntry, registrationNodeEntry } } = potentialCTA;
    if (textboxNodeEntry) {
      return 'Feedback';
    }

    if (linkNodeEntry) {
      return 'Link';
    }

    if (registrationNodeEntry) {
      return 'Register';
    }

    return 'No CTA';
  };

  return (
    <Flex alignItems="center">
      <Flex minWidth="195px" marginLeft="15px" flexDirection="column">
        <H4 color="default.darker">{getCTAType(potentialCTA)}</H4>
        <Span color="default.dark" fontSize="0.8em" fontWeight={900}>No registration</Span>
      </Flex>
    </Flex>
  );
};

export const CenterCell = ({ value }: CellProps) => (
  <Flex alignItems="center">
    <Div display="inline-block">
      <Span fontSize="1.2em" fontWeight={900}>{value}</Span>
    </Div>
  </Flex>
);
