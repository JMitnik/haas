import { NodeEntry, QuestionNodeTypeEnum } from 'types/generated-types';

import { TFunction } from 'i18next';

const parseNodeEntryValue = (nodeEntry: NodeEntry, t: TFunction) => {
  switch (nodeEntry.relatedNode?.type) {
    case QuestionNodeTypeEnum.Slider:
      return nodeEntry.value?.sliderNodeEntry;
    case QuestionNodeTypeEnum.Choice:
      return nodeEntry.value?.choiceNodeEntry;
    case QuestionNodeTypeEnum.VideoEmbedded:
      return nodeEntry.value?.videoNodeEntry;
    case QuestionNodeTypeEnum.Registration:
      return nodeEntry.value?.registrationNodeEntry;
    case QuestionNodeTypeEnum.Textbox:
      return nodeEntry.value?.textboxNodeEntry;
    case QuestionNodeTypeEnum.Form:
      return t('see_interactions');
    default:
      return '';
  }
};

export default parseNodeEntryValue;
