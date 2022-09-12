import { Prisma, PrismaClient } from '@prisma/client';
import { ActionableFilterInput } from 'models/actionable/Actionable.types';
import { IssueFilterInput } from './Issue.types';
import { buildFindIssuesWhereInput } from './IssuePrismaAdapter.helper';

class IssuePrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  };

  public async findIssuesByWorkspaceId(workspaceId: string, filter: IssueFilterInput) {
    return this.prisma.issue.findMany({
      where: buildFindIssuesWhereInput(workspaceId, filter),
      include: {
        topic: true,
        actionables: {
          where: {
            createdAt: {
              gte: filter?.startDate,
              lte: filter?.endDate,
            },
          },
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
