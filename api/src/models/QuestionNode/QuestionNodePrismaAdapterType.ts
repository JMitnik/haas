import { Prisma, LinkTypeEnum } from '@prisma/client'

import { CreateQuestionInput } from '../questionnaire/DialoguePrismaAdapterType'
import { FormNodeInput } from './NodeServiceType';

export interface CreateCTAInput {
  title: string;
  type?: 'GENERIC' | 'SLIDER' | 'FORM' | 'CHOICE' | 'REGISTRATION' | 'TEXTBOX' | 'LINK' | 'SHARE' | 'VIDEO_EMBEDDED' | undefined;
  form?: FormNodeInput | null; // FormNodeInputType
  links: {
    id: string | undefined;
    backgroundColor: string | undefined;
    iconUrl: string | undefined;
    title: string | undefined;
    type: 'API' | 'FACEBOOK' | 'INSTAGRAM' | 'LINKEDIN' | 'SOCIAL' | 'TWITTER' | 'WHATSAPP' | 'SINGLE';
    url: string;
  }[];
  share: {
    id: string | undefined;
    title: string;
    tooltip: string | undefined;
    url: string;
  } | undefined;
  dialogueId: string;
}

export interface UpdateFormFieldsInput {
  questionId: string;
  fields: Prisma.FormNodeFieldUpsertArgs[];
  helperText?: string;
}

export interface CreateFormFieldsInput {
  questionId: string;
  fields: Prisma.FormNodeCreateInput;
  helperText?: string;
}

export interface UpdateQuestionInput extends CreateQuestionInput {
  currentOverrideLeafId?: string | null;
}

export interface UpdateLinkInput {
  id?: string;
  title: string;
  url: string;
  type: LinkTypeEnum;
  backgroundColor: string;
  iconUrl: string;
  buttonText: string;
  header: string;
  subHeader: string;
  imageUrl: string;
}

export interface CreateLinkInput extends UpdateLinkInput {
  questionId: string;
}

export interface UpdateShareInput {
  title: string;
  url: string;
  tooltip: string;
}

export interface CreateShareInput extends UpdateShareInput {
  questionId: string;
};

export interface UpdateSliderNodeInput {
  happyText: string | null;
  unhappyText: string | null;
  markers?: {
    id?: string | null | undefined;
    label: string;
    range?: {
      end?: number | null | undefined;
      start?: number | null | undefined;
    } | null | undefined;
    subLabel: string;
  }[] | null | undefined;
}

export interface CreateSliderNodeInput extends UpdateSliderNodeInput {
  parentNodeId: string;
}

export interface CreateVideoEmbeddedNodeInput {
  parentNodeId: string;
  videoUrl?: string | null;
}
