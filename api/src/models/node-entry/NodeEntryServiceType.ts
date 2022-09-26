import {
  NodeEntry,
  SliderNodeEntry,
  ChoiceNodeEntry,
  Prisma,
  FormNodeEntry,
  FormNodeFieldEntryData,
} from 'prisma/prisma-client';

const question = Prisma.validator<Prisma.QuestionNodeArgs>()({
  include: {
    options: true,
  },
});

export type NodeWithOptions = Prisma.QuestionNodeGetPayload<typeof question>;
export interface NodeEntryWithTypes extends NodeEntry {
  session?: {
    id: String;
    createdAt: Date;
  } | null;
  relatedNode?: NodeWithOptions | null;
  sliderNodeEntry: SliderNodeEntry | null;
  choiceNodeEntry: ChoiceNodeEntry | null;
  formNodeEntry: FormNodeEntry & {
    values: FormNodeFieldEntryData[];
  } | null;
}
