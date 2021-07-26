import { PrismaClient, VideoEmbeddedNodeUpdateInput, VideoEmbeddedNodeCreateInput, VideoEmbeddedNode } from "@prisma/client";

import { CreateVideoEmbeddedNodeInput } from "./VideoNodePrismaAdapterType";

class VideoNodePrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  getNodeById(nodeId: string): Promise<VideoEmbeddedNode | null> {
    return this.prisma.videoEmbeddedNode.findOne({
      where: {
        id: nodeId,
      }
    })
  }

  delete(id: string): Promise<VideoEmbeddedNode> {
    return this.prisma.videoEmbeddedNode.delete({
      where: {
        id,
      }
    });
  };

  createVideoNode(data: CreateVideoEmbeddedNodeInput) {
    const { parentNodeId, videoUrl } = data;
    return this.prisma.videoEmbeddedNode.create({
      data: {
        videoUrl: videoUrl,
        QuestionNode: parentNodeId ? {
          connect: {
            id: parentNodeId,
          },
        } : undefined,
      },
    });
  }

  create(data: VideoEmbeddedNodeCreateInput): Promise<VideoEmbeddedNode> {
    return this.prisma.videoEmbeddedNode.create({
      data,
    })
  }

  update(nodeId: string, data: VideoEmbeddedNodeUpdateInput): Promise<VideoEmbeddedNode> {
    return this.prisma.videoEmbeddedNode.update({
      where: { id: nodeId },
      data: data,
    });
  };
}

export default VideoNodePrismaAdapter;