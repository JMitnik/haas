import React, { useState } from 'react';

import { Div, Grid, H4, H5, Hr, Span } from '@haas/ui';
import {
  getDialogueSessionConnection_customer_dialogue_sessionConnection_sessions_nodeEntries as NodeEntry,
  getDialogueSessionConnection_customer_dialogue_sessionConnection_sessions as Session,
} from 'queries/__generated__/getDialogueSessionConnection';
import { QuestionNodeTypeEnum } from 'types/globalTypes';
import MultiChoiceNodeIcon from 'components/Icons/MultiChoiceNodeIcon';
import SliderNodeIcon from 'components/Icons/SliderNodeIcon';

import { InteractionDetailQuestionEntry } from '../InteractionOverviewStyles';
import { TableRowProps } from './TableRowTypes';

const InteractionTableValue = ({ entry }: { entry: NodeEntry }) => {
  console.log(entry);

  switch (entry.relatedNode?.type) {
    case QuestionNodeTypeEnum.SLIDER:
      return <Div>{entry.value?.sliderNodeEntry}</Div>;

    case QuestionNodeTypeEnum.CHOICE:
      return <Div>{entry.value?.choiceNodeEntry}</Div>;

    case QuestionNodeTypeEnum.REGISTRATION:
      return <Div>{entry.value?.registrationNodeEntry}</Div>;

    case QuestionNodeTypeEnum.TEXTBOX:
      return <Div>{entry.value?.textboxNodeEntry}</Div>;

    default:
      return (<Div>N/A available</Div>);
  }
};

const InteractionsTableRow = ({ headers, data, index }: TableRowProps<Session>) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const nrCells = headers.length;
  const templateColumns = '1fr '.repeat(nrCells);

  return (
    <Grid
      gridRowGap={0}
      gridColumnGap={5}
      gridTemplateColumns={templateColumns}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {headers && headers.map(({ accessor, Cell }) => {
        const result = Object.entries(data).find((property) => property[0] === accessor);

        if (result) return <Cell value={result[1]} key={`${index}-${result[0]}`} />;
        return null;
      })}

      {isExpanded && (
        <Div useFlex flexDirection="column" backgroundColor="#f0f0f0" gridColumn="1 / -1">
          <Div padding={25}>
            <Div marginBottom={10} useFlex flexDirection="column">
              <Div useFlex flexDirection="row">
                <Div width="51%">
                  <H4 color="#999999">USER DATA</H4>
                  <H5 color="#c0bcbb">User information</H5>
                </Div>
                <Div width="49%" useFlex>
                  <Div useFlex flexDirection="column" width="25%">
                    <Span fontWeight="bold" color="#999999">OS</Span>
                    <Span color="#c0bcbb">Android</Span>
                  </Div>
                  <Div useFlex flexDirection="column">
                    <Span fontWeight="bold" color="#999999">Location</Span>
                    <Span color="#c0bcbb">Noord Holland</Span>
                  </Div>
                </Div>
              </Div>
              <Div />
            </Div>
            <Hr style={{ marginBottom: '15px' }} color="#999999" />
            <Div position="relative" useFlex flexDirection="row">
              <Div width="50%">
                <H4 color="#999999">DIALOGUE PATH</H4>
                <H5 color="#c0bcbb">Follow the path they followed in their journey</H5>
              </Div>
              <InteractionDetailQuestionEntry useFlex flexDirection="column" width="50%">
                {/* TODO: Make each mapped entry an individual component */}
                {data.nodeEntries.map((nodeEntry, index) => {
                  const { id, relatedNode } = nodeEntry;

                  return (
                    <Div marginBottom={20} useFlex flexDirection="column" key={`${id}-${index}`}>
                      <Div useFlex flexDirection="row">
                        <Div
                          zIndex={1}
                          alignSelf="center"
                          padding={8}
                          marginRight="10%"
                          backgroundColor="#f0f0f0"
                          borderRadius="90px"
                          border="1px solid #c0bcbb"
                        >
                          {relatedNode?.type === 'SLIDER' ? <SliderNodeIcon /> : <MultiChoiceNodeIcon /> }
                        </Div>
                        <Div useFlex flexDirection="column">
                          <Span color="#c0bcbb" fontSize="0.8rem" fontWeight="normal" fontStyle="normal">U ASKED</Span>
                          <Span fontSize="0.8rem" fontWeight={300}>{relatedNode?.title || 'N/A'}</Span>
                          <Span
                            color="#c0bcbb"
                            fontSize="0.8rem"
                            fontWeight={300}
                            fontStyle="normal"
                            mt="4%"
                          >
                            THEY ANSWERED
                          </Span>
                          <Span
                            fontWeight={300}
                            fontStyle="italic"
                            fontSize="0.8rem"
                          >
                            <InteractionTableValue entry={nodeEntry} />
                          </Span>
                        </Div>
                      </Div>
                    </Div>
                  );
                })}
              </InteractionDetailQuestionEntry>
            </Div>
          </Div>
        </Div>
      )}
    </Grid>
  );
};

export default InteractionsTableRow;
