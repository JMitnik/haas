import { LinkTypeEnum } from "@prisma/client";

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