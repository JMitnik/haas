import { NexusGenInputs } from '../../generated/nexus';

export interface CreateSessionInput {
  createdAt?: string;
  dialogueId: string;
  originUrl: string;
  totalTimeInSec: number;
  device: string;
  entries: NexusGenInputs['NodeEntryInput'][];
  mainScore?: number;
};