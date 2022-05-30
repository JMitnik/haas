import { NodeEntry, QuestionNode, SliderNodeEntry, ChoiceNodeEntry, RegistrationNodeEntry, TextboxNodeEntry, LinkNodeEntry } from '@prisma/client';

export interface NodeEntryWithTypes extends NodeEntry {
  session?: {
    id: String;
    createdAt: Date;
  } | null;
  relatedNode?: QuestionNode | null;
  sliderNodeEntry: SliderNodeEntry | null;
  choiceNodeEntry: ChoiceNodeEntry | null;
}
