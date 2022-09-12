import { Prisma, PrismaClient } from '@prisma/client';
import { ActionableFilterInput } from 'models/actionable/Actionable.types';

class IssuePrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  };

  public async findIssuesByWorkspaceId(workspaceId: string) {
    return this.prisma.issue.findMany({
      where: {
        workspaceId,
      },
      include: {
        topic: true,
        actionables: {
          include: {
            assignee: true,
            comments: true,
            dialogue: true,
            session: true,
          },
        },
      },
    })
  }

  public async findIssueById(id: string) {
    return this.prisma.issue.findUnique({
      where: {
        id,
      },
      include: {
        topic: true,
        actionables: {
          include: {
            assignee: true,
            comments: true,
            dialogue: true,
            session: true,
          },
        },
      },
    });
  }

  public async findIssueByTopicId(topicId: string) {
    return this.prisma.issue.findUnique({
      where: {
        topicId,
      },
      include: {
        topic: true,
        actionables: {
          include: {
            assignee: true,
            comments: true,
            dialogue: true,
            session: true,
          },
        },
      },
    });
  }

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
