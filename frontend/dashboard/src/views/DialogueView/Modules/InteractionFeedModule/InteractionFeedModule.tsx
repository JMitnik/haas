import React from 'react';

import { Card, CardBody, Div, Flex, H3, H4, Span } from '@haas/ui';

import { Info } from 'react-feather';
import {
  dialogueStatistics_customer_dialogue_sessions as Session,
} from 'views/DialogueView/__generated__/dialogueStatistics';

import { InteractionFeedEntriesContainer } from './InteractionFeedModuleStyles';
import InteractionFeedEntry from './InteractionFeedEntry';

const InteractionFeedModule = ({ interactions } : { interactions: Session[] }) => (
  <Card bg="white" noHover>
    <CardBody useFlex height="100%" flexDirection="column">

      <H3 color="app.onWhite">
        <Flex justifyContent="space-between" alignItems="center">
          <Span>Latest interactions</Span>
        </Flex>
      </H3>

      <InteractionFeedEntriesContainer>
        {interactions?.length > 0 && interactions?.map((interaction, index) => (
          <InteractionFeedEntry
            key={index}
            interaction={interaction}
          />
        ))}
      </InteractionFeedEntriesContainer>

      {(interactions?.length === 0 || (!interactions)) && (
        <Flex flexGrow={1} justifyContent="center" alignItems="center">
          <Div color="default.darker" marginRight="5px">
            <Info />
          </Div>
          <H4 color="default.darker">No data available</H4>
        </Flex>
      )}
    </CardBody>
  </Card>
);
export default InteractionFeedModule;
