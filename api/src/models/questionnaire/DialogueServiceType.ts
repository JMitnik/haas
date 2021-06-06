import { Dialogue, Tag } from "@prisma/client";
import { WorkspaceTemplate } from "../templates/defaultWorkspaceTemplate";
import { NexusGenInputs } from "../../generated/nexus";

export interface DialogueServiceType {
  findDialoguesByCustomerId(customerId: string): Promise<(Dialogue & { tags: Tag[]; })[]>;
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
  generateFakeData: (dialogueId: string, template: WorkspaceTemplate) => Promise<void>;
  initDialogue: (customerId: string, title: string, dialogueSlug: string, description: string, publicTitle?: string, tags?: Array<{
    id: string;
  }>) => Promise<Dialogue | null>;
  copyDialogue: (templateId: string, customerId: string, title: string, dialogueSlug: string, description: string, publicTitle?: string, tags?: Array<{
    id: string;
  }>) => Promise<Dialogue>;
  createDialogue: (input: NexusGenInputs['CreateDialogueInputType']) => Promise<Dialogue>;
}