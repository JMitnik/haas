import { Div, Flex, Span } from '@haas/ui';
import { differenceInCalendarDays, format, formatDistance } from 'date-fns';
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
    <Flex alignItems="center" justifyContent="center">
      <Div display="inline-block" padding="4px 24px" borderRadius="90px" backgroundColor="#f1f5f8" color="#6d767d">
        <Span fontSize="0.8em" fontWeight={900}>{formatted?.toUpperCase()}</Span>
      </Div>
    </Flex>
  );
};

const getBadgeBackgroundColour = (value: number) => {
  if (value >= 70) return { background: '#e2f0c7', color: '#42c355' };
  if (value > 50 && value < 70) return { background: '#f2dda5', color: '#dd992a' };
  return { background: '#f5c4c0', color: '#d5372c' };
};

export const ScoreCell = ({ value }: CellProps) => {
  const { background, color } = getBadgeBackgroundColour(value);
  return (
    <Flex alignItems="center" justifyContent="center">
      <Div display="inline-block" padding="10px" borderRadius="90px" backgroundColor={background} color={color}>
        <Span fontSize="1.2em" fontWeight={900}>
          {value}
        </Span>
      </Div>
    </Flex>
  );
};

export const UserCell = ({ value }: CellProps) => (
  <Flex alignItems="center" justifyContent="center">
    <Div display="inline-block" padding="4px 24px" borderRadius="90px" backgroundColor="#f1f5f8" color="#6d767d">
      <Span fontSize="0.8em" fontWeight={900}>{value}</Span>
    </Div>
  </Flex>
);

export const CenterCell = ({ value }: CellProps) => (
  <Flex alignItems="center" justifyContent="center">
    <Div display="inline-block">
      <Span fontSize="1.2em" fontWeight={900}>{value}</Span>
    </Div>
  </Flex>
);
