import { Trigger, User, TriggerCondition, QuestionNode, TriggerUpdateInput, TriggerCreateInput } from "@prisma/client";

export interface TriggerPrismaAdapterType {
  getById(triggerId: string): Promise<(Trigger & {
    recipients: User[];
    conditions: TriggerCondition[];
    relatedNode: QuestionNode | null;
  }) | null>;
  delete(triggerId: string): Promise<Trigger | null>;
  update(triggerId: string, data: TriggerUpdateInput): Promise<Trigger | null>;
  create(data: TriggerCreateInput): Promise<Trigger>;
}