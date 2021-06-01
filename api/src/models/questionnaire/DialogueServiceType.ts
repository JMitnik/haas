import { Dialogue } from "@prisma/client";

export interface DialogueServiceType {
  findDialogueIdsByCustomerId(customerId: string): Promise<Array<string>>;
  delete(dialogueId: string): Promise<Dialogue>;
  deleteDialogue(dialogueId: string): Promise<Dialogue>
  editDialogue({
    customerSlug,
    dialogueSlug,
    title,
    description,
    publicTitle,
    isWithoutGenData,
    tags,
  }: {
    customerSlug?: string | null | undefined,
    dialogueSlug?: string | null | undefined,
    title?: string | null | undefined,
    description?: string | null | undefined,
    publicTitle?: string | null | undefined,
    isWithoutGenData?: boolean | null | undefined,
    tags?: any,
  }): Promise<Dialogue>;
}