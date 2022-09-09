import { Prisma, PrismaClient } from '@prisma/client';

class IssuePrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  };

  public async upsertIssueByTopicId(workspaceId: string, topicId: string) {
    return this.prisma.issue.upsert({
      where: {
        topicId: topicId,
      },
      create: {
        topic: {
          connect: {
            id: topicId,
          },
        },
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
      },
      update: {},
    })
  }

};



export default IssuePrismaAdapter;
