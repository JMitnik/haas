import * as UI from '@haas/ui';
import { DateFormat, useDate } from 'hooks/useDate';
import { useCustomer } from 'providers/CustomerProvider';
import React from 'react';

import { DialogueImpactScoreType, useGetWorkspaceSummaryDetailsQuery } from 'types/generated-types';

import { HexagonNodeType } from '../WorkspaceGrid.types';
import { SummaryPaneProps } from './WorkspaceSummaryPane.types';

export const WorkspaceSummaryPane = ({ currentState }: SummaryPaneProps) => {
  const { activeCustomer } = useCustomer();
  const { getTomorrow, getStartOfWeek, format } = useDate();

  const { data, loading } = useGetWorkspaceSummaryDetailsQuery({
    variables: {
      id: activeCustomer?.id,
      healthInput: {
        startDateTime: format(getStartOfWeek(), DateFormat.DayFormat),
        endDateTime: format(getTomorrow(), DateFormat.DayFormat),
      },
      summaryInput: {
        impactType: DialogueImpactScoreType.Average,
        startDateTime: format(getStartOfWeek(), DateFormat.DayFormat),
        endDateTime: format(getTomorrow(), DateFormat.DayFormat),
        refresh: true,
      },
    },
  });

  const voteCount = currentState.childNodes.reduce((acc, node) => {
    if (node.type === HexagonNodeType.Group) {
      return acc + (node?.statistics?.voteCount ?? 0);
    }

    return acc;
  }, 0);

  return (
    <UI.Div mt={4}>
      <UI.H2 fontWeight={600} mb={4} color="main.500">Club hades</UI.H2>

      <UI.Grid gridTemplateColumns="1fr 1fr">
        <UI.NewCard boxShadow="md">
          <UI.CardBody>
            <UI.Text fontSize="1.1rem" fontWeight={500} color="off.500">
              Number of interactions
            </UI.Text>
            <UI.Text fontSize="1.7rem" fontWeight={700} color="off.600">
              {voteCount}
            </UI.Text>
          </UI.CardBody>
        </UI.NewCard>
      </UI.Grid>
    </UI.Div>
  );
};
