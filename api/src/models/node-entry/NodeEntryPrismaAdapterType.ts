import { NodeEntry, SliderNodeEntry, BatchPayload } from "@prisma/client";

export interface NodeEntryPrismaAdapterType {
  getNodeEntriesBySessionIds(sessionIds: string[]): Promise<NodeEntry[]>;
  deleteManySliderNodeEntries(sliderNodeEntryIds: string[]): Promise<BatchPayload>;
  deleteManyTextBoxNodeEntries(textBoxNodeEntryIds: string[]): Promise<BatchPayload>;
  deleteManyRegistrationNodeEntries(registrationNodeEntryIds: string[]): Promise<BatchPayload>;
  deleteManyLinkNodeEntries(nodeEntryIds: string[]): Promise<BatchPayload>;
  deleteManyChoiceNodeEntries(nodeEntryIds: string[]): Promise<BatchPayload>;
  deleteManyNodeEntries(sessionIds: string[]): Promise<BatchPayload>;
}