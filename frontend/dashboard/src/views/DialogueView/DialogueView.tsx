import { Div, Grid, H3, Loader } from '@haas/ui';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import React, { useState } from 'react';
import styled, { css } from 'styled-components/macro';

import DialogueLayout from 'layouts/DialogueLayout';
import Modal from 'components/Modal';

import DialogueInfo from './DialogueInfo';
import InteractionFeedModule from './Modules/InteractionFeedModule/InteractionFeedModule';
import NegativePathsModule from './Modules/NegativePathsModule/index.tsx';
import NodeEntriesOverview from '../NodeEntriesOverview/NodeEntriesOverview';
import PositivePathsModule from './Modules/PositivePathsModule/PositivePathsModule';
import ScoreGraphModule from './Modules/ScoreGraphModule';
import getQuestionnaireData from '../../queries/getQuestionnaireData';

const filterMap = new Map([
  ['Last 24h', 1],
  ['Last week', 7],
  ['Last month', 30],
  ['Last year', 365],
]);

const FilterButton = styled(Div)`
  ${({ theme, isActive }: { theme: any, isActive: boolean }) => css`
    border-radius: 12px;
    padding: 10px;
    margin: 5px;
    cursor: pointer;

    ${isActive && css`
      background: ${theme.colors.primary};
    `}

    ${!isActive && css`
      &:hover {
        background: ${theme.colors.default.normal};
      }
    `}
  `}
`;

const DialogueView = () => {
  const { customerId, dialogueId } = useParams();
  const [activeSession, setActiveSession] = useState('');
  const location = useLocation<any>();

  // FIXME: If this is started with anything else start result is undefined :S
  const [activeFilter, setActiveFilter] = useState('Last 24h');

  // TODO: Move this to page level
  const { loading, data } = useQuery(getQuestionnaireData, {
    variables: {
      dialogueId,
      filter: filterMap.get(activeFilter),
    },
    pollInterval: 5000,
  });

  if (loading) return <Loader />;

  const resultData = data?.getQuestionnaireData;
  const lineQueryData = resultData?.lineChartData;
  let timelineEntries: Array<any> = resultData?.timelineEntries;
  timelineEntries = timelineEntries?.length > 8 ? timelineEntries.slice(0, 8) : timelineEntries;

  const lineData = [
    {
      id: 'score',
      color: 'hsl(38, 70%, 50%)',
      data: lineQueryData,
    },
  ];

  return (
    <DialogueLayout dialogue={data?.getQuestionnaireData}>
      <Div px="24px" margin="0 auto">
        <Div height="100vh" maxHeight="100vh" overflow="hidden">
          <Grid gridTemplateColumns="3fr 1fr">
            <Div>
              <DialogueInfo DialogueResultProps={resultData} customerId={customerId} dialogueId={dialogueId} />
              <Grid gridTemplateColumns="1fr 1fr" gridTemplateRows="1fr 100px 3fr">
                <Div gridColumn="span 2">
                  <H3>Filter</H3>
                  <Div display="flex">
                    <FilterButton isActive={activeFilter === 'Last 24h'} onClick={() => setActiveFilter('Last 24h')}>Last 24h</FilterButton>
                    <FilterButton isActive={activeFilter === 'Last week'} onClick={() => setActiveFilter('Last week')}>Last week</FilterButton>
                    <FilterButton isActive={activeFilter === 'Last month'} onClick={() => setActiveFilter('Last month')}>Last month</FilterButton>
                    <FilterButton isActive={activeFilter === 'Last year'} onClick={() => setActiveFilter('Last year')}>Last year</FilterButton>
                  </Div>
                </Div>

                <PositivePathsModule positivePaths={resultData?.topPositivePath} />
                <NegativePathsModule negativePaths={resultData?.topNegativePath} />
                <Div gridColumn="span 2">
                  {lineData && (
                    <p>ss</p>
                    // <ScoreGraphModule data={lineData} />
                  )}
                </Div>
              </Grid>
            </Div>

            <Div>
              <InteractionFeedModule
                onActiveSessionChange={setActiveSession}
                timelineEntries={timelineEntries}
              />
            </Div>
          </Grid>
        </Div>

        {location?.state?.modal && (
          <Modal>
            <NodeEntriesOverview sessionId={activeSession} />
          </Modal>
        )}
      </Div>
    </DialogueLayout>
  );
};

export default DialogueView;
