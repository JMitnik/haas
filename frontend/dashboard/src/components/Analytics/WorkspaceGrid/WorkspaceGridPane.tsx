import * as UI from '@haas/ui';
import { Cell, Pie, PieChart } from 'recharts';
import { User } from 'react-feather';
import { slice } from 'lodash';
import { useTranslation } from 'react-i18next';
import React, { useMemo } from 'react';

import { useFormatter } from 'hooks/useFormatter';

import * as LS from './WorkspaceGrid.styles';
import {
  HexagonDialogueNode,
  HexagonGroupNode,
  HexagonNodeType,
  HexagonState,
  HexagonTopicNode,
} from './WorkspaceGrid.types';
import { WorkspaceSummaryPane } from './SummaryPane/WorkspaceSummaryPane';
import { getHexagonSVGFill, orderNodesByScore, orderNodesByVoteCount } from './WorkspaceGrid.helpers';

interface WorkspaceGridPaneProps {
  currentState: HexagonState;
}

export const GroupPane = ({ currentState }: WorkspaceGridPaneProps) => {
  const { t } = useTranslation();
  const { formatScore } = useFormatter();
  const currentNode = currentState.currentNode as HexagonGroupNode;

  const sortedGroups = useMemo(() => orderNodesByVoteCount(currentNode.subGroups), [currentNode]);
  const selectedGroups = useMemo(() => slice(sortedGroups, 0, 3), [sortedGroups]);

  return (
    <LS.WorkspaceGridPaneContainer>
      <LS.PaneHeader>
        <UI.Helper>
          {t('group')}
        </UI.Helper>
        <UI.H4 mt={1}>
          {currentNode.label}
        </UI.H4>
      </LS.PaneHeader>
      <UI.Div bg="white" pb={4}>
        <UI.Flex>
          <UI.Grid gridGap={1} width="100%">
            <UI.Div>
              <UI.Grid gridTemplateColumns={['1fr', '1fr 1fr']}>
                <LS.WidgetCell>
                  <UI.Span>
                    Average rating
                  </UI.Span>
                  <UI.Span>
                    {formatScore(currentNode.score)}
                  </UI.Span>
                  <UI.Span>
                    score
                  </UI.Span>
                </LS.WidgetCell>
              </UI.Grid>
            </UI.Div>

            <UI.Div mt={4} width="100%">
              <UI.Flex alignItems="center" justifyContent="space-between">
                <LS.WidgetCell>
                  <UI.Span>
                    Response count
                  </UI.Span>
                  <UI.Span>
                    {currentNode.nrVotes}
                  </UI.Span>
                  <UI.Span>
                    responses
                  </UI.Span>
                </LS.WidgetCell>

                <UI.Div>
                  <PieChart width={200} height={150}>
                    <Pie
                      data={selectedGroups.map((group) => ({ name: 'asdas', value: group.score }))}
                      cx={100}
                      cy={100}
                      startAngle={180}
                      endAngle={0}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={10}
                      dataKey="value"
                      isAnimationActive
                    >
                      {selectedGroups.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getHexagonSVGFill(entry.score)} />
                      ))}
                    </Pie>
                  </PieChart>
                </UI.Div>
              </UI.Flex>
            </UI.Div>
          </UI.Grid>
        </UI.Flex>
      </UI.Div>
    </LS.WorkspaceGridPaneContainer>
  );
};

