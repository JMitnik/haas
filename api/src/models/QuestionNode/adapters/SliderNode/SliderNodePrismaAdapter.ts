import { PrismaClient, SliderNodeUpdateInput, SliderNodeCreateInput, SliderNode } from "@prisma/client";

interface UpdateSliderNodeInput {
  happyText: string | null;
  unhappyText: string | null;
  markers?: {
    id?: string | null | undefined;
    label: string;
    range?: {
      end?: number | null | undefined;
      start?: number | null | undefined;
    } | null | undefined;
    subLabel: string;
  }[] | null | undefined;
}

interface CreateSliderNodeInput extends UpdateSliderNodeInput {
  parentNodeId: string;
}

class SliderNodePrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  updateSliderNode(parentNodeId: string, data: UpdateSliderNodeInput) {
    const { happyText, unhappyText, markers } = data;
    return this.prisma.sliderNode.update({
      where: { id: parentNodeId },
      data: {
        happyText,
        unhappyText,
        markers: {
          update: markers?.map((marker) => ({
            where: { id: marker?.id || undefined },
            data: {
              label: marker.label,
              subLabel: marker.subLabel,
            },
          })),
        }
      },
    });
  }

  update(nodeId: string, data: SliderNodeUpdateInput): Promise<SliderNode> {
    return this.prisma.sliderNode.update({
      where: { id: nodeId },
      data,
    });
  };

  createSliderNode(data: CreateSliderNodeInput) {
    const { parentNodeId, markers, unhappyText, happyText } = data;
    return this.prisma.sliderNode.create({
      data: {
        unhappyText,
        happyText,
        QuestionNode: {
          connect: {
            id: parentNodeId,
          },
        },
        markers: {
          create: markers?.map((marker) => ({
            label: marker.label || '',
            subLabel: marker.subLabel || '',
            range: {
              create: {
                start: marker?.range?.start || undefined,
                end: marker?.range?.end || undefined,
              },
            },
          })),
        },
      },
    });
  };

  create(data: SliderNodeCreateInput): Promise<SliderNode> {
    return this.prisma.sliderNode.create({
      data,
    });
  };


}

export default SliderNodePrismaAdapter;