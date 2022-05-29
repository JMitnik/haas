import * as UI from '@haas/ui';
import { ArrowRightCircle } from 'react-feather';
import React from 'react';

interface UrgentPathWidgetProps {
  topic: string;
  dialogueTitle: string;
  dialogueLabel: string;
  responseCount: number;
  onClick: () => void;
}

export const UrgentTopicWidget = ({
  topic,
  dialogueTitle,
  responseCount,
  onClick,
  dialogueLabel = 'Team'
}: UrgentPathWidgetProps) => (
  <UI.NewCard boxShadow="md" bg="red.500">
    <UI.CardBodyLarge>
      <UI.Flex justifyContent="space-between">
        <UI.Helper fontSize="1.1rem" fontWeight={600} color="red.100" mb={2}>
          Urgent issue
        </UI.Helper>
        <UI.Helper color="red.100">
          <UI.Span ml={4}>
            in
            {' '}
            {dialogueLabel}
            {' '}
            {dialogueTitle}
          </UI.Span>
        </UI.Helper>
      </UI.Flex>
      <UI.Div maxWidth={500} mt={2}>
        <UI.Text fontSize="1rem" fontWeight={500} color="white" my={1} lineHeight="1">
          We have detected
          {' '}
          {responseCount}
          {' '}
          problematic sign related to
          {' '}
          {' '}
          <UI.Strong>
            {topic}
          </UI.Strong>
          .
        </UI.Text>
      </UI.Div>

      <UI.Div
        style={{ cursor: 'pointer' }}
        onClick={onClick}
        color="red.100"
        mt={3}
        display="flex"
        alignItems="center"
      >
        <UI.Icon color="red.200" mr={2} fontSize={0.8}>
          <ArrowRightCircle />
        </UI.Icon>

        <UI.Span fontSize="1rem" fontWeight={600}>
          Take action
        </UI.Span>
      </UI.Div>
    </UI.CardBodyLarge>
  </UI.NewCard>
);
