import * as UI from '@haas/ui';
import { Briefcase, MessageCircle, User, Users } from 'react-feather';
import { slice } from 'lodash';
import React, { useMemo } from 'react';

import { useFormatter } from 'hooks/useFormatter';

import * as LS from './WorkspaceGrid.styles';
import { BarStat } from './BarStat';
import {
  HexagonDialogueNode,
  HexagonGroupNode,
  HexagonNodeType,
  HexagonQuestionNodeNode,
  HexagonState,
} from './WorkspaceGrid.types';
import { calcGroupTotal, orderNodesByScore, orderNodesByVoteCount } from './WorkspaceGrid.helpers';

interface WorkspaceGridPaneProps {
  currentState: HexagonState;
}

export const GroupPane = ({ currentState }: WorkspaceGridPaneProps) => {
  const currentNode = currentState.currentNode as HexagonGroupNode;

  const sortedGroups = useMemo(() => orderNodesByVoteCount(currentNode.subGroups), [currentNode]);
  const selectedGroups = useMemo(() => slice(sortedGroups, 0, 3), [sortedGroups]);
  const totalVotes = useMemo(() => calcGroupTotal(currentNode), [sortedGroups]);

  return (
    <LS.WorkspaceGridPaneContainer>
      <UI.Div bg="white" pb={4}>
        <UI.Flex>
          <UI.Div mr={2}>
            <UI.Icon color="gray.500">
              <Briefcase />
            </UI.Icon>
          </UI.Div>
          <UI.Grid gridGap={1} style={{ flex: '100%' }}>
            <UI.Div>
              <UI.H4>
                {currentNode.label}
              </UI.H4>

              <UI.Label bg="white" border="1px solid" borderColor="gray.300" mt={2}>
                Group
              </UI.Label>

              <UI.Div mt={2}>
                <UI.Flex>
                  <UI.Div>
                    <UI.Div>
                      <UI.Span fontWeight={600} fontSize="2rem" color="gray.800">
                        {totalVotes}
                      </UI.Span>
                    </UI.Div>
                    <UI.Div color="gray.600">
                      votes
                    </UI.Div>
                  </UI.Div>
                </UI.Flex>
              </UI.Div>

              <UI.Div mt={4}>
                <UI.Stack>
                  {selectedGroups.map((group, index) => (
                    <UI.Div key={index} width="100%">
                      {typeof group === 'object' && group.type === HexagonNodeType.Dialogue && (
                        <>
                          <UI.Span fontWeight={500} color="gray.600">
                            {group.label}
                          </UI.Span>
                          <BarStat
                            brand="green"
                            fraction={(group.dialogue.dialogueStatisticsSummary?.nrVotes ?? 0) / (totalVotes || 1)}
                          />
                        </>
                      )}
                    </UI.Div>
                  ))}
                </UI.Stack>
              </UI.Div>
            </UI.Div>
          </UI.Grid>
        </UI.Flex>

      </UI.Div>
    </LS.WorkspaceGridPaneContainer>
  );
};

export const DialoguePane = ({ currentState }: WorkspaceGridPaneProps) => {
  const currentNode = currentState.currentNode as HexagonDialogueNode;
  const { formatScore } = useFormatter();

  const sortedTopics = useMemo(() => orderNodesByScore(currentState.childNodes), [currentNode]);
  const selectedTopics = useMemo(() => slice(sortedTopics, 0, 3), [sortedTopics]);

  return (
    <LS.WorkspaceGridPaneContainer>
      <UI.Div bg="white" pb={4}>
        <UI.Flex>
          <UI.Div mr={2}>
            <UI.Icon color="gray.500">
              <Users />
            </UI.Icon>
          </UI.Div>
          <UI.Grid gridGap={1} width="100%">
            <UI.Div>
              <UI.H4>
                {currentNode.label}
              </UI.H4>

              <UI.Label bg="white" border="1px solid" borderColor="gray.300" mt={2}>
                Team
              </UI.Label>
            </UI.Div>

            <UI.Div>
              <UI.Flex justifyContent="space-between">
                <LS.WidgetCell brand="good">
                  <UI.Span>
                    {formatScore(currentNode.dialogue.dialogueStatisticsSummary?.impactScore || undefined)}
                  </UI.Span>
                  <UI.Span>
                    score
                  </UI.Span>
                </LS.WidgetCell>
              </UI.Flex>
            </UI.Div>

            <UI.Div mt={4}>
              <UI.Stack>
                {selectedTopics.map((group, index) => (
                  <UI.Div key={index} width="100%">
                    {typeof group === 'object' && group.type === HexagonNodeType.QuestionNode && (
                      <>
                        <UI.Span fontWeight={500} color="gray.600">
                          {group.topic}
                        </UI.Span>
                      </>
                    )}
                  </UI.Div>
                ))}
              </UI.Stack>
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
              className="active"
            >
              Metadata
            </UI.SwitchItem>

            <UI.SwitchItem>
              Actions
            </UI.SwitchItem>

            <UI.SwitchItem>
              Activity
            </UI.SwitchItem>
          </UI.Switch>
        </LS.SwitchWrapper>
      </UI.Div>
    </LS.WorkspaceGridPaneContainer>
  );
};

type GroupSwitchItem = 'metadata' | 'actions' | 'activity';

export const TopicPane = ({ currentState }: WorkspaceGridPaneProps) => {
  const currentNode = currentState.currentNode as HexagonQuestionNodeNode;
  const { formatScore } = useFormatter();

  return (
    <LS.WorkspaceGridPaneContainer>
      <UI.Div bg="white" pb={4}>
        <UI.Flex>
          <UI.Div mr={2}>
            <UI.Icon color="gray.500">
              <MessageCircle />
            </UI.Icon>
          </UI.Div>
          <UI.Grid gridGap={1} width="100%">
            <UI.Div>
              <UI.H4>
                {currentNode.topic}
              </UI.H4>

              <UI.Label bg="white" border="1px solid" borderColor="gray.300" mt={2}>
                Topic
              </UI.Label>
            </UI.Div>

            <UI.Div>
              <UI.Flex justifyContent="space-between">
                <LS.WidgetCell brand="good">
                  <UI.Span>
                    {formatScore(currentNode.score)}
                  </UI.Span>
                  <UI.Span>
                    score
                  </UI.Span>
                </LS.WidgetCell>

                <LS.WidgetCell brand="good">
                  <UI.Span>
                    Template
                  </UI.Span>
                  <UI.Span>
                    Topic
                  </UI.Span>
                </LS.WidgetCell>
              </UI.Flex>
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
              className="active"
            >
              Metadata
            </UI.SwitchItem>

            <UI.SwitchItem>
              Actions
            </UI.SwitchItem>

            <UI.SwitchItem>
              Activity
            </UI.SwitchItem>
          </UI.Switch>
        </LS.SwitchWrapper>
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
    case HexagonNodeType.QuestionNode: {
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
      return null;
    }
  }
};
