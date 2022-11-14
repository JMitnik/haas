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

  public async addAuditEventToActionRequest(requestId: string, auditEventInput: Prisma.AuditEventCreateInput) {
    const auditEvent = await this.auditEventPrismaAdapter.createAuditEvent(auditEventInput);
    return this.auditEventPrismaAdapter.createAuditEventOfActionRequest(auditEvent.id, requestId);
  }

}

export default AuditEventService;
