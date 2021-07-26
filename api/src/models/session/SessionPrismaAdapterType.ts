import { NexusGenInputs } from "../../generated/nexus";

export interface CreateSessionInput {
  dialogueId: string;
  originUrl: string;
  totalTimeInSec: number;
  device: string;
  entries: NexusGenInputs['NodeEntryInput'][];
};