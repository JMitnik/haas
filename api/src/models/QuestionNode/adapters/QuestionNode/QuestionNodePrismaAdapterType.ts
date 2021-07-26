import { FormNodeFieldUpsertArgs, FormNodeCreateInput } from "@prisma/client"

import { NexusGenInputs } from "../../../../generated/nexus"
import { CreateQuestionInput } from "../../../questionnaire/DialoguePrismaAdapterType"

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
