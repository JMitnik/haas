import { TriggerMedium, TriggerEnum, Trigger, User, TriggerCondition, TriggerConditionEnum } from "@prisma/client";

import { CustomerWithCustomerSettings } from "../customer/Customer";

export interface CreateTriggerInput {
  name: string;
  medium: TriggerMedium;
  type: TriggerEnum;
  customerSlug: string;
  recipients: { id: string }[];
}

export interface TriggerWithSendData extends Trigger {
  recipients: User[];
  conditions: TriggerCondition[];
  customer: CustomerWithCustomerSettings | null;
  relatedNode: {
    questionDialogue: {
      title: string;
    } | null;
  } | null;
}

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