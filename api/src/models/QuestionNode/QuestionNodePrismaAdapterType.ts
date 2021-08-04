import { FormNodeFieldUpsertArgs, FormNodeCreateInput, LinkTypeEnum } from "@prisma/client"

import { NexusGenInputs } from "../../generated/nexus"
import { CreateQuestionInput } from "../questionnaire/DialoguePrismaAdapterType"

export type CreateCTAInput = {
  title: string,
  type?: "GENERIC" | "SLIDER" | "FORM" | "CHOICE" | "REGISTRATION" | "TEXTBOX" | "LINK" | "SHARE" | "VIDEO_EMBEDDED" | undefined,
  form?: NexusGenInputs['FormNodeInputType'] | null, // FormNodeInputType
  links: {
    id: string | undefined;
    backgroundColor: string | undefined;
    iconUrl: string | undefined;
    title: string | undefined;
    type: "API" | "FACEBOOK" | "INSTAGRAM" | "LINKEDIN" | "SOCIAL" | "TWITTER" | "WHATSAPP";
    url: string;
  }[],
  share: {
    id: string | undefined;
    title: string;
    tooltip: string | undefined;
    url: string;
  } | undefined,
  dialogueId: string,
}

export type UpdateFormFieldsInput = {
  questionId: string;
  fields: FormNodeFieldUpsertArgs[];
}

export type CreateFormFieldsInput = {
  questionId: string;
  fields: FormNodeCreateInput;
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
}

export interface CreateLinkInput extends UpdateLinkInput {
  questionId: string;
}

export type UpdateShareInput = {
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