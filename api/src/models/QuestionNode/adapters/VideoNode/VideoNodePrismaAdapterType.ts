import { VideoEmbeddedNodeUpdateInput, VideoEmbeddedNode, VideoEmbeddedNodeCreateInput } from "@prisma/client";

export interface VideoNodePrismaAdapterType {
  update(nodeId: string, data: VideoEmbeddedNodeUpdateInput): Promise<VideoEmbeddedNode>;
  create(data: VideoEmbeddedNodeCreateInput): Promise<VideoEmbeddedNode>;
  delete(id: string): Promise<VideoEmbeddedNode>;
}