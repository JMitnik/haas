import { PrismaClient, LinkCreateInput, LinkUpdateInput, Link } from "@prisma/client";

import { CreateLinkInput, UpdateLinkInput } from "./LinkPrismaAdapterType";

class LinkPrismaAdapter {
  prisma: PrismaClient
  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  findManyByParentId(parentId: string): Promise<Link[]> {
    return this.prisma.link.findMany({
      where: {
        questionNodeId: parentId,
      },
    });
  }

  upsertLink(linkId: string, create: CreateLinkInput, update: UpdateLinkInput) {
    return this.prisma.link.upsert({
      where: { id: linkId },
      create: {
        title: create.title,
        type: create.type,
        url: create.url,
        backgroundColor: create.backgroundColor,
        iconUrl: create.iconUrl,
        questionNode: {
          connect: {
            id: create.questionId,
          }
        }
      },
      update: {
        title: update.title,
        type: update.type,
        url: update.url,
        backgroundColor: update.backgroundColor,
        iconUrl: update.iconUrl,
      }
    });
  }

  upsert(id: string | null | undefined, create: LinkCreateInput, update: LinkUpdateInput) {
    return this.prisma.link.upsert({
      where: { id: id || '-1' },
      create,
      update,
    })
  };

  deleteMany(linkIds: string[]) {
    return this.prisma.link.deleteMany({ where: { id: { in: linkIds } } });
  }



}

export default LinkPrismaAdapter;
