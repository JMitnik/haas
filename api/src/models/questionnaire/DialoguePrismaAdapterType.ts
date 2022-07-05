import { DialogueImpactScore, FormNodeFieldType, LanguageEnum, LinkTypeEnum, NodeType, Prisma } from '@prisma/client';

export interface UpsertDialogueTopicCacheInput {
  id?: string;
  dialogueId?: string | null;
  impactScore: any;
  name: string;
  nrVotes: number;
  impactScoreType?: DialogueImpactScore;
  startDateTime?: Date | null;
  endDateTime?: Date | null;
  subTopics?: UpsertDialogueTopicCacheInput[];
};

export interface UpsertDialogueStatisticsInput {
  dialogueId: string;
  impactScore: any;
  nrVotes: number;
  impactScoreType: DialogueImpactScore;
  startDateTime: Date;
  endDateTime: Date;
}

export interface CreateDialogueInput {
  id?: string;
  title: string;
  slug: string;
  description: string;
  creationDate?: Date | string;
  updatedAt?: Date | string | null;
  publicTitle?: string | null;
  isPrivate?: boolean;
  isOnline?: boolean;
  isWithoutGenData?: boolean;
  endScreenText?: string | null;
  wasGeneratedWithGenData?: boolean;
  language?: LanguageEnum;
  postLeafText?: {
    header?: string;
    subHeader?: string;
  };
  customer?: { id?: string; name?: string; slug?: string; create: boolean };
}

export interface CreateQuestionInput {
  id?: string;
  isRoot?: boolean;
  isLeaf?: boolean;
  title: string;
  type: NodeType;
  overrideLeafId?: string;
  dialogueId?: string;
  videoEmbeddedNode?: Prisma.VideoEmbeddedNodeCreateWithoutQuestionNodeInput;
  options?: {
    publicValue?: string | null;
    value: string;
    position: number | null;
    overrideLeafId?: string;
    isTopic?: boolean;
  }[];
  links?: Array<{
    title: string | null;
    type: LinkTypeEnum;
    url: string;
    iconUrl: string | null;
    backgroundColor: string | null;
  }>;
  form?: {
    helperText?: string;
    fields: Array<{
      label: string;
      type: FormNodeFieldType;
      isRequired: boolean;
      position: number;
    }>;
  };
  share?: {
    url: string;
    tooltip: string;
    title: string;
  };
  sliderNode?: {
    markers: Array<{
      label: string;
      subLabel: string;
      range: { start: number | null; end: number | null };
    }>;
  };
}

export type CreateQuestionsInput = Array<CreateQuestionInput>;
