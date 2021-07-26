import { Dialogue, DialogueUpdateInput, QuestionNode, Edge, QuestionCondition, Subset, DialogueCreateArgs, Link, SliderNode, SliderNodeMarker, SliderNodeRange, FormNode, FormNodeField, DialogueInclude, VideoEmbeddedNode, Tag, FormNodeFieldType, LinkTypeEnum, NodeType, VideoEmbeddedNodeCreateWithoutQuestionNodeInput } from "@prisma/client";

export type CreateDialogueInput = {
  id?: string
  title: string
  slug: string
  description: string
  creationDate?: Date | string
  updatedAt?: Date | string | null
  publicTitle?: string | null
  isOnline?: boolean
  isWithoutGenData?: boolean
  endScreenText?: string | null
  wasGeneratedWithGenData?: boolean
  customerId: string
};

export interface CreateQuestionInput {
  id?: string,
  isRoot?: boolean,
  isLeaf?: boolean,
  title: string,
  type: NodeType,
  overrideLeafId?: string,
  dialogueId?: string,
  videoEmbeddedNode?: VideoEmbeddedNodeCreateWithoutQuestionNodeInput,
  options?: {
    publicValue?: string | null;
    value: string;
    position: number | null;
    overrideLeafId?: string;
  }[],
  links?: Array<{
    title: string | null;
    type: LinkTypeEnum;
    url: string;
    iconUrl: string | null;
    backgroundColor: string | null
  }>,
  form?: {
    helperText?: string;
    fields: Array<{
      label: string,
      type: FormNodeFieldType,
      isRequired: boolean,
      position: number,
    }>,
  },
  sliderNode?: {
    markers: Array<{
      label: string,
      subLabel: string,
      range: { start: number | null, end: number | null },
    }>
  }
}

export type CreateQuestionsInput = Array<CreateQuestionInput>;