import { format } from 'date-fns';
import React from 'react';

import { Div, H5 } from '@haas/ui';

import {
  dialogueStatistics_customer_dialogue_sessions as Session,
} from 'views/DialogueView/__generated__/dialogueStatistics';

import { InteractionFeedEntryContainer, InteractionFeedEntryValueContainer } from './InteractionFeedEntryStyles';

const InteractionFeedEntry = ({ interaction }: { interaction: Session }) => {
  const date = new Date(parseInt(interaction.createdAt, 10));
  const acceptedDate = format(date, 'dd-LLL-yyyy HH:mm:ss');

  return (
    <InteractionFeedEntryContainer>
      <InteractionFeedEntryValueContainer value={interaction.score}>
        {Number(interaction.score / 10).toFixed(1)}
      </InteractionFeedEntryValueContainer>
      <Div useFlex justifyContent="flex-end" gridColumn="2">
        <H5 color="app.mutedAltOnWhite">
          {acceptedDate}
        </H5>
      </Div>
    </InteractionFeedEntryContainer>
  );
};

export default InteractionFeedEntry;
