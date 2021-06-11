import { VideoNodePrismaAdapterType } from "./VideoNodePrismaAdapterType";
import { PrismaClient, VideoEmbeddedNodeUpdateInput, VideoEmbeddedNodeCreateInput } from "@prisma/client";

class VideoNodePrismaAdapter implements VideoNodePrismaAdapterType {
  prisma: PrismaClient;
  
  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  getNodeById(nodeId: string): Promise<import("@prisma/client").VideoEmbeddedNode | null> {
    return this.prisma.videoEmbeddedNode.findOne({
      where: {
        id: nodeId,
      }
    })
  }

  delete(id: string): Promise<import("@prisma/client").VideoEmbeddedNode> {
    return this.prisma.videoEmbeddedNode.delete({
      where: {
        id,
      }
    });
  };
  
  create(data: VideoEmbeddedNodeCreateInput): Promise<import("@prisma/client").VideoEmbeddedNode> {
    return this.prisma.videoEmbeddedNode.create({
      data,
    })
  }

  update(nodeId: string, data: VideoEmbeddedNodeUpdateInput): Promise<import("@prisma/client").VideoEmbeddedNode> {
    return this.prisma.videoEmbeddedNode.update({
      where: { id: nodeId },
      data: data,
    });
  };
}

export default VideoNodePrismaAdapter;