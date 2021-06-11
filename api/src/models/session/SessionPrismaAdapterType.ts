import { SessionCreateInput, Session, BatchPayload } from "@prisma/client";

export interface SessionPrismaAdapterType {
  createFakeSession(data: (
    {
      createdAt: Date,
      dialogueId: string,
      rootNodeId: string,
      simulatedRootVote: number,
      simulatedChoiceNodeId: string,
      simulatedChoiceEdgeId?: string,
      simulatedChoice: string,
    })): Promise<Session>;

    deleteMany(sessionIds: string[]): Promise<BatchPayload>;
    getSessionById(sessionId: string): Promise<Session|null>;
}