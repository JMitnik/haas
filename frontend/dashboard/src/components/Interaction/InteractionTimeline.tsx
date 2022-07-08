import * as UI from '@haas/ui';
import React from 'react';
import styled from 'styled-components';

import { Circle } from 'components/Common/Circle';
import { NodeEntryFragmentFragment, QuestionNodeTypeEnum, SessionFragmentFragment } from 'types/generated-types';
import { QuestionNodeIcon } from 'components/Dialogue/QuestionNodeIcon';
import { Timeline, TimelineItem } from 'components/Common/Timeline';
import { formatSliderValue } from 'components/Dialogue/utils/formatSliderValue';
import FormNodeEntry from 'views/InteractionsOverview/FormNodeEntry';

interface Interaction extends SessionFragmentFragment { }

interface InteractionTimelineProps {
  interaction: Interaction;
}

interface InteractionNodeEntryDescriptionProps {
  nodeEntry: NodeEntryFragmentFragment;
}

const FormNodeDescription = ({ nodeEntry }: InteractionNodeEntryDescriptionProps) => (
  <>
    {nodeEntry.value?.formNodeEntry ? (
      <>
        <UI.SectionHeader>
          User provided these values:
        </UI.SectionHeader>
        {/* @ts-ignore */}
        <FormNodeEntry nodeEntry={nodeEntry.value.formNodeEntry} />
      </>
    ) : (
      <>
        User left it empty
      </>
    )}
  </>
);

const TextboxNodeDescription = ({ nodeEntry }: InteractionNodeEntryDescriptionProps) => (
  <>
    {nodeEntry.value?.textboxNodeEntry ? (
      <>
        <UI.SectionHeader>
          When asked
          &quot;
          {nodeEntry.relatedNode?.title}
          &quot;
        </UI.SectionHeader>
        <UI.Span>
          User wrote the following down:
        </UI.Span>
        <UI.Div
          bg="white"
          borderRadius="10px"
          padding={2}
        >
          {nodeEntry.value?.textboxNodeEntry}
        </UI.Div>

      </>
    ) : (
      <>
        User left it empty
      </>
    )}
  </>
);

const MultiChoiceEntryDescription = ({ nodeEntry }: InteractionNodeEntryDescriptionProps) => (
  <>
    {nodeEntry.value?.choiceNodeEntry && (
      <>
        <UI.SectionHeader>
          When asked
          &quot;
          {nodeEntry.relatedNode?.title}
          &quot;
        </UI.SectionHeader>
        <UI.Span>
          User selected:
          &quot;
          {nodeEntry.value?.choiceNodeEntry}
          &quot;
        </UI.Span>
      </>
    )}
  </>
);

const VideoEmbedEntryDescription = ({ nodeEntry }: InteractionNodeEntryDescriptionProps) => (
  <>
    {nodeEntry.value?.videoNodeEntry && (
      <>
        <UI.SectionHeader>
          When asked
          &quot;
          {nodeEntry.relatedNode?.title}
          &quot;
        </UI.SectionHeader>
        <UI.Span>
          User made choice:
          {' '}
          {nodeEntry.value?.videoNodeEntry}
        </UI.Span>
      </>
    )}
  </>
);

const SliderEntryDescription = ({ nodeEntry }: InteractionNodeEntryDescriptionProps) => (
  <>
    {nodeEntry.value?.sliderNodeEntry && (
      <>
        <UI.SectionHeader>
          When asked
          &quot;
          {nodeEntry.relatedNode?.title}
          &quot;
        </UI.SectionHeader>
        <UI.Span>
          User slid the bunny to value:
          {' '}
          {formatSliderValue(nodeEntry.value?.sliderNodeEntry)}
        </UI.Span>
      </>
    )}
  </>
);

const MapCampaignDescription: { [key in QuestionNodeTypeEnum]?: React.FC<InteractionNodeEntryDescriptionProps> } = {
  [QuestionNodeTypeEnum.Slider]: SliderEntryDescription,
  [QuestionNodeTypeEnum.Choice]: MultiChoiceEntryDescription,
  [QuestionNodeTypeEnum.Textbox]: TextboxNodeDescription,
  [QuestionNodeTypeEnum.VideoEmbedded]: VideoEmbedEntryDescription,
  [QuestionNodeTypeEnum.Form]: FormNodeDescription,
};

const StatusDescription = ({ nodeEntry }: InteractionNodeEntryDescriptionProps) => {
  if (!nodeEntry.relatedNode?.type) return <></>;

  const MappedStatusDescription = MapCampaignDescription[nodeEntry.relatedNode?.type];

  if (!MappedStatusDescription) {
    return <></>;
  }

  return <MappedStatusDescription nodeEntry={nodeEntry} />;
};

const InteractionTimelineContainer = styled.div`
  ${Circle} ${UI.Icon} svg {
    fill: currentColor;
  }
`;

export const InteractionTimeline = ({ interaction }: InteractionTimelineProps) => (
  <InteractionTimelineContainer>
    <Timeline enableFold isBlock nrItems={interaction.nodeEntries?.length} brand="blue">
      {interaction.nodeEntries.map((nodeEntry) => (
        <TimelineItem gridTemplateColumns="40px 1fr" key={nodeEntry.id}>
          <Circle brand="blue">
            {nodeEntry.relatedNode?.type && (
              <UI.Icon color="blue.50">
                <QuestionNodeIcon nodeType={nodeEntry.relatedNode.type} />
              </UI.Icon>
            )}
          </Circle>
          <UI.Div>
            {nodeEntry.relatedNode?.type === QuestionNodeTypeEnum.Form ? (
              <UI.Flex justifyContent="space-between">
                <UI.Helper color="blue.400">{nodeEntry.relatedNode?.type}</UI.Helper>

                <UI.Helper color="red.500">Requires action</UI.Helper>
              </UI.Flex>
            ) : (
              <UI.Helper color="blue.400">{nodeEntry.relatedNode?.type}</UI.Helper>
            )}

            <StatusDescription nodeEntry={nodeEntry} />
          </UI.Div>
        </TimelineItem>
      ))}
    </Timeline>
  </InteractionTimelineContainer>
);