export const DialoguePane = ({ currentState }: WorkspaceGridPaneProps) => {
  const { t } = useTranslation();
  const currentNode = currentState.currentNode as HexagonDialogueNode;
  const { formatScore } = useFormatter();

  const sortedTopics = useMemo(() => orderNodesByScore(currentState.childNodes), [currentNode]);
  const selectedTopics = useMemo(() => slice(sortedTopics, 0, 3), [sortedTopics]);

  return (
    <LS.WorkspaceGridPaneContainer>
      <LS.PaneHeader>
        <UI.Helper>
          {t('team')}
        </UI.Helper>
        <UI.H4 mt={1}>
          {currentNode.label}
        </UI.H4>
      </LS.PaneHeader>
      <UI.Div bg="white" pb={4}>
        <UI.Flex>
          <UI.Grid gridGap={1} width="100%">
            <UI.Div>
              <UI.Grid gridTemplateColumns={['1fr', '1fr 1fr']}>
                <LS.WidgetCell>
                  <UI.Span>
                    Average rating
                  </UI.Span>
                  <UI.Span>
                    {formatScore(currentNode.dialogue.dialogueStatisticsSummary?.impactScore || undefined)}
                  </UI.Span>
                  <UI.Span>
                    score
                  </UI.Span>
                </LS.WidgetCell>
              </UI.Grid>
            </UI.Div>

            <UI.Div mt={4} width="100%">
              <UI.Flex alignItems="center" justifyContent="space-between">
                <LS.WidgetCell>
                  <UI.Span>
                    Response count
                  </UI.Span>
                  <UI.Span>
                    {currentNode.dialogue.dialogueStatisticsSummary?.nrVotes}
                  </UI.Span>
                  <UI.Span>
                    responses
                  </UI.Span>
                </LS.WidgetCell>

                <UI.Div>
                  <PieChart width={200} height={150}>
                    <Pie
                      data={selectedTopics.map((topic) => ({ name: 'asdas', value: topic.score }))}
                      cx={100}
                      cy={100}
                      startAngle={180}
                      endAngle={0}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={10}
                      dataKey="value"
                    >
                      {selectedTopics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getHexagonSVGFill(entry.score)} />
                      ))}
                    </Pie>
                  </PieChart>
                </UI.Div>
              </UI.Flex>
            </UI.Div>
          </UI.Grid>
        </UI.Flex>
      </UI.Div>
    </LS.WorkspaceGridPaneContainer>
  );
};

type GroupSwitchItem = 'metadata' | 'actions' | 'activity';

export const TopicPane = ({ currentState }: WorkspaceGridPaneProps) => {
  const currentNode = currentState.currentNode as HexagonTopicNode;
  const { formatScore } = useFormatter();
  const { t } = useTranslation();

  const sortedTopics = useMemo(() => orderNodesByScore(currentState.childNodes), [currentNode]);
  const selectedTopics = useMemo(() => slice(sortedTopics, 0, 3), [sortedTopics]);

  return (
    <LS.WorkspaceGridPaneContainer>
      <LS.PaneHeader>
        <UI.Helper>
          {t('topic')}
        </UI.Helper>
        <UI.H4 mt={1}>
          {currentNode.topic.name}
        </UI.H4>
      </LS.PaneHeader>
      <UI.Div bg="white" pb={4}>
        <UI.Flex>
          <UI.Grid gridGap={1} width="100%">
            <UI.Div>
              <UI.Grid gridTemplateColumns={['1fr', '1fr 1fr']}>
                <LS.WidgetCell>
                  <UI.Span>
                    Average rating
                  </UI.Span>
                  <UI.Span>
                    {formatScore(currentNode.score)}
                  </UI.Span>
                  <UI.Span>
                    score
                  </UI.Span>
                </LS.WidgetCell>
              </UI.Grid>
            </UI.Div>

            <UI.Div mt={4} width="100%">
              <UI.Flex alignItems="center" justifyContent="space-between">
                <LS.WidgetCell>
                  <UI.Span>
                    Response count
                  </UI.Span>
                  <UI.Span>
                    {currentNode.topic.nrVotes}
                  </UI.Span>
                  <UI.Span>
                    responses
                  </UI.Span>
                </LS.WidgetCell>

                <UI.Div>
                  <PieChart width={200} height={150}>
                    <Pie
                      data={selectedTopics.map((topic) => ({ name: 'asdas', value: topic.score }))}
                      cx={100}
                      cy={100}
                      startAngle={180}
                      endAngle={0}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={10}
                      dataKey="value"
                    >
                      {selectedTopics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getHexagonSVGFill(entry.score)} />
                      ))}
                    </Pie>
                  </PieChart>
                </UI.Div>
              </UI.Flex>
            </UI.Div>
          </UI.Grid>
        </UI.Flex>
      </UI.Div>
    </LS.WorkspaceGridPaneContainer>
  );
};

