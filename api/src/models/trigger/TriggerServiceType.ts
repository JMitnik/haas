import { TriggerMedium, TriggerEnum, Trigger, User, TriggerCondition } from "@prisma/client";

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