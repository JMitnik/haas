import { NodeEntry, QuestionNode, SliderNodeEntry, ChoiceNodeEntry, FormNodeEntryGetPayload, RegistrationNodeEntry, TextboxNodeEntry, LinkNodeEntry } from "@prisma/client";

export interface NodeEntryWithTypes extends NodeEntry {
  session?: {
      id: String;
      createdAt: Date;
  } | null;
  relatedNode?: QuestionNode | null;
  sliderNodeEntry: SliderNodeEntry | null;
  choiceNodeEntry: ChoiceNodeEntry | null;
  formNodeEntry: FormNodeEntryGetPayload<{ include: { values: true } }> | null;
  registrationNodeEntry: RegistrationNodeEntry | null;
  textboxNodeEntry: TextboxNodeEntry | null;
  linkNodeEntry: LinkNodeEntry | null;
}
