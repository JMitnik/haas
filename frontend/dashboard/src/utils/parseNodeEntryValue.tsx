import {
  dialogueStatistics_customer_dialogue_sessions_nodeEntries as NodeEntry,
} from '../views/DialogueView/__generated__/dialogueStatistics';

const parseNodeEntryValue = (nodeEntry: NodeEntry) => {
  switch (nodeEntry.relatedNode?.type) {
    case 'SLIDER':
      return nodeEntry.value?.sliderNodeEntry;
    case 'CHOICE':
      return nodeEntry.value?.choiceNodeEntry;
    case 'REGISTRATION':
      return nodeEntry.value?.registrationNodeEntry;
    case 'TEXTBOX':
      return nodeEntry.value?.textboxNodeEntry;
    default:
      return '';
  }
};

export default parseNodeEntryValue;
