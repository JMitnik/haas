import { SliderNodeUpdateInput, SliderNode, SliderNodeCreateInput } from "@prisma/client";

export interface SliderNodePrismaAdapterType {
  update(nodeId: string, data: SliderNodeUpdateInput): Promise<SliderNode>;
  create(data: SliderNodeCreateInput): Promise<SliderNode>;
}