import { Div, Loader } from '@haas/ui';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import React, { useState } from 'react';

import Modal from 'components/Modal';

import DatePicker from 'components/DatePicker';
import NegativePathsModule from './Modules/NegativePathsModule/index.tsx';
import NodeEntriesOverview from '../NodeEntriesOverview/NodeEntriesOverview';
import PositivePathsModule from './Modules/PositivePathsModule/PositivePathsModule';
import getQuestionnaireData from '../../queries/getQuestionnaireData';

const filterMap = new Map([
  ['Last 24h', 1],
  ['Last week', 7],
  ['Last month', 30],
  ['Last year', 365],
]);

const DialogueView = () => {
  const { dialogueId } = useParams();
  const [activeSession] = useState('');
  const location = useLocation<any>();

  // FIXME: If this is started with anything else start result is undefined :S
  const [activeFilter, setActiveFilter] = useState(() => 'Last 24h');

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
    <>
      <PositivePathsModule positivePaths={resultData?.topPositivePath} />
      <NegativePathsModule negativePaths={resultData?.topNegativePath} />
      <Div gridColumn="span 2">
        {lineData && (
        <p>ss</p>
        // <ScoreGraphModule data={lineData} />
        )}
      </Div>
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
    </>
  );
};

export default DialogueView;
