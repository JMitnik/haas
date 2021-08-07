import { Prisma, NodeEntry, QuestionNode, SliderNodeEntry, ChoiceNodeEntry, RegistrationNodeEntry, TextboxNodeEntry, LinkNodeEntry } from "@prisma/client";

export interface NodeEntryWithTypes extends NodeEntry {
  session?: {
    id: String;
    createdAt: Date;
  } | null;
  relatedNode?: QuestionNode | null;
  sliderNodeEntry: SliderNodeEntry | null;
  choiceNodeEntry: ChoiceNodeEntry | null;
  formNodeEntry: Prisma.FormNodeEntryGetPayload<{ include: { values: true } }> | null;
  registrationNodeEntry: RegistrationNodeEntry | null;
  textboxNodeEntry: TextboxNodeEntry | null;
  linkNodeEntry: LinkNodeEntry | null;
}
