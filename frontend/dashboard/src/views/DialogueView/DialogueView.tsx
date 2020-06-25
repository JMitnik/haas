import { Div, Grid, H4, Loader, Flex } from '@haas/ui';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import React, { useState } from 'react';
import styled, { css } from 'styled-components/macro';

import Modal from 'components/Modal';

import DatePicker from 'components/DatePicker';
import gql from 'graphql-tag';
import NegativePathsModule from './Modules/NegativePathsModule/index.tsx';
import NodeEntriesOverview from '../NodeEntriesOverview/NodeEntriesOverview';
import PositivePathsModule from './Modules/PositivePathsModule/PositivePathsModule';
import SummaryAverageScoreModule from './Modules/SummaryModules/SummaryAverageScoreModule';
import SummaryInteractionCountModule from './Modules/SummaryModules/SummaryInteractionCountModule';
import getQuestionnaireData from '../../queries/getQuestionnaireData';
import SummaryModuleContainer from './Modules/SummaryModules/SummaryModuleContainer';
import SummaryCallToActionModule from './Modules/SummaryModules/SummaryCallToActionModule';

const filterMap = new Map([
  ['Last 24h', 1],
  ['Last week', 7],
  ['Last month', 30],
  ['Last year', 365],
]);

const DialogueViewContainer = styled(Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter * 2}px 0;
  `}
`;

const getDialogueStatistics = gql`
  query dialogueStatistics($customerSlug: String!, $dialogueSlug: String!) {
    customer(slug: $customerSlug) {
      id
      dialogue(where: { slug: $dialogueSlug }) {
        countInteractions
        averageScore      
      }
    }
  }
`;

const DialogueView = () => {
  const { dialogueSlug, customerSlug } = useParams();
  const [activeSession] = useState('');
  const location = useLocation<any>();

  // FIXME: If this is started with anything else start result is undefined :S
  const [activeFilter, setActiveFilter] = useState(() => 'Last 24h');

  // TODO: Move this to page level
  const { data, loading } = useQuery(getDialogueStatistics, {
    variables: {
      dialogueSlug,
      customerSlug,
    },
    pollInterval: 5000,
  });

  const dialogue = data?.customer?.dialogue;

  if (!dialogue) return <Loader />;

  console.log(data);

  // const lineQueryData = resultData?.lineChartData;
  // let timelineEntries: Array<any> = resultData?.timelineEntries;
  // timelineEntries = timelineEntries?.length > 8 ? timelineEntries.slice(0, 8) : timelineEntries;

  // const lineData = [
  //   {
  //     id: 'score',
  //     color: 'hsl(38, 70%, 50%)',
  //     data: lineQueryData,
  //   },
  // ];

  return (
    <DialogueViewContainer>
      <Grid gridTemplateColumns="1fr 1fr 1fr" gridTemplateRows="1fr 1fr">
        <Div gridColumn="1 / 4">
          <H4 color="default.darker" mb={4}>This week in summary</H4>
          <SummaryModuleContainer>
            <SummaryInteractionCountModule interactionCount={dialogue.countInteractions} />
            <SummaryAverageScoreModule averageScore={dialogue.averageScore} />
            <SummaryCallToActionModule callToActionCount={0} />
          </SummaryModuleContainer>
        </Div>

        <Div >

        </Div>
        {/* <PositivePathsModule positivePaths={resultData?.topPositivePath} />
        <NegativePathsModule negativePaths={resultData?.topNegativePath} />
        <Div gridColumn="span 2">
          {lineData && (
          <p>ss</p>
          // <ScoreGraphModule data={lineData} />
          )}
        </Div> */}
        {/*
      <Div>
        <InteractionFeedModule
          onActiveSessionChange={setActiveSession}
          timelineEntries={timelineEntries}
        />
      </Div> */}

        {location?.state?.modal && (
        <Modal>
          <NodeEntriesOverview sessionId={activeSession} />
        </Modal>
      )}
      </Grid>
    </DialogueViewContainer>
  );
};

export default DialogueView;
