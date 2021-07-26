import { PrismaClient, Tag, TagCreateInput, TagEnum } from "@prisma/client";
import { CreateTagInput } from "./TagPrismaAdapterType";

class TagPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }
  delete(tagId: string): Promise<Tag> {
    return this.prisma.tag.delete({
      where: {
        id: tagId,
      }
    })
  }

  createTag(data: CreateTagInput) {
    const { name, type, customerId } = data;
    return this.prisma.tag.create({
      data: {
        name,
        type,
        customer: {
          connect: {
            id: customerId,
          },
        },
      },
    });
  }

  create(data: TagCreateInput): Promise<Tag> {
    return this.prisma.tag.create({
      data,
    });
  };

  findManyByDialogueId(dialogueId: string): Promise<Tag[]> {
    return this.prisma.tag.findMany({
      where: {
        isTagOf: { some: { id: dialogueId } },
      },
    });
  }

  // FIXME: Cannot used this in prisma.transaction
  async deleteAllByCustomerId(customerId: string) {
    return this.prisma.tag.deleteMany({ where: { customerId } });
  }


}

export default TagPrismaAdapter;
