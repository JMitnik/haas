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
  dialogueLabel = 'Team',
}: UrgentPathWidgetProps) => (
  <UI.NewCard
    hasHover
    height="100%"
    boxShadow="md"
    bg="red.500"
    display="flex"
    flexDirection="column"
    onClick={onClick}
  >
    <UI.CardBodyLarge flexGrow={1}>
      <UI.Flex>
        <UI.Helper fontSize="1.1rem" fontWeight={600} color="red.100" mb={2}>
          Urgent issue
        </UI.Helper>
      </UI.Flex>
      <UI.Div maxWidth={500} mt={4}>
        <UI.Text fontSize="1.2rem" color="white" fontWeight={700}>
          {topic}
        </UI.Text>
        <UI.Text color="red.50">
          in
          {' '}
          {dialogueLabel}
          {' '}
          <i>
            {dialogueTitle}
          </i>
        </UI.Text>
        <UI.Text color="red.50" fontWeight={400}>
          based on
          {' '}
          {responseCount}
          {' '}
          responses
        </UI.Text>
      </UI.Div>
    </UI.CardBodyLarge>

    <UI.CardFooter bg="red.600" color="red.100">
      <UI.Flex alignItems="center">
        <UI.Icon display="inline-block" mr={2}>
          <ArrowRightCircle width={21} />
        </UI.Icon>
        <UI.Span color="white" fontWeight={600}>
          Take Action
        </UI.Span>
      </UI.Flex>
    </UI.CardFooter>
  </UI.NewCard>
);
