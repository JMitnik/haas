import { Dialogue } from "@prisma/client";

export interface DialoguePrismaAdapterType {
  findDialogueIdsOfCustomer(customerId: string): Promise<Array<{id: string}>>
}