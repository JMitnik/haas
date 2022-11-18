import {
  Prisma,
  PrismaClient,
} from '@prisma/client';


class AuditEventPrismaAdapter {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public findManyAuditEventOfActionRequest(where: Prisma.AuditEventOfActionRequestWhereInput) {
    return this.prisma.auditEventOfActionRequest.findMany({
      where,
    });
  };

  public findMany(where: Prisma.AuditEventWhereInput) {
    return this.prisma.auditEvent.findMany({
      where,
    })
  }

  public createAuditEvent(data: Prisma.AuditEventCreateInput) {
    return this.prisma.auditEvent.create({
      data,
    });
  };

  public createAuditEventOfActionRequest(auditEventId: string, actionRequestId: string) {
    return this.prisma.auditEventOfActionRequest.create({
      data: {
        auditEventId,
        actionRequest: {
          connect: {
            id: actionRequestId,
          },
        },
      },
    });
  };

}

export default AuditEventPrismaAdapter;
