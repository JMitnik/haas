import { Div, Flex, Grid, H4, Loader, Span } from '@haas/ui';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import React, { useState } from 'react';
import styled, { css } from 'styled-components/macro';

import Modal from 'components/Modal';

import { ReactComponent as PathsIcon } from 'assets/icons/icon-launch.svg';
import { ReactComponent as TrendingIcon } from 'assets/icons/icon-trending-up.svg';
import { ReactComponent as TrophyIcon } from 'assets/icons/icon-trophy.svg';

import DatePicker from 'components/DatePicker';
import gql from 'graphql-tag';
import InteractionFeedModule from './Modules/InteractionFeedModule/InteractionFeedModule';
import NegativePathsModule from './Modules/NegativePathsModule/index.tsx';
import NodeEntriesOverview from '../NodeEntriesOverview/NodeEntriesOverview';
import PositivePathsModule from './Modules/PositivePathsModule/PositivePathsModule';
import ScoreGraphModule from './Modules/ScoreGraphModule';
import SummaryAverageScoreModule from './Modules/SummaryModules/SummaryAverageScoreModule';
import SummaryCallToActionModule from './Modules/SummaryModules/SummaryCallToActionModule';
import SummaryInteractionCountModule from './Modules/SummaryModules/SummaryInteractionCountModule';
import SummaryModuleContainer from './Modules/SummaryModules/SummaryModuleContainer';
import getQuestionnaireData from '../../queries/getQuestionnaireData';

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
        id
        countInteractions
        averageScore
        interactionFeedItems {
          id
          createdAt
          score
        }
        statistics {
          topPositivePath {
            answer
            quantity
          }
          topNegativePath {
            quantity
            answer
          }
          
          lineChartData {
            x
            y
          }
        } 
      }
    }
  }
`;

const DialogueView = () => {
  const { dialogueSlug, customerSlug } = useParams();
  const [activeSession, setActiveSession] = useState('');
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

  return (
    <DialogueViewContainer>
      <Grid gridTemplateColumns="1fr 1fr 1fr">
        <Div gridColumn="1 / 4">
          <H4 color="default.darker" mb={4}>
            <Flex>
              <Div width="20px">
                <TrendingIcon fill="currentColor" />
              </Div>
              <Span ml={2}>
                This week in summary
              </Span>
            </Flex>
          </H4>
          <SummaryModuleContainer>
            <SummaryInteractionCountModule interactionCount={dialogue.countInteractions} />
            <SummaryAverageScoreModule averageScore={dialogue.averageScore} />
            <SummaryCallToActionModule callToActionCount={0} />
          </SummaryModuleContainer>
        </Div>

        <Div mt={2} gridColumn="1 / 4">
          <H4 color="default.darker" mb={4}>
            <Flex>
              <Div width="20px">
                <PathsIcon fill="currentColor" />
              </Div>
              <Span ml={2}>
                Notable paths of the week
              </Span>
            </Flex>
          </H4>
          <Grid gridTemplateColumns="1fr 1fr">
            <PositivePathsModule positivePaths={dialogue.statistics?.topPositivePath} />
            <NegativePathsModule negativePaths={dialogue.statistics?.topNegativePath} />
          </Grid>
        </Div>

        <Div gridColumn="span 3">
          <H4 color="default.darker">
            <Flex>
              <Div width="20px">
                <TrophyIcon fill="currentColor" />
              </Div>
              <Span ml={2}>
                The latest data
              </Span>
            </Flex>
          </H4>
        </Div>

        <Div gridColumn="span 2">
          <ScoreGraphModule chartData={dialogue.statistics?.lineChartData} />
        </Div>
        <InteractionFeedModule
          onActiveSessionChange={setActiveSession}
          timelineEntries={dialogue?.interactionFeedItems}
        />

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
