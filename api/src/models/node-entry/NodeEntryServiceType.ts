import { NodeEntry, QuestionNode, SliderNodeEntry, ChoiceNodeEntry, FormNodeEntry, FormNodeFieldEntryData } from '@prisma/client';

export interface NodeEntryWithTypes extends NodeEntry {
  session?: {
    id: String;
    createdAt: Date;
  } | null;
  relatedNode?: QuestionNode | null;
  sliderNodeEntry: SliderNodeEntry | null;
  choiceNodeEntry: ChoiceNodeEntry | null;
  formNodeEntry: FormNodeEntry & {
    values: FormNodeFieldEntryData[];
  } | null;
}
