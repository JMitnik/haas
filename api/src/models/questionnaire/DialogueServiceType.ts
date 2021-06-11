import { Dialogue, Tag, QuestionNode, FormNode, FormNodeField, SliderNode, SliderNodeMarker, SliderNodeRange, Edge } from "@prisma/client";
import { WorkspaceTemplate } from "../templates/defaultWorkspaceTemplate";
import { NexusGenInputs } from "../../generated/nexus";

export interface CopyDialogueInputType {
  customerSlug: string;
  dialogueSlug: string;
  templateId: string;
  title: string;
  publicTitle: string;
  description: string;
  dialogueTags: { entries?: string[] | null | undefined; } | null | undefined;
}

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
  copyDialogue: (input: CopyDialogueInputType) => Promise<Dialogue>;
  createDialogue: (input: NexusGenInputs['CreateDialogueInputType']) => Promise<Dialogue>;
  getTagsByDialogueId(dialogueId: string): Promise<Tag[]>;
  getRootQuestionByDialogueId(dialogueId: string): Promise<(QuestionNode & {
    form: (FormNode & {
      fields: FormNodeField[];
    }) | null;
    sliderNode: (SliderNode & {
      markers: (SliderNodeMarker & {
        range: SliderNodeRange;
      })[];
    }) | null;
  })>
  getEdgesByDialogueId(dialogueId: string): Promise<Edge[]>;
  getQuestionsByDialogueId(dialogueId: string): Promise<(QuestionNode & {
    form: (FormNode & {
      fields: FormNodeField[];
    }) | null;
    sliderNode: (SliderNode & {
      markers: (SliderNodeMarker & {
        range: SliderNodeRange;
      })[];
    }) | null;
  })[]>;
  getCTAsByDialogueId(dialogueId: string, searchTerm?: string | null | undefined): Promise<(QuestionNode & {
    form: (FormNode & {
      fields: FormNodeField[];
    }) | null;
  })[]>;
  getDialogueById(dialogueId: string): Promise<Dialogue | null>;
  getFilteredDialogues(searchTerm?: string | null | undefined): Promise<(Dialogue & {
    tags: Tag[];
  })[]>;
  updateTags(dialogueId: string, entries?: string[] | null | undefined): Promise<Dialogue>;
}