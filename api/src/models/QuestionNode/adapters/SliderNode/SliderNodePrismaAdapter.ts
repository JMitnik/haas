import { PrismaClient, VideoEmbeddedNodeUpdateInput, VideoEmbeddedNodeCreateInput, SliderNodeUpdateInput, SliderNodeCreateInput } from "@prisma/client";
import { SliderNodePrismaAdapterType } from "./SliderNodePrismaAdapterType";

class SliderNodePrismaAdapter implements SliderNodePrismaAdapterType {
  prisma: PrismaClient;
  
  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  update(nodeId: string, data: SliderNodeUpdateInput): Promise<import("@prisma/client").SliderNode> {
    return this.prisma.sliderNode.update({
      where: { id: nodeId },
      data,
    });
  };
  
  create(data: SliderNodeCreateInput): Promise<import("@prisma/client").SliderNode> {
    return this.prisma.sliderNode.create({
      data,
    });
  };
  
 
}

export default SliderNodePrismaAdapter;