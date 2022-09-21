import * as UI from '@haas/ui';
import { CompactEntriesPath } from 'views/DialogueView/Modules/InteractionFeedModule/InteractionFeedEntry';
import { Icon } from '@chakra-ui/core';
import { User } from 'react-feather';
import { differenceInCalendarDays, format, formatDistance } from 'date-fns';
import React from 'react';

import { SessionFragment } from 'types/generated-types';
import { useTranslation } from 'react-i18next';
import scoreToColors from 'utils/scoreToColors';

interface CellProps {
  value: any;
}

interface ContactableUserCellProps {
  sessionId: string;
  followUpAction?: SessionFragment.FollowUpAction | null;
}

export const ContactableUserCell = ({ sessionId, followUpAction }: ContactableUserCellProps) => {
  const { t } = useTranslation();
  const field = followUpAction?.values?.find((value) => value?.shortText || value?.email || '');
  return (
    <UI.Flex alignItems="center">
      <UI.ColumnFlex>
        <UI.Span fontWeight={600} color="off.500">
          {field?.shortText || field?.email || t('anonymous') as string}
        </UI.Span>
        <UI.Span color="off.300" fontSize="0.7rem">
          {sessionId}
        </UI.Span>
      </UI.ColumnFlex>
    </UI.Flex>
  );
};

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
    <UI.Div m="0" padding="4px 24px" borderRadius="90px" backgroundColor="#f1f5f8" color="#6d767d">
      <UI.Span fontSize="0.8em" fontWeight={900}>{formatted?.toUpperCase()}</UI.Span>
    </UI.Div>
  );
};

export const ScoreCell = ({ value }: CellProps) => {
  const { background, color } = scoreToColors(value);
  const decimalScore = (value) ? (value / 10).toFixed(1) : value;
  return (
    <UI.Flex alignItems="center">
      <UI.Div
        useFlex
        alignItems="center"
        justifyContent="center"
        padding="10px"
        borderRadius="90px"
        width="50px"
        height="50px"
        backgroundColor={background}
        color={color}
      >
        <UI.Flex alignItems="center" justifyContent="center">
          <UI.Span fontSize="1.2em" fontWeight={900}>
            {decimalScore}
          </UI.Span>
        </UI.Flex>
      </UI.Div>
    </UI.Flex>
  );
};

export const UserCell = ({ value }: CellProps) => (
  <UI.Flex alignItems="center">
    <UI.Div display="inline-block" padding="4px 24px" borderRadius="90px" backgroundColor="#f1f5f8" color="#6d767d">
      <UI.Span fontSize="0.8em" fontWeight={900}>{value}</UI.Span>
    </UI.Div>
  </UI.Flex>
);

export const InteractionUserCell = ({ value }: CellProps) => (
  <UI.Flex alignItems="center">
    <UI.Div
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
    </UI.Div>
    <UI.Flex minWidth="195px" marginLeft="15px" flexDirection="column">
      <UI.Text color="gray.500" fontWeight="600">User</UI.Text>
      <UI.Span color="gray.400" fontWeight="400" fontSize="0.5em">{value}</UI.Span>
    </UI.Flex>
  </UI.Flex>
);

export const InteractionDateCell = ({ value }: { value: any }) => {
  const date = new Date(parseInt(value, 10));

  const formattedDate = format(date, 'LLL d');
  const formattedTime = format(date, 'h:mm a');

  return (
    <UI.Flex alignItems="center">
      <UI.Div>
        <UI.Text color="gray.500" fontWeight="600">{formattedDate?.toUpperCase()}</UI.Text>
        <UI.Span color="gray.400" fontWeight="400" fontSize="0.8em">{formattedTime}</UI.Span>
      </UI.Div>
    </UI.Flex>
  );
};

export const InteractionPathCell = ({ value: nodeEntries }: CellProps) => (
  <UI.Flex alignItems="center">
    <UI.Flex minWidth="195px" flexDirection="column">
      <CompactEntriesPath nodeEntries={nodeEntries} />
    </UI.Flex>
  </UI.Flex>
);
