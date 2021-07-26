import { TriggerConditionEnum } from "@prisma/client";

export interface CreateQuestionOfTriggerInput {
  triggerId: string;
  condition: {
    id?: number | null | undefined;
    maxValue?: number | null | undefined;
    minValue?: number | null | undefined;
    questionId?: string | null | undefined;
    textValue?: string | null | undefined;
    type?: TriggerConditionEnum | null;
  }
}