import { PrismaClient, TriggerUpdateInput, TriggerCreateInput, Trigger } from "@prisma/client";
import { TriggerPrismaAdapterType } from "./TriggerPrismaAdapterType";

class TriggerPrismaAdapter implements TriggerPrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  create(data: TriggerCreateInput): Promise<Trigger> {
    return this.prisma.trigger.create({
      data,
    });
  };

  update(triggerId: string, data: TriggerUpdateInput): Promise<Trigger | null> {
    return this.prisma.trigger.update({
      where: {
        id: triggerId,
      },
      data,
    });
  };

  getById(triggerId: string) {
    return this.prisma.trigger.findOne({
      where: { id: triggerId },
      include: {
        conditions: true,
        recipients: true,
        relatedNode: true,
      },
    });
  };

  delete(triggerId: string): Promise<Trigger | null> {
    return this.prisma.trigger.delete({ where: { id: triggerId } });
  }
}

export default TriggerPrismaAdapter;
