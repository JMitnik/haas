import {
  Prisma,
  PrismaClient,
} from '@prisma/client';
import AuditEventPrismaAdapter from './AuditEventPrismaAdapter';


class AuditEventService {
  private auditEventPrismaAdapter: AuditEventPrismaAdapter;

  constructor(prisma: PrismaClient) {
    this.auditEventPrismaAdapter = new AuditEventPrismaAdapter(prisma);
  }

  public async findMany(where: Prisma.AuditEventWhereInput) {
    return this.auditEventPrismaAdapter.findMany(where);
  }

  public async findManyByActionRequestId(actionRequestId: string) {
    const auditEventOfActionRequestManyInput: Prisma.AuditEventOfActionRequestWhereInput = {
      actionRequestId,
    }

    const auditEventsOfActionRequest = await this.auditEventPrismaAdapter.findManyAuditEventOfActionRequest(
      auditEventOfActionRequestManyInput
    );

    const auditEventIds = auditEventsOfActionRequest.map((entry) => entry.auditEventId);

    const whereInput: Prisma.AuditEventWhereInput = {
      id: {
        in: auditEventIds,
      },
    }

    return this.auditEventPrismaAdapter.findMany(whereInput);
  }

  /**
   * Adds an audit event to indicate a change to action request
   * @param requestId 
   * @param auditEventInput 
   * @returns 
   */
  public async addAuditEventToActionRequest(requestId: string, auditEventInput: Prisma.AuditEventCreateInput) {
    const auditEvent = await this.auditEventPrismaAdapter.createAuditEvent(auditEventInput);
    return this.auditEventPrismaAdapter.createAuditEventOfActionRequest(auditEvent.id, requestId);
  }

}

export default AuditEventService;
