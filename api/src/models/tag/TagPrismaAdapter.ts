import { TagPrismaAdapterType } from "./TagPrismaAdapterType";
import { PrismaClient, Tag, TagCreateInput } from "@prisma/client";

class TagPrismaAdapter implements TagPrismaAdapterType {
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
