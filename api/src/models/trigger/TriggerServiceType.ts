import { TriggerMedium, TriggerEnum, Trigger, User, TriggerCondition as PrismaTriggerCondition, TriggerConditionEnum } from "@prisma/client";

import { CustomerWithCustomerSettings } from "../customer/graphql/Customer";

export interface CreateTriggerInput {
  name: string;
  medium: TriggerMedium;
  type: TriggerEnum;
  customerSlug: string;
  recipients: { id: string }[];
}

export interface TriggerWithSendData extends Trigger {
  recipients: User[];
  conditions: PrismaTriggerCondition[];
  customer: CustomerWithCustomerSettings | null;
  relatedNode: {
    questionDialogue: {
      title: string;
    } | null;
  } | null;
}

export interface TriggerCondition {
  id?: number | null;
  maxValue?: number | null;
  minValue?: number | null;
  questionId?: string | null;
  textValue?: string | null;
  type?: TriggerConditionEnum | null
}

export interface CreateQuestionOfTriggerInput {
  triggerId: string;
  condition: TriggerCondition;
}
