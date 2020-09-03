import { CompactEntriesPath } from 'views/DialogueView/Modules/InteractionFeedModule/InteractionFeedEntry';
import { Div, Flex, Span, Text } from '@haas/ui';
import { Icon } from '@chakra-ui/core';
import { User } from 'react-feather';
import { differenceInCalendarDays, format, formatDistance } from 'date-fns';
import { maxBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import React from 'react';
import scoreToColors from 'utils/scoreToColors';

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

export const ScoreCell = ({ value }: CellProps) => {
  const { background, color } = scoreToColors(value);
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
    <Div
      borderRadius="lg"
      padding="5px"
      backgroundColor="gray.300"
      display="flex"
      alignItems="center"
      width="30px"
      height="30px"
      justifyContent="center"
    >
      <Icon
        as={User}
        color="gray.500"
      />
    </Div>
    <Flex minWidth="195px" marginLeft="15px" flexDirection="column">
      <Text color="gray.500" fontWeight="600">User</Text>
      <Span color="gray.400" fontWeight="400" fontSize="0.5em">{value}</Span>
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
    <Flex alignItems="center">
      <Div>
        <Text color="gray.500" fontWeight="600">{formattedDate?.toUpperCase()}</Text>
        <Span color="gray.400" fontWeight="400" fontSize="0.8em">{formattedTime}</Span>
      </Div>
    </Flex>
  );
};

export const InteractionPathCell = ({ value: nodeEntries }: CellProps) => {
  const { t } = useTranslation();
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
      <Flex minWidth="195px" flexDirection="column">
        <CompactEntriesPath nodeEntries={nodeEntries} />
      </Flex>
    </Flex>
  );
};