export const SessionPane = ({ currentState }: WorkspaceGridPaneProps) => {
  const [activeTab, setActiveTab] = React.useState<GroupSwitchItem>('metadata');
  const currentNode = currentState.currentNode as HexagonGroupNode;

  return (
    <LS.WorkspaceGridPaneContainer>
      <UI.Div bg="white" pb={4}>
        <UI.Flex>
          <UI.Div mr={2}>
            <UI.Icon color="gray.500">
              <User />
            </UI.Icon>
          </UI.Div>
          <UI.Grid gridGap={1}>
            <UI.Div>
              <UI.H4>
                {currentNode.label}
              </UI.H4>

              <UI.Label bg="white" border="1px solid" borderColor="gray.300" mt={2}>
                Session
              </UI.Label>
            </UI.Div>
          </UI.Grid>
        </UI.Flex>
      </UI.Div>
      <UI.Div
        style={{ backgroundColor: '#f7f9fb' }}
        borderTop="1px solid"
        borderColor="gray.100"
      >
        <LS.SwitchWrapper>
          <UI.Switch>
            <UI.SwitchItem
              className={activeTab === 'metadata' ? 'active' : ''}
              onClick={() => setActiveTab('metadata')}
            >
              Metadata
            </UI.SwitchItem>

            <UI.SwitchItem
              className={activeTab === 'actions' ? 'active' : ''}
              onClick={() => setActiveTab('actions')}
            >
              Actions
            </UI.SwitchItem>

            <UI.SwitchItem
              className={activeTab === 'activity' ? 'active' : ''}
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </UI.SwitchItem>
          </UI.Switch>
        </LS.SwitchWrapper>

        <UI.Div ml={38}>
          {activeTab === 'metadata' && (
            <UI.Grid gridTemplateColumns="1fr 3fr" gridGap={1}>
              <UI.Stack>
                <UI.Span>
                  <LS.MetadataLabel>Assignee</LS.MetadataLabel>
                </UI.Span>
                <UI.Span>
                  <LS.MetadataLabel>Count</LS.MetadataLabel>
                </UI.Span>
                <UI.Span>
                  <LS.MetadataLabel>Score</LS.MetadataLabel>
                </UI.Span>
              </UI.Stack>

              <UI.Stack>
                <UI.Span>
                  John
                </UI.Span>
                <UI.Span>
                  42
                </UI.Span>
                <UI.Span>
                  6.7
                </UI.Span>
              </UI.Stack>
            </UI.Grid>
          )}
        </UI.Div>
      </UI.Div>
    </LS.WorkspaceGridPaneContainer>
  );
};

export const WorkspaceGridPane = ({ currentState }: WorkspaceGridPaneProps) => {
  const currentStateType = currentState?.currentNode?.type || undefined;

  switch (currentStateType) {
    case HexagonNodeType.Dialogue: {
      return (
        <DialoguePane
          currentState={currentState}
        />
      );
    }
    case HexagonNodeType.Group: {
      return (
        <GroupPane
          currentState={currentState}
        />
      );
    }
    case HexagonNodeType.Topic: {
      return (
        <TopicPane
          currentState={currentState}
        />
      );
    }
    case HexagonNodeType.Session: {
      return (
        <SessionPane
          currentState={currentState}
        />
      );
    }
    default: {
      return (
        <WorkspaceSummaryPane currentState={currentState} />
      );
    }
  }
};
